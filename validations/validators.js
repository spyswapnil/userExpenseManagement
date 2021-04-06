const Joi = require('joi');
// validating the request coming for APIs
function validateUser(data, type) {
    if(type == "user") {
        const userSchema = Joi.object({
            email: Joi.string()
                .email().required(),
            password: Joi.string()
                .min(8).required()
        })
        return userSchema.validate(data);
    } else if(type == "expense") {
        const expenseSchema = Joi.object({
            email: Joi.string()
                .email().required(),
            expenseName: Joi.string().min(1).required(),
            expenseAmount: Joi.number().integer().min(1).max(10000)
        })
        return expenseSchema.validate(data);
    } else {
        const getSchema = Joi.object({
            email: Joi.string().email().required()
        })
        return getSchema.validate(data);
    }    
}

module.exports = {
    validateUser
}