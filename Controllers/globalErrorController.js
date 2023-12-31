const AppError = require('../Utils/appError');
const developmentErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
};

const productionErrors = (res, error) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please Try Again Later'
        });
    };
};

const castErrorHandler = (error) => {
    const msg = `Invalid value for ${error.path}:${error.value}`;
    return new AppError(msg, 400);
};

const duplicateErrorHandler = (error) => {
    // const msg = `Movie with ${error.keyValue.name} already exists`;
    // const msg = `Duplicate Key: ${error.keyValue}`;
    const duplicateKeyField = Object.keys(error.keyPattern)[0]
    if (duplicateKeyField === 'emailAddress') {
        const msg = `Email with ${error.keyValue.emailAddress} already exists`;
        return new AppError(msg, 400);
    } else if (duplicateKeyField === 'username') {
        const msg = `A User with Username (${error.keyValue.username}) already exists`;
        return new AppError(msg, 400);
    }
};

const validationErrorHandler = (error) => {
    const errors = Object.values(error.errors).map(val => val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid Input Data: ${errorMessages}`;
    return new AppError(msg, 400);
};

const expiredTokenHandler = (error) => {
    const msg = `Your login session has expired. Please login again`;
    return new AppError(msg, 419);
};

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        developmentErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') {
            error = castErrorHandler(error);
        };
        if (error.code === 11000) {
            error = duplicateErrorHandler(error);
        };
        if (error.name === 'ValidationError') {
            error = validationErrorHandler(error);
        };
        if (error.name === 'TokenExpiredError') {
            error = expiredTokenHandler(error);
        };
        productionErrors(res, error);
    };
};