const { Op } = require('sequelize');
const express = require('express');


const Person = require('../models/Person');
const validateLogin = require('../validation/auth/login');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

require('dotenv').config();


router.post('/login', async (req, res) => {
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