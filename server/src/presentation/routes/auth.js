const express = require('express');
const router = express.Router();

// Import controller (which now only handles HTTP-specific tasks)
const authController = require('../controllers/authController');


router.get('/refresh/:accessId', authController.refreshUserData);

router.post('/logout', authController.logoutUser)

module.exports = router;