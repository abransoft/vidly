const express = require('express');
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('MongoDB connected...'))
    .catch(() => console.log('MongoDB has not been connected'));

const app = express();

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
