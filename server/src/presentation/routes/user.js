const express = require('express');
const router = express.Router();

// Import controller (which now only handles HTTP-specific tasks)
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/auth.middleware');
const friendController = require('../controllers/friendController');
const NotificationController = require('../controllers/notificationController');



router.get('/friends', authenticateUser, friendController.getAllFriends)
router.get('/notification', authenticateUser, NotificationController.getNotification)
router.put('/notification/markAsRead/:notificationId', authenticateUser, NotificationController.markAsRead)

router.get('/search', authenticateUser, userController.searchUser);
router.get('/rewards', authenticateUser, userController.getUserReward);
router.post('/rewards/claim', authenticateUser, userController.claimDailyReward);

// POST /api/user - Create a new user
router.post('/', userController.loginOrRegister);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user
router.put('/', authenticateUser, userController.updateUser);

module.exports = router;