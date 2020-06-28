const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');

router.get('/', async (req, res) => {
    try {
        const genres = await Genre
            .find()
            .sort({ name: 1 })
            .select({ name: 1 });

        res.send(genres);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }

});

router.get('/:id', async (req, res) => {
    try {
        const genre = await Genre.findOne({ _id: req.params.id });

        if (!genre) {
            return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
        }

        res.send(genre);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.post('/', async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Prepare
    const genre = new Genre({
        name: req.body.name
    });

    // Add
    try {
        await genre.save();
        res.send(genre);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.put('/:id', async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        await Genre.updateOne({ _id: req.params.id }, {
            $set: {
                name: req.body.name
            }
        });

        res.send(req.body);
    } catch (ex) {
        return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Genre.deleteOne({ _id: req.params.id });

        if (result.deletedCount > 0) {
            res.send(`The genre of the given ID = ${req.params.id} was successfully deleted.`);
        } else {
            return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
        }
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

module.exports = router;