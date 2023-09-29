const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');


exports.createUser = asyncErrorHandler (async (req, res, next) => {

    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            newUser
        }
    });
});


exports.loginUser = asyncErrorHandler (async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        const error = new AppError(`Please Provide an Email/Password`, 400);
        return next(error);
    };

    const user = await User.findOne({username});
    
    if (!user || !(await user.comparePasswords(password, user.password))) {
        const error = new AppError(`Username and Password Mis-Match`, 404);
        return next(error);
    };

    const token = jwt.sign({id: user._id, email: user.emailAddress}, process.env.SECRET_KEY, {
        expiresIn: process.env.LOGIN_EXPIRES
    });

    res.status(200).json({
        status: 'Success',
        username: user.username.toLocaleUpperCase(),
        message: 'You are Logged In',
        token
    });

});