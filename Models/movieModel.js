const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name of The Movie is Required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Movie Name Cannot Be More Than 100 Characters'],
        minlength: [3, 'Movie Name Cannot Be Less Than 3 Characters']
    },
    releaseYear: {
        type: Number,
        required: [true, 'Release Year is a Required Field']
    },
    ratings: {
        type: Number,
        required: [true, 'Ratings is a Required Field'],
        min: [0.1, "Ratings must be 0.1 or greater than 0.1"],
        max: [5, "Ratings must be 5 or less than 5"]
    },
    trailerLink: {
        type: String,
        required: [true, 'Link to Watch Trailer is a Required Field']
    },
    genres: {
        type: [String],
        required: [true, 'Genre is a Required Field']
    },
    cast: {
        type: [String],
        required: [true, 'Cast is a Required Field']
    },
    language: {
        type: String,
        default: 'English'
    },
    downloadLink: {
        type: String,
        required: [true, 'Link to Download Movie is a Required Field']
    },
    summary: {
        type: String,
        required: [true, 'Movie Summary is a Required Field']
    },
    gallery: {
        type: [String],
        required: [true, 'Images about the Movie is a Required Field']
    },
    portraitImage: {
        type: String,
        required: [true, 'Image in Portrait Mode is a Required Field']
    },
    landscapeImage: {
        type: String,
        required: [true, 'Image in Landscape Mode is a Required Field']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }   
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;