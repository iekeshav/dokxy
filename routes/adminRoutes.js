const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const logAction = require('../middleware/auditMiddleware');
const authenticate = require('../middleware/authMiddleware');

router.post('/doctors', authenticate, logAction('Add Doctor'), async (req, res) => {
    const { name, email, password, specialty } = req.body;
    console.log('Received request to add doctor:', { name, email, specialty });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already in use:', email);
            return res.status(400).json({ message: 'Email already in use' });
        }

        console.log('Creating new doctor:', { name, email, specialty });
        const doctor = new User({
            name,
            email,
            password,
            role: 'doctor',
            specialty,
        });

        await doctor.save();
        console.log('Doctor added successfully:', doctor);

        res.status(201).json({ message: 'Doctor added successfully', doctor });
    } catch (err) {
        console.log('Error adding doctor:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
