const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    day: { type: String, required: true },
    timeSlots: [{ type: String, required: true }]
});

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialty: { type: String, required: true },
    location: { type: String, required: true },
    availability: [availabilitySchema],
    ratings: { type: Number, default: 0 },
    reviews: [{ type: String }],
    profilePhoto: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
