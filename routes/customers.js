const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

router.get('/', async (req, res) => {
    try {
        const result = await Customer
            .find()
            .sort({ name: 1 })
            .select({ isGold: 1, name: 1, phone: 1 });

        return res.send(result);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const result = await Customer.findOne({ _id: req.params.id });
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

    const customer = new Customer({
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone
    });

    try {
        return res.send(await customer.save());
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
        const result = await Customer.updateOne({ _id: req.params.id }, {
            $set: {
                isGold: req.body.isGold,
                name: req.body.name,
                phone: req.body.phone
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
        const result = await Customer.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            return res.send(`The customer with the ID ${req.params.id} was successfully deleted.`);
        }

        return res.status(404).send(`The customer with the ID ${req.params.id} has not been found.`);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

module.exports = router;
