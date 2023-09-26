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