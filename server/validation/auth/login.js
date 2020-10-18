const Joi = require("joi");

const validatingSchema = Joi.object().keys({
    login: Joi.string()
        .required(),
    
    pass: Joi.string()
        .required()

});

module.exports = (req, res) => {
    const {error, value} = validatingSchema.validate(req.body);

    if(error !== undefined) res.json({message: error.details.map(detail => detail.message)}, 400);

    return value;
}

