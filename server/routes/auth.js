const { Op } = require('sequelize');
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
router.post('/login', upload.none(),async (req, res) => {
    const value = await validateLogin(req, res);

    const person = await Person.findOne({where: {
        [Op. or] : [{email: value.login}, {phone_number: value.login}]
    }});
    
    if(person === null) res.json({message: 'No user with such login'}, 400);

    const isPasswordSamae = await bcrypt.compare(value.pass, person.pass);
    if(! isPasswordSamae) res.json({message: 'Invalid password'}, 400);

    const user = {
        id:person.id, 
        first_name: person.first_name, 
        last_name: person.last_name, 
        role: person.role
    }

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600});
    res.status(200).json({message: 'Successfully logged in', token: accessToken});

});

module.exports = router;