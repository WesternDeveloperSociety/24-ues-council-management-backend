// Initialize dependancies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Successfully connected to database'))
.catch((error) => console.error('Error connecting to MongoDB:', error));

// Import Routes
const routes = require('./routes/meetingRoutes');

// Use Routes
app.use('/api/routes', routes);



// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});