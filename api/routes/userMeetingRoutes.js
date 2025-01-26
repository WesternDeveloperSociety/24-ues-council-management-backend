const express = require('express');
const router = express.Router();
const UserMeeting = require('../models/UserMeeting');

// GET All UserMeetings
router.get('/all', async (req, res) => {
    try {
        const userMeetings = await UserMeeting.find();
        res.json(userMeetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single UserMeeting by userID
router.get('/id/:userMeetingID', async (req, res) => {
    try {
        const userMeetingID = Number(req.params.userMeetingID);
        if (isNaN(userMeetingID)) {
            return res.status(400).json({ message: 'Invalid userMeetingID format' });
        }

        const userMeeting = await UserMeeting.findOne({ userID: userMeetingID });
        if (userMeeting) {
            res.json(userMeeting);
        } else {
            res.status(404).json({ message: 'UserMeeting not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST New UserMeeting
router.post('/create', async (req, res) => {
    const { userID, name, meetingID, isProxy, role } = req.body;

    const userMeeting = new UserMeeting({
        userID,
        name,
        meetingID,
        isProxy,
        role
    });

    try {
        const newUserMeeting = await userMeeting.save();
        res.status(201).json(newUserMeeting);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: 'User already associated with this meeting' });
        }
        res.status(400).json({ message: error.message });
    }
});

// ADDED: Display attendance by meetingID and optional role
router.get('/attendance/list', async (req, res) => {
    try {
        const { meetingID, role } = req.query;
        if (!meetingID) {
            return res.status(400).json({ message: 'meetingID is required' });
        }

        // Build query object
        const query = { meetingID: Number(meetingID) };
        if (role) {
            query.role = role;
        }

        // Filter userMeeting documents
        const attendance = await UserMeeting.find(query).select('-_id userID name role isProxy');

        res.json({ meetingID, attendance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;