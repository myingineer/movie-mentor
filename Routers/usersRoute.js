const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.route('/signup').post(userController.createUser);

router.route('/login').post(userController.loginUser);

router.route('/forgotPassword').post(userController.forgotPassword);

router.route('/resetPassword/:token').patch(userController.resetPassword);
module.exports = router;