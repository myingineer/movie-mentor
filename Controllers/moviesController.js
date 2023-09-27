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

exports.createAMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message
        });
    };
};

exports.updateAMovie = async (req, res) => {
    try {
        const movieToUpdate = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate
            }
        });        
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message
        });
    };
};

exports.deleteAMovie = async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: "success",
            data: null
        });
    } catch (error) {
        res.status(400).json({
            status: 'Failed',
            message: error.message
        });
    };
};