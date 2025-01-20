// models/Vote.js
const mongoose = require('mongoose');

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
                const Motion = mongoose.model('Motion');
                const motion = await Motion.findOne({ motionID: value });
                return !!motion;
            },
            message: 'motionID does not exist in Motions collection'
        }
    },
    userID: {
        type: Number,
        required: true,
        validate: {
            validator: async function(value) {
                const UserMeeting = mongoose.model('UserMeeting');
                const user = await UserMeeting.findOne({ userID: value });
                return !!user;
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

// Create indexes on voteID
voteSchema.index({ voteID: 1 });

// Compound Unique Index to prevent a user from voting multiple times on the same motion
voteSchema.index({ motionID: 1, userID: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema, 'Vote');