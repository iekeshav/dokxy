const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const moment = require('moment');

const sendReminders = async () => {
    const now = moment();
    const twoHoursLater = now.add(2, 'hours');

    const appointments = await Appointment.find({
        date: {
            $gte: now.toDate(),
            $lt: twoHoursLater.toDate(),
        },
    }).populate('patient doctor');

    appointments.forEach(appointment => {
        const { patient, doctor, date, time } = appointment;
        const appointmentDate = moment(date).format('MMMM Do YYYY');
        const reminderText = `Dear ${patient.name},\n\nThis is a reminder for your upcoming appointment with Dr. ${doctor.name} on ${appointmentDate} at ${time}.\n\nBest regards,\nYour Health Care Team`;

        sendEmail(patient.email, 'Appointment Reminder', reminderText);
    });
};

cron.schedule('0 * * * *', () => {
    console.log('Running appointment reminder job');
    sendReminders();
});
