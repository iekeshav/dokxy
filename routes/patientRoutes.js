const express = require('express');
const Patient = require('../models/Patient');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get patient profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.userId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update patient profile
router.put('/profile', authenticate, async (req, res) => {
    const { name, email } = req.body;
    try {
        const patient = await Patient.findById(req.user.userId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        patient.name = name || patient.name;
        patient.email = email || patient.email;
        await patient.save();
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload/change profile photo
router.post('/profile/photo', authenticate, upload.single('profilePhoto'), async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.userId);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        patient.profilePhoto = req.file.path;
        await patient.save();
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
