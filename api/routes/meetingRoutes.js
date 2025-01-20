const express = require('express');
const router = express.Router();
const Meeting = require('../models/Meeting');

// GET All Meetings
router.get('/', async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Meeting by meetingID
router.get('/:meetingID', async (req, res) => {
    try {
        const meetingID = Number(req.params.meetingID);
        if (isNaN(meetingID)) {
            return res.status(400).json({ message: 'Invalid meetingID format' });
        }

        const meeting = await Meeting.findOne({ meetingID: meetingID });
        if (meeting) {
            res.json(meeting);
        } else {
            res.status(404).json({ message: 'Meeting not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Helper function to generate random unique 4-digit meetingID
async function generateRandomMeetingID() {
    let meetingID;
    let exists = true;
    while (exists) {
        meetingID = Math.floor(1000 + Math.random() * 9000); // random 4-digit
        const found = await Meeting.findOne({ meetingID });
        if (!found) exists = false;
    }
    return meetingID;
}

// POST New Meeting
router.post('/', async (req, res) => {
    try {
        // Instead of reading meetingID from req.body, generate it:
        const meetingID = await generateRandomMeetingID();

        const { date } = req.body;

        const meeting = new Meeting({
            meetingID,
            date: date 
        });

        const newMeeting = await meeting.save();
        res.status(201).json(newMeeting);
    } catch (error) {
        // Handle duplicate meetingIDs
        if (error.code === 11000) {
            return res.status(400).json({ message: 'meetingID must be unique' });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;