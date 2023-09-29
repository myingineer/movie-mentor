const express = require('express');
const userController = require('../Controllers/userController');

const router = express.Router();

router.route('/signup')
    .post(userController.createUser);

router.route('/login')
    .post(userController.loginUser);


module.exports = router;