const Movie = require('../Models/movieModel');

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({
            status: 'Success',
            numberOfMovies: movies.length,
            data: {
                movies
            }
        });
    } catch (error) {
        res.status(400).json({
            status: "Failed",
            message: error.message
        });
    };
};

exports.getAMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status: 'Success',
            data: {
                movie
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'Failed',
            message: error.message
        });
    };
};

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