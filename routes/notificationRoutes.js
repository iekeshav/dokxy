const express = require('express');
const Notification = require('../models/Notification');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Create a notification
router.post('/', authenticate, async (req, res) => {
    const { userId, message } = req.body;
    try {
        const newNotification = new Notification({ user: userId, message });
        await newNotification.save();
        res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get notifications for a user
router.get('/', authenticate, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
