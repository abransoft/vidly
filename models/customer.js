const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    },
    phone: {
        type: String,
        maxlength: 20,
        trim: true
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
