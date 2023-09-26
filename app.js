const express = require('express');
const moviesRoute = require('./Routers/moviesRoute');
const app = express();

app.use(express.json());
app.use('/api/v1/movies', moviesRoute);



module.exports = app;