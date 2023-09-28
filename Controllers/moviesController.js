const Movie = require('../Models/movieModel');
const ApiFeatures = require('../Utils/apiFeatures');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const AppError = require('../Utils/appError');

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';
    next();
};

exports.getAllMovies = asyncErrorHandler (async (req, res, next) => {

    const features = new ApiFeatures(Movie.find(), req.query)
                                    .sort()
                                    .limitFields()
                                    .pagination();

    const movies = await features.queryObject;
    res.status(200).json({
        status: 'Success',
        numberOfMovies: movies.length,
        data: {
            movies
        }
    });
});

exports.getAMovie = asyncErrorHandler (async (req, res, next) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        const error = new AppError(`Movie with ID ${req.params.id} not found`, 404);
        return next(error);
    };
    
    res.status(200).json({
        status: 'Success',
        data: {
            movie
        }
    });

});

exports.createAMovie = asyncErrorHandler (async (req, res, next) => {

    const movie = await Movie.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            movie
        }
    });

});

exports.updateAMovie = asyncErrorHandler (async (req, res, next) => {

    const movieToUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if(!movieToUpdate) {
        const error = new AppError(`Movie with ID ${req.params.id} not found`, 404);
        return next(error);
    };

    res.status(200).json({
        status: "success",
        data: {
            movie: movieToUpdate
        }
    });        

});

exports.deleteAMovie = asyncErrorHandler (async (req, res, next) => {

    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
    
    if (!deletedMovie) {
        const error = new AppError(`Could not find movie with ID ${req.params.id} to delete`, 404);
        return next(error);
    };

    res.status(204).json({
        status: "success",
        data: null
    });


});