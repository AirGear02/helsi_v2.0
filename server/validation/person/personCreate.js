const Joi = require('joi');

const checkForeignKey = require('../custom_rules/checkIfForeignExists');

const Person = require('../../models/Person');
const Address = require('../../models/Address');

const validatingSchema = Joi.object().keys({
    first_name: Joi.string().trim()
    .min(2)
    .max(32)
    .required(),

    last_name: Joi.string().trim()
    .min(2)
    .max(32)
    .required(),

    middle_name: Joi.string().trim()
    .min(2)
    .max(32)
    .required(),
    
    addressId: Joi.number()
    .min(1)
    .required(),

    phone_number: Joi.string().trim()
    .pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
    .required(),

    email: Joi.string().trim()
    .email()
    .lowercase()
    .required(),

    pass: Joi.string()
    .min(8)
    .required(),

    date_born: Joi.date()
        .max('now')
        .iso()
        .required(),
    
    role: Joi.string()
        .valid('Admin', 'User', 'Doctor')
        .required()

})

module.exports = async (req, res) => {
    const{error, value} = validatingSchema.validate(req.body, {stripUnknown: true, abortEarly: false});

    
    if(error !== undefined) res.json({message: error.details.map(detail => detail.message)}, 400);
    
    const isAddressExists = await checkForeignKey(value.addressId, Address);
    if(!isAddressExists) res.json({message: 'Can not find address'}, 400);

  
    const personsByEmail = await Person.count({where: {email: value.email}});
    if(personsByEmail !== 0) res.json({message: 'This email already exists'}, 400);

    const personsByPhone = await Person.count({where: {phone_number: value.phone_number}});
    if(personsByPhone !== 0) res.json({message: 'This phone number already exists'}, 400);

    return value;
}