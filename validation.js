const joi = require('@hapi/joi');

const registerValidation=(data)=>{
    const joiSchema= joi.object({
        username: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
        bio:joi.string().min(6),
        contact:joi.string().min(6),
        icon: joi.string().min(6),
    });
    return joiSchema.validate(data);
}

const loginValidation=(data)=>{
    const joiSchema= joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required()

    });
    return joiSchema.validate(data);
}

const profileValidation=(data)=>{
    const joiSchema= joi.object({
    username: joi.string().min(6),
    email: joi.string().min(6).email(),
    password: joi.string().min(6),
    bio:joi.string().min(6),
    contact:joi.string().min(6),
    icon: joi.string().min(6)
    });
    return joiSchema.validate(data);
}

const postValidation=(data)=>{
    const joiSchema= joi.object({
        title:joi.string().min(6).required(),
        salary:joi.string().min(6).required(),
        desc:joi.string().min(6).required()
    });
    return joiSchema.validate(data)
}


module.exports.registerValidation=registerValidation
module.exports.loginValidation=loginValidation
module.exports.profileValidation=profileValidation
module.exports.postValidation=postValidation
