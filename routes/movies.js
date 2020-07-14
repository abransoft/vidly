const express = require('express');
const router = express.Router();
const { Genre } = require('../models/genre');
const { Movie, validate } = require('../models/movie');

router.get('/', async (req, res) => {
    try {
        const result = await Movie
            .find()
            .sort({ title: 1 })
            .select({ title: 1, genre: 1, numberInStock: 1, dailyRentalRate: 1 });

        return res.send(result);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await Movie.findOne({ _id: req.params.id });
        if (!result) {
            return res.status(404).send(`The given ID ${req.params.id} has not been found.`);
        }

        return res.send(result);

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

    try {
        // Validates if the genre ID exists and get it
        const genre = await Genre.findOne({ _id: req.body.genreId });
        if (!genre) {
            return res.status(400).send('Invalid genre.');
        }

        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        });

        return res.send(await movie.save());
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
        // Validates if the genre ID exists and get it
        const genre = await Genre.findOne({ _id: req.body.genreId });
        if (!genre) {
            return res.status(400).send('Invalid genre.');
        }

        const result = await Movie.updateOne({ _id: req.params.id }, {
            $set: {
                title: req.body.title,
                genre: {
                    _id: genre._id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            }
        });

        if (result.n === 0) {
            return res.status(404).send(`The given ID ${req.params.id} has not been found.`);
        }

        return res.send(req.body);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const result = await Movie.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            return res.send(`The customer with the ID ${req.params.id} was successfully deleted.`);
        }

        return res.status(404).send(`The customer with the ID ${req.params.id} has not been found.`);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

module.exports = router;
