const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Patient sign-up
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: 'patient' });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Patient profile management
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/profile/photo', authenticate, async (req, res) => {
    const { profilePhoto } = req.body;
    try {
        const user = await User.findById(req.user._id);
        user.profilePhoto = profilePhoto;
        await user.save();
        res.json({ message: 'Profile photo updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
