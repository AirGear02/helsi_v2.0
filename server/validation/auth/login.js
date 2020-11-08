const Joi = require("joi");

const validatingSchema = Joi.object().keys({
    login: Joi.string()
        .required(),
    
    pass: Joi.string()
        .required()

});

module.exports = (req, res) => {
    const {error, value} = validatingSchema.validate(req.body);

    if(error !== undefined) return res.status(400).json({message: error.details.map(detail => detail.message)});

    return value;
}

