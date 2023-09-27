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

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        developmentErrors(res, error);
    } else if (process.env.NODE_ENV === 'production') {
        if (error.name === 'CastError') {
            error = castErrorHandler(error);
        };
        productionErrors(res, error);
    };
};