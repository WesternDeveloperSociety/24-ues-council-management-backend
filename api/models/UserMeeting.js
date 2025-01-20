const mongoose = require('mongoose');

const userMeetingSchema = new mongoose.Schema({
    userID: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    meetingID: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                const Meeting = mongoose.model('Meeting');
                const meeting = await Meeting.findOne({ meetingID: value });
                return !!meeting;
            },
            message: 'MeetingID does not exist in Meeting collection'
        }
    },
    isProxy: {
        type: Number,
        required: true,
        default: 1,
        enum: [1, 2],  // 1 == notProxy, 2 == isProxy
        description: '1 for not proxying, 2 for proxying'
    },
    role: {
        type: String,
        required: true
    }
});

// Create a compound index on userID and meetingID
userMeetingSchema.index({ meetingID: 1, userID: 1 }, { unique: true, name: 'meetingID_userID_unique' });

module.exports = mongoose.model('UserMeeting', userMeetingSchema, 'UserMeeting');