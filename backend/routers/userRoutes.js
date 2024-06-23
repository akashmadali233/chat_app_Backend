const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Log the request body to check if data is being received
router.post('/user/signup', userController.registerUser);

router.post('/user/login', userController.authUser);

module.exports = router;
