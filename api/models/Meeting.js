// mongoose schema to store meeting info
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingID: {
        type: Number,
        required: true,
        unique: true,
        min: [1000, 'meetingID must be at least 1000'],     // Ensures the meetingID is 4-digits long
        max: [9999, 'meetingID must be at most 9999']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Meeting', meetingSchema, 'Meeting');