const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const User = mongoose.model("User", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 50,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 22,
        trim: true,
    },
})
);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(50).email({ minDomainSegments: 2 }).required(),
        password: Joi.string().alphanum().min(6).max(22).required(),
    });

    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
