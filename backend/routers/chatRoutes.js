const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware')
const chatController =  require('../controllers/chatController');

router.post('/', protect, chatController.accessChat);
router.get('/', protect, chatController.fetchChats);   //output doubt
router.post('/group', protect, chatController.createGroupChat);
router.put('/rename', protect, chatController.renameGroup);
router.put('/groupadd', protect, chatController.addToGroup);
router.put('/groupremove', protect, chatController.removeFromGroup);


module.exports = router;
