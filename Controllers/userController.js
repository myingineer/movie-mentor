const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
const util = require('util');


exports.createUser = asyncErrorHandler (async (req, res, next) => {

    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            newUser: newUser.select('-role')
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

exports.protect = asyncErrorHandler (async (req, res, next) => {
    const userToken = req.headers.authorization;

    let token;

    if (userToken && userToken.startsWith('Bearer')) {
        token = userToken.split(' ')[1]
    };

    if (!token) {
        const error = new AppError(`You are not Logged In`, 400);
        return next(error);
    };

    const tokenToValidate = await util.promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const user = await User.findById(tokenToValidate.id).select('+role');

    if (!user) {
        const error = new AppError(`User does not Exist. Please Sign Up`, 404);
        return next(error);
    };

    const wasPasswordChanged = await user.isPasswordChanged(tokenToValidate.iat);

    if (wasPasswordChanged) {
        const err = new CustomError('Password Changed Recently. Please login again', 401)
        return next(err);
    };
    req.user = user; // Making the user requesting that route to be the user at that time
    next();
});

exports.adminOnly = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            const error =  new AppError('You do not have permission to perform this action', 403);
            next(error);
        };
        next();
    };
};