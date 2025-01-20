// Initialize dependancies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully connected to database'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Import Routes
const meetingRoutes = require('./routes/meetingRoutes');
const motionRoutes = require('./routes/motionRoutes');
const userMeetingRoutes = require('./routes/userMeetingRoutes');
const voteRoutes = require('./routes/voteRoutes');

// Use Routes
app.use('/api/meetings', meetingRoutes);
app.use('/api/motions', motionRoutes);
app.use('/api/usermeetings', userMeetingRoutes);
app.use('/api/votes', voteRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});