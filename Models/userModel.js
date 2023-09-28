const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is a Required Field'],
        unique: true,
        minlength: [3, 'Username Cannot Be Less Than 3 Characters'],
        lowercase: true
    },
    emailAddress: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        validation: [validator.isEmail, 'Please Enter a Valid Email'],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please Confirm Your Password'],
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
