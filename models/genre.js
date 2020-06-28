const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        trim: true
    }
}));

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(5).required()
    });

    return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
