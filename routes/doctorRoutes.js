const express = require('express');
const Doctor = require('../models/Doctor');
const router = express.Router();

// Search doctors
router.get('/search', async (req, res) => {
    const { specialty, location, availability, ratings } = req.query;
    try {
        const query = {};
        if (specialty) query.specialty = specialty;
        if (location) query.location = location;
        if (availability) query['availability.day'] = availability;
        if (ratings) query.ratings = { $gte: ratings };

        const doctors = await Doctor.find(query);
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
