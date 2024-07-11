const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const router = express.Router();

// Patient login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const patient = await Patient.findOne({ email });
        if (!patient) {
            console.error('User not found:', email);  // Log user not found
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            console.error('Password does not match:', email);  // Log password mismatch
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: patient._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error.message);  // Log errors
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
