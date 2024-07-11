const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Patient sign-up
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const patient = new User({ name, email, password, role: 'patient' });

    try {
        const newPatient = await patient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// View doctor profiles
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', softDelete: false });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change password
router.put('/users/:id/password', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload and change photo
router.put('/users/:id/photo', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.photo = req.body.photo;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
