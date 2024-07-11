const express = require('express');
const Appointment = require('../models/Appointment');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Book an appointment
router.post('/book', authenticate, async (req, res) => {
    const { doctorId, date, time } = req.body;
    try {
        const newAppointment = new Appointment({ patient: req.user._id, doctor: doctorId, date, time });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

