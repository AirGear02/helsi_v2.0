const Joi = require('joi');

const checkForeignKey = require('../custom_rules/checkIfForeignExists');

const Person = require('../../models/Person');
const Address = require('../../models/Address');

const validatingSchema = Joi.object().keys({
    first_name: Joi.string().trim()
    .min(2)
    .max(32),

    last_name: Joi.string().trim()
    .min(2)
    .max(32),

    middle_name: Joi.string().trim()
    .min(2)
    .max(32),
    
    addressId: Joi.number()
    .min(1),

    phone_number: Joi.string().trim()
    .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/),

    email: Joi.string().trim()
    .email(),

    photo: Joi.any().allow(null),
    
    date_born: Joi.date()
        .max('now')
        .iso(),
    
    
})

module.exports = async (req, res, next) => {
    const{error, value} = validatingSchema.validate(req.body, {stripUnknown: true, abortEarly: false});

    
    if(error !== undefined) res.status(400).json({message: error.details.map(detail => detail.message)});
    
    if(value.addressId !== undefined) {
        const isAddressExists = await checkForeignKey(value.addressId, Address);
        if(!isAddressExists) res.status(400).json({message: 'Can not find address'});
    }

    if(value.email !== undefined) {
        const personsByEmail = await Person.count({where: {email: value.email}});
        if(personsByEmail !== 0) res.status(400).json({message: 'This email already exists'});
    }
    
    if(value.phone_number !== undefined) {
        const personsByPhone = await Person.count({where: {phone_number: value.phone_number}});
        if(personsByPhone !== 0) res.status(400).json({message: 'This phone number already exists'});
    }
    req.body = value;
    next();
}