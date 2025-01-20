const express = require('express');
const router = express.Router();
const Motion = require('../models/Motion');

// GET All Motions
router.get('/', async (req, res) => {
    try {
        const motions = await Motion.find();
        res.json(motions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET Single Motion by motionID
router.get('/:motionID', async (req, res) => {
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
router.post('/', async (req, res) => {
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

module.exports = router;