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

router.post('/request', async (req, res) => {
    try {
      const { friendId } = req.body;
      
      if (req.user._id.toString() === friendId) {
        return res.status(400).json({ message: 'Cannot send friend request to yourself' });
      }
  
      const friend = await User.findById(friendId);
      if (!friend) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (friend.friendRequests.includes(req.user._id)) {
        return res.status(400).json({ message: 'Friend request already sent' });
      }
  
      if (friend.friends.includes(req.user._id)) {
        return res.status(400).json({ message: 'Already friends' });
      }
  
      friend.friendRequests.push(req.user._id);
      await friend.save();
  
      res.json({ message: 'Friend request sent' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send friend request' });
    }
  });

router.post('/accept/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(req.user._id);
      
      if (!user.friendRequests.includes(userId)) {
        return res.status(400).json({ message: 'No friend request from this user' });
      }
  
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
      user.friends.push(userId);
      await user.save();
  
      const friend = await User.findById(userId);
      friend.friends.push(req.user._id);
      friend.pendingRequests = friend.pendingRequests.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await friend.save();
  
      res.json({ message: 'Friend request accepted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to accept friend request' });
    }
  });

  router.post('/reject/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(req.user._id);
      
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
      await user.save();
  
      const friend = await User.findById(userId);
      friend.pendingRequests = friend.pendingRequests.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await friend.save();
  
      res.json({ message: 'Friend request rejected' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to reject friend request' });
    }
  });

  router.delete('/:friendId', async (req, res) => {
    try {
      const { friendId } = req.params;
      
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { friends: friendId }
      });
  
      await User.findByIdAndUpdate(friendId, {
        $pull: { friends: req.user._id }
      });
  
      res.json({ message: 'Friend removed' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove friend' });
    }
  });
  
  