const express = require('express');
const moviesController = require('../Controllers/moviesController');
const userController = require('../Controllers/userController');

const router = express.Router();

router.route('/highest-rated')
    .get(userController.protect, moviesController.getHighestRated, moviesController.getAllMovies);
    

router.route('/')
    .get(userController.protect, moviesController.getAllMovies)
    .post(userController.protect, userController.adminOnly('admin'), moviesController.createAMovie);

router.route('/:id')
    .get(userController.protect, moviesController.getAMovie)
    .patch(userController.protect, userController.adminOnly('admin'), moviesController.updateAMovie)
    .delete(userController.protect, userController.adminOnly('admin'), moviesController.deleteAMovie);


module.exports = router;