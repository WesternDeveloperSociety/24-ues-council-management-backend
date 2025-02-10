const mongoose = require('mongoose');

const motionSchema = new mongoose.Schema({
    motionID: {
        type: Number,
        required: true,
        unique: true
    },
    meetingID: {
        type: Number,
        required: true,
        validate: {                                 // Custom validator to ensure meetingID matches
            validator: async function(value) {
                const Meeting = mongoose.model('Meeting');
                const meeting = await Meeting.findOne({ meetingID: value });
                return !!meeting;
            },
            message: 'MeetingID does not exist in Meeting collection'
        }
    },
    description: {
        type: String
    },
    resultLink: {
        type: String,
        required: true
    },
    requiredVotes: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Motion', motionSchema, 'Motions');