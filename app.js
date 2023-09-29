const express = require('express');
const moviesRoute = require('./Routers/moviesRoute');
const userRoute = require('./Routers/usersRoute');
const globalErrorHandler = require('./Controllers/globalErrorController');
const AppError = require('./Utils/appError');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.enable('trust proxy');
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: "Welcome to myingineer's movie-mentor API. Read the documentation for usage",
        githubRepo: "https://github.com/myingineer/movie-mentor.git",
        docs: "You can find the documentation in the README file of the repo"
    });
});
app.use('/api/v1/movies', moviesRoute);
app.use('/api/v1/users', userRoute);
app.all('*', (req, res, next) => {
    const error = new AppError(`Page ${req.url} not found`);
    next(error);
});


app.use(globalErrorHandler);
module.exports = app;