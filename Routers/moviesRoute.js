const express = require('express');
const moviesController = require('../Controllers/moviesController');
const userController = require('../Controllers/userController');

const router = express.Router();

router.route('/highest-rated')
    .get(userController.protect, moviesController.getHighestRated, moviesController.getAllMovies);
    

router.route('/')
    .get(userController.protect, moviesController.getAllMovies)
    .post(moviesController.createAMovie);

router.route('/:id')
    .get(userController.protect, moviesController.getAMovie)
    .patch(moviesController.updateAMovie)
    .delete(moviesController.deleteAMovie);


module.exports = router;