const express = require('express');
const Doctor = require('../models/Doctor');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Search and filter doctors
router.get('/search', authenticate, async (req, res) => {
    const { specialty, location, availability, ratings } = req.query;

    try {
        const filters = {};

        if (specialty) {
            filters.specialty = specialty;
        }
        if (location) {
            filters.location = location;
        }
        if (availability) {
            filters['availability.day'] = availability;
        }
        if (ratings) {
            filters.ratings = { $gte: ratings };
        }

        const doctors = await Doctor.find(filters);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
