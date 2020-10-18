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


    date_born: Joi.date()
        .max('now')
        .iso(),
    
})

module.exports = async (req, res) => {
    const{error, value} = validatingSchema.validate(req.body, {stripUnknown: true, abortEarly: false});

    
    if(error !== undefined) res.json({message: error.details.map(detail => detail.message)}, 400);
    
    if(value.addressId !== undefined) {
        const isAddressExists = await checkForeignKey(value.addressId, Address);
        if(!isAddressExists) res.json({message: 'Can not find address'}, 400);
    }

    if(value.email !== undefined) {
        const personsByEmail = await Person.count({where: {email: value.email}});
        if(personsByEmail !== 0) res.json({message: 'This email already exists'}, 400);
    }
    
    if(value.phone_number !== undefined) {
        const personsByPhone = await Person.count({where: {phone_number: value.phone_number}});
        if(personsByPhone !== 0) res.json({message: 'This phone number already exists'}, 400);
    }
    return value;
}