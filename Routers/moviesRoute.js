const express = require('express');
const moviesController = require('../Controllers/moviesController');

const router = express.Router();

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createAMovie);


module.exports = router;