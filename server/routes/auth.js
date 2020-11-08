const { Op, QueryTypes} = require('sequelize');
const Sequelize = require('../config/database');
const express = require('express');

const multer = require('multer');
const upload = multer();

const Person = require('../models/Person');
const validateLogin = require('../validation/auth/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

require('dotenv').config();


/**
 *  @swagger
 *  /auth/login:
 *    post:
 *      tags:
 *      - "Auth"
 *      summary: Sign in using login and password
 *      description: Sign in using login and password
 *      requestBody: 
 *        content: 
 *          multipart/form-data:
 *            schema:
 *              required:
 *                  login, password
 *              type: object
 *              properties:
 *                login:
 *                  type: string
 *                  description: email or phone number
 *                  example: user@mail.com
 *                pass: 
 *                  type: string
 *                  example: user1234
 *                  
 *      responses: 
 *        200: 
 *          description: Successfully logged in
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  token:
 *                    type: string
 *                    example: qwkejiwquIUIUAOOIUIWUE
 *        400: 
 *          description: Invalid login or password
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  message:
 *                    type: string
 *                    example: No user with such login
 * 
 *   
 */
router.post('/login', upload.none(), async (req, res) => {
    const value = await validateLogin(req, res);

    const person = await Person.findOne({where: {
        [Op. or] : [{email: value.login}, {phone_number: value.login}]
    }});
    
    if(person === null) return res.status(400).json({message: 'Немає користувача з такими даними'});

    const isPasswordSamae = await bcrypt.compare(value.pass, person.pass);
    if(! isPasswordSamae) return res.status(400).json({message: 'Неправильний пароль'});

    const user = {
        id:person.id, 
        first_name: person.first_name, 
        last_name: person.last_name, 
        role: person.role
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    await Sequelize.query('INSERT INTO tokens VALUES($token)', {
        type: QueryTypes.INSERT, 
        bind: { token: refreshToken}
    });



    return res.status(200).json({message: 'Successfully logged in', token: accessToken, refreshToken: refreshToken});

});

/**
 *  @swagger
 *  /auth/refreshToken:
 *    post:
 *      tags:
 *      - "Auth"
 *      summary: Resfresh access token using resfresh token
 *      description: Resfresh access token using resfresh token
 *      security: 
 *        - bearerAuth: []
 *      requestBody: 
 *        content: 
 *          multipart/form-data:
 *            schema:
 *              required:
 *                  refreshToken
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *                  description: refresh token, give when logging in
 *                  example: skfhUIYUIWYUR
 *      responses: 
 *        200: 
 *          description: Successfully refreshed
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  token:
 *                    type: string
 *                    example: qwkejiwquIUIUAOOIUIWUE
 *        401: 
 *          description: Invalid refresh token or access token were passed
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  message:
 *                    type: string
 *                    example: Invalid refresh token
 * 
 *   
 */
router.post('/refreshToken', upload.none(), async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === undefined) {
        return res.status(401).json({message: 'Please authorize'});
    }

    const result = await Sequelize.query('SELECT Count(id) FROM tokens WHERE id=$token', {
        type: QueryTypes.SELECT,
        bind: {token: req.body.refreshToken}
    });

    if(result[0].count === 0) return res.status(401).json({message: 'Invalid refresh token'});

    return jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.json(401).json({message: err.message});

        const person  = await Person.findByPk(decoded.id);
        const user = {
            id:person.id, 
            first_name: person.first_name, 
            last_name: person.last_name, 
            role: person.role
        }
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'});
        return res.status(200).json({token: accessToken});
    });
});


/**
 *  @swagger
 *  /auth/logout:
 *    post:
 *      tags:
 *      - "Auth"
 *      summary: Logging out
 *      description: Logging out and deleting refreshToken from DB 
 *      security: 
 *        - bearerAuth: []
 *      requestBody: 
 *        content: 
 *          multipart/form-data:
 *            schema:
 *              required:
 *                  refreshToken
 *              type: object
 *              properties:
 *                refreshToken:
 *                  type: string
 *                  description: refresh token, given when logging in
 *                  example: skfhUIYUIWYUR
 *      responses: 
 *        200: 
 *          description: Successfully logged out
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  token:
 *                    type: string
 *                    example: qwkejiwquIUIUAOOIUIWUE
 *        401: 
 *          description: Invalid refresh token or access token were passed
 *          content: 
 *            application/json:
 *              schema:
 *                type: object
 *                properties: 
 *                  message:
 *                    type: string
 *                    example: Invalid access token
 * 
 *   
 */
router.post('/logout', upload.none(), async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token === undefined || req.body.refreshToken === undefined) {
        return res.status(401).json({message: 'Please authorize'});
    }

    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) return res.status(401).json({message: 'Please authorize'});

        await Sequelize.query('DELETE FROM tokens WHERE id=$token', {
            type: QueryTypes.DELETE,
            bind: {token: req.body.refreshToken}
        });
        return res.status(200).json({message: 'User successfully loged out'});
    });
});

module.exports = router;