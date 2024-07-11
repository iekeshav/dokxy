require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authenticate = require('./middleware/authMiddleware');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
    });

app.use('/api/auth', authRoutes);
app.use('/api/doctors', authenticate, doctorRoutes);
app.use('/api/patients', authenticate, patientRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
