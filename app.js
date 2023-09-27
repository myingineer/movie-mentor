const express = require('express');
const moviesRoute = require('./Routers/moviesRoute');
const globalErrorHandler = require('./Controllers/globalErrorController');
const AppError = require('./Utils/appError');
const app = express();

app.use(express.json());
app.use('/api/v1/movies', moviesRoute);
app.all('*', (req, res, next) => {
    const error = new AppError(`Page ${req.url} not found`);
    next(error);
});


app.use(globalErrorHandler);
module.exports = app;