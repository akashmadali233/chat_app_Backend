const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.post('/signup', userController.registerUser);
router.post('/login', userController.authUser);
//router.get('', protect, userController.allUsers);

module.exports = router;
