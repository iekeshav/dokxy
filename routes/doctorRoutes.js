const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcryptjs');

// Middleware to check if the user is a doctor
const isDoctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden' });
    }
};

// View schedule and appointments
router.get('/schedule', isDoctor, async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user._id, date: { $gte: new Date() } });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update availability
router.put('/availability', isDoctor, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.availableTimings = req.body.availableTimings;
        user.workingDays = req.body.workingDays;
        user.offDays = req.body.offDays;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload prescription
router.post('/prescriptions/:patientId', isDoctor, async (req, res) => {
    const { prescription } = req.body;
    const patientId = req.params.patientId;

    try {
        const patient = await User.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        patient.prescriptions.push({ doctorId: req.user._id, prescription });
        await patient.save();
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Upload and change photo
router.put('/photo', isDoctor, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.photo = req.body.photo;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Change password
router.put('/password', isDoctor, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
