const express = require('express');
const Joi = require('@hapi/joi');

const router = express.Router();

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Horror' },
    { id: 3, name: 'Drama' }
];

router.get('/', (req, res) => {
    res.send(genres);
});

router.get('/:id', (req, res) => {
    // Look up
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
    }

    res.send(genre);
});

router.post('/', (req, res) => {
    // Validate
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Prepare
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    // Add
    genres.push(genre);
    res.send(genre);
});

router.put('/:id', (req, res) => {
    // Look up
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
    }

    // Validate
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Update
    genre.name = req.body.name;
    res.send(genre);

});

router.delete('/:id', (req, res) => {
    // Look up
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        return res.status(404).send(`The genre from the given ID = ${req.params.id} was not found.`);
    }

    // Delete
    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(genre);
}

module.exports = router;