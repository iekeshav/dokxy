require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const authenticate = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler'); // Import error handler

const app = express();
const port = 3000;

console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log JWT_SECRET for verification

app.use(bodyParser.json());

mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticate, adminRoutes);
app.use('/api/patient', authenticate, patientRoutes);
app.use('/api/doctor', authenticate, doctorRoutes);
app.use('/api/notifications', authenticate, notificationRoutes);

app.get('/test', (req, res) => {
    console.log('Test route accessed');
    res.send('Test route working');
});

// Error handling middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
