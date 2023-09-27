const express = require('express');
const moviesController = require('../Controllers/moviesController');

const router = express.Router();

router.route('/highest-rated')
    .get(moviesController.getHighestRated, moviesController.getAllMovies);
    

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createAMovie);

router.route('/:id')
    .get(moviesController.getAMovie)
    .patch(moviesController.updateAMovie)
    .delete(moviesController.deleteAMovie);


module.exports = router;