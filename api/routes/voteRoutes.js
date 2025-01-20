const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');

// GET All Votes
router.get('/', async (req, res) => {
    try {
        const votes = await Vote.find();
        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Display votes for a specific motion
router.get('/motion', async (req, res) => {
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
router.post('/', async (req, res) => {
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