const express = require('express');
const Joy = require('@hapi/joi');

const app = express();
app.use(express.json());

const genres = [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Horror' },
    { id: 3, name: 'Drama' }
];

app.get('/api/genres', (req, res) => {
    res.send(genres);
});

app.get('/api/genres/:id', (req, res) => {
    // Look up
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if (!genre) {
        return res.status(404).send(`The genre of the given ID = ${req.params.id} was not found.`);
    }

    res.send(genre);
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
