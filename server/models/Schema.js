const mongoose = require('mongoose');

// Define Meeting Schema
const meetingSchema = new mongoose.Schema({
    meetingID: {
        type: Number,
        required: true,
        unique: true,
        min: [1000, 'meetingID must be at least 1000'],
        max: [9999, 'meetingID must be at most 9999']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Meeting = mongoose.model('Meeting', meetingSchema);

// Define Motion Schema
const motionSchema = new mongoose.Schema({
    motionID: {
        type: Number,
        required: true,
        unique: true
    },
    meetingID: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                return !!(await Meeting.findOne({ meetingID: value }));
            },
            message: 'MeetingID does not exist in Meeting collection'
        }
    },
    description: String,
    resultLink: {
        type: String,
        required: true
    },
    requiredVotes: {
        type: Number,
        required: true
    }
});

const Motion = mongoose.model('Motion', motionSchema);

// Define UserMeeting Schema
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
                return !!(await Meeting.findOne({ meetingID: value }));
            },
            message: 'MeetingID does not exist in Meeting collection'
        }
    },
    isProxy: {
        type: Number,
        required: true,
        default: 1,
        enum: [1, 2]
    },
    role: {
        type: String,
        required: true
    }
});

// Create a compound index
userMeetingSchema.index({ meetingID: 1, userID: 1 }, { unique: true });

const UserMeeting = mongoose.model('UserMeeting', userMeetingSchema);

// Define Vote Schema
const voteSchema = new mongoose.Schema({
    voteID: {
        type: Number,
        required: true,
    },
    motionID: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                return !!(await Motion.findOne({ motionID: value }));
            },
            message: 'motionID does not exist in Motions collection'
        }
    },
    userID: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                return !!(await UserMeeting.findOne({ userID: value }));
            },
            message: 'userID does not exist in UserMeeting collection'
        }
    },
    vote: {
        type: String,
        enum: ["For", "Against", "Abstain"],
        required: true
    }
});

// Create indexes
voteSchema.index({ voteID: 1 });
voteSchema.index({ motionID: 1, userID: 1 }, { unique: true });

const Vote = mongoose.model('Vote', voteSchema);

module.exports = { Meeting, Motion, UserMeeting, Vote };
