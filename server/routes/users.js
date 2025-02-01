import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } }
          ]
        },
        { _id: { $ne: req.user._id } }
      ]
    }).select('-password -friendRequests');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;