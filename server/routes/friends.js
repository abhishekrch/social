import express from 'express';
import User from '../models/User';

const router = express.Router();

// Get Friend List
router.get('/', async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
          .populate('friends', 'username email')
          .select('friends');
        res.json(user.friends);
    } catch (error) {
        res.status(500).json({message: 'Failed to fetch friends'})
    }
})