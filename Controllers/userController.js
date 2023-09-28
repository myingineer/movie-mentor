const User = require('../Models/userModel');
const asyncErrorHandler = require('../Utils/asyncErrorHandler');


exports.createUser = asyncErrorHandler (async (req, res, next) => {

    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            newUser
        }
    });
});