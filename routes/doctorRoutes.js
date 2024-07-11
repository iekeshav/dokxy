const express = require('express');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Doctor profile management
router.get('/profile', authenticate, async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user._id);
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/profile', authenticate, async (req, res) => {
    const { name, email, specialty, location } = req.body;
    try {
        const doctor = await Doctor.findById(req.user._id);
        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (specialty) doctor.specialty = specialty;
        if (location) doctor.location = location;
        await doctor.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View appointments
router.get('/appointments', authenticate, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user._id }).populate('patient', 'name email');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
