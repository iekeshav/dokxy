const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Notification = require('../models/Notification');
const authenticate = require('../middleware/authMiddleware');

router.post('/',
    authenticate,
    [
        body('userId').not().isEmpty().withMessage('User ID is required'),
        body('message').not().isEmpty().withMessage('Message is required')
    ],
    async (req, res, next) => {
        console.log('POST /api/notifications - Received request');
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('POST /api/notifications - Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, message } = req.body;
        console.log('POST /api/notifications - Request body:', { userId, message });
        try {
            const notification = new Notification({ user: userId, message });
            await notification.save();
            console.log('POST /api/notifications - Notification created:', notification);
            res.status(201).json({ message: 'Notification created', notification });
        } catch (err) {
            console.log('POST /api/notifications - Error:', err);
            next(err); // Pass errors to the error handler
        }
    }
);

router.get('/', authenticate, async (req, res, next) => {
    console.log('GET /api/notifications - Received request for user:', req.user._id);
    try {
        const notifications = await Notification.find({ user: req.user._id });
        console.log('GET /api/notifications - Notifications found:', notifications);
        res.json(notifications);
    } catch (err) {
        console.log('GET /api/notifications - Error:', err);
        next(err); // Pass errors to the error handler
    }
});

router.patch('/:id/read', authenticate, async (req, res, next) => {
    console.log('PATCH /api/notifications/:id/read - Received request to mark notification as read:', req.params.id);
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            console.log('PATCH /api/notifications/:id/read - Notification not found:', req.params.id);
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.read = true;
        await notification.save();
        console.log('PATCH /api/notifications/:id/read - Notification marked as read:', notification);
        res.json({ message: 'Notification marked as read', notification });
    } catch (err) {
        console.log('PATCH /api/notifications/:id/read - Error:', err);
        next(err); // Pass errors to the error handler
    }
});

module.exports = router;
