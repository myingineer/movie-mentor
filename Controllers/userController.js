const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const AppError = require('../Utils/appError');
const util = require('util');
const passwordResetEmail = require('../Utils/passwordResetEmail');
const crypto = require('crypto');


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

exports.forgotPassword = asyncErrorHandler (async (req, res, next) => {
    const user = await User.findOne({emailAddress: req.body.emailAddress});

    if (!user) {
        const error = new AppError(`User with Email ${req.body.emailAddress} not found`, 404);
        return next(error);
    };

    const passwordResetToken = await user.createResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${passwordResetToken}`;
    const message = `
        We received a request to reset your password.\n\n
        Please use the link to reset your password: \n\n
        ${resetUrl}\n\n
        This link would be valid for 10 minutes.\n\n
        If you did not request to reset you password, kindly ignore this Mail and Contact Support\n\n
    `
    try {
        await passwordResetEmail({
            email: user.emailAddress,
            subject: 'Password Request Link',
            message
        });

        res.status(200).json({
            status: 'Success',
            message: `Password Reset Link Sent To ${user.emailAddress}. Please check your mail\n If you didn't see the mail, check your SPAM folder`
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        user.save({validateBeforeSave: false});
        return next(new AppError('There was an error sending password reset mail', 500));
    };
});

exports.resetPassword = asyncErrorHandler (async (req, res, next) => {
    // We want to encrypt the password reset token back
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    // After finding that user with the reset token, we also want to check if the token is expired or not
    const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpire: {$gt: Date.now()}});
    // If user does not exist
    if (!user) {
        const error = new AppError('Token Is Invalid/Expired', 400);
        return next(error);
    };

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    user.passwordChangedAt = Date.now();

    user.save();

    res.status(200).json({
        status: 'Success',
        message: 'Password Changed Successfully'
    });
});