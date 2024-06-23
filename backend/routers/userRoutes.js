const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/signup',userController.registerUser);
router.get('/login',userController.authUser);

module.exports = router;
