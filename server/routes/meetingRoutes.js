const express = require('express');
const router = express.Router();
const { Meeting,Vote,Motion,UserMeeting } = require('../models/Schema');

// GET All Meetings
router.get('/all-meetings', async (req, res) => {
    try {
        const meetings = await Meeting.find();
        res.json(meetings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Meeting by meetingID
router.get('/id/:meetingID', async (req, res) => {
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
router.post('/create', async (req, res) => {
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

// GET All Motions
router.get('/all-motions', async (req, res) => {
    try {
        const motions = await Motion.find();
        res.json(motions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Motion by motionID
router.get('/id/:motionID', async (req, res) => {
    try {
        const motionID = Number(req.params.motionID);
        if (isNaN(motionID)) {
            return res.status(400).json({ message: 'Invalid motionID format' });
        }

        const motion = await Motion.findOne({ motionID: motionID });
        if (motion) {
            res.json(motion);
        } else {
            res.status(404).json({ message: 'Motion not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST New Motion
router.post('/create', async (req, res) => {
    const { motionID, meetingID, description, resultLink, requiredVotes } = req.body;

    const motion = new Motion({
        motionID,
        meetingID,   // Must exist in the Meeting collection
        description,
        resultLink,
        requiredVotes
    });

    try {
        const newMotion = await motion.save();
        res.status(201).json(newMotion);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'motionID must be unique' });
        }
        res.status(400).json({ message: error.message });
    }
});

// Get Meeting ID based on Date
router.get('/meetingID/:date', async (req, res) => {
    try {
        const { date } = req.params; 
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const meeting = await Meeting.findOne({ date: new Date(date) });
        
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }

        res.json({ meetingID: meeting.meetingID });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Motions by Meeting ID
router.get('/motions/:meetingID', async (req, res) => {
    try {
        const { meetingID } = req.params; 
        if (!meetingID) {
            return res.status(400).json({ error: 'MeetingID is required' });
        }

        const motions = await Motion.find({ meetingID: Number(meetingID) }, 'motionID description');
        
        if (!motions.length) {
            return res.status(404).json({ error: 'No motions found for this meeting' });
        }

        res.json(motions);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get Votes by Motion ID
router.get('/votes/:motionID', async (req, res) => {
    try {
        const { motionID } = req.params; 
        if (!motionID) {
            return res.status(400).json({ error: 'MotionID is required' });
        }

        const votes = await Vote.find({ motionID: Number(motionID) }, 'userID vote');
        
        if (!votes.length) {
            return res.status(404).json({ error: 'No votes found for this motion' });
        }

        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Info by User ID
router.get('/user/:userID', async (req, res) => {
    try {
        const { userID } = req.params; 
        if (!userID) {
            return res.status(400).json({ error: 'UserID is required' });
        }

        const user = await User.findOne({ userID: Number(userID) }, 'name role');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/meetings-with-dates', async (req, res) => {
    try {
        console.log("Fetching meeting dates...");
        const meetings = await Meeting.find({}, 'meetingID date'); // ✅ This is correct
        console.log("Meetings Found:", meetings);
        res.json(meetings);
    } catch (error) {
        console.error("Error fetching meeting dates:", error.message);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});


// GET All UserMeetings
router.get('/all-usermeetings', async (req, res) => {
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

// GET All Votes
router.get('/all-votes', async (req, res) => {
    try {
        const votes = await Vote.find();
        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Display votes for a specific motion
router.get('/motion/:motionID', async (req, res) => {
    try {
        const { motionID } = req.query;
        if (!motionID) {
            return res.status(400).json({ message: 'motionID query parameter is required' });
        }

        const votes = await Vote.find({ motionID: Number(motionID) })
            .select('vote userID motionID -_id');

        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Vote by voteID
router.get('/:voteID', async (req, res) => {
    try {
        const voteID = Number(req.params.voteID);
        if (isNaN(voteID)) {
            return res.status(400).json({ message: 'Invalid voteID format' });
        }

        const vote = await Vote.findOne({ voteID: voteID });
        if (vote) {
            res.json(vote);
        } else {
            res.status(404).json({ message: 'Vote not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST New Vote
router.post('/create', async (req, res) => {
    const { voteID, motionID, userID, vote } = req.body;
    const newVote = new Vote({ voteID, motionID, userID, vote });

    try {
        const savedVote = await newVote.save();
        res.status(201).json(savedVote);
    } catch (error) {
        if (error.code === 11000) {
            return res
                .status(400)
                .json({ message: 'Duplicate voteID or user has already voted on this motion' });
        }
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;