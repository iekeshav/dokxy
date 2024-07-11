const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialty: { type: String, required: true },
    location: { type: String, required: true },
    availability: [{
        day: { type: String, required: true },
        timeSlots: [{ type: String, required: true }],
    }],
    ratings: { type: Number, default: 0 },
    reviews: [{ type: String }],
    profilePhoto: String,
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
