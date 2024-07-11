const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Admin: Add doctor
router.post('/add-doctor', authenticate, async (req, res) => {
    const { name, email, password, specialty, location } = req.body;
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const newDoctor = new Doctor({ name, email, password: hashedPassword, specialty, location });
        await newDoctor.save();
        res.status(201).json({ message: 'Doctor added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: View all users
router.get('/users', authenticate, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: View all doctors
router.get('/doctors', authenticate, async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: View all appointments
router.get('/appointments', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patient doctor', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
