const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
    try {
        const result = await User.find()
            .sort({ name: 1 })
            .select({ name: 1, email: 1, password: 1 });

        return res.send(result);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const result = await User.findOne({ _id: req.params.id });
        if (!result) {
            return res.status(404).send(`The given ID ${req.params.id} has not been found.`);
        }

        return res.send(result);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.post("/", async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        return res.send(await user.save());
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.put("/:id", async (req, res) => {
    // Validate
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    try {
        const result = await User.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                },
            }
        );

        if (result.n === 0) {
            return res.status(404).send(`The given ID ${req.params.id} has not been found.`);
        }

        return res.send(req.body);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            return res.send(`The user with the ID ${req.params.id} was successfully deleted.`);
        }

        return res.status(404).send(`The user with the ID ${req.params.id} has not been found.`);
    } catch (ex) {
        return res.status(400).send(ex.message);
    }
});

module.exports = router;
