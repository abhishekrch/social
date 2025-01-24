import express from 'express';
import Post from '../models/Posts.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      author: req.user._id,
      content
    });
    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username')
      .populate('likes', 'username');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post' });
  }
});

router.get('/feed', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const posts = await Post.find({
      $or: [
        { author: req.user._id },
        { author: { $in: user.friends } }
      ]
    })
    .populate('author', 'username')
    .populate({
      path: 'likes',
      select: '_id username'
    })
    .populate({
      path: 'comments.user',
      select: 'username'
    })
    .sort('-createdAt')
    .limit(20);
    
    res.json(posts);
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

router.post('/:postId/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const hasLiked = post.likes.includes(req.user._id);
    
    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }
    
    await post.save();
    res.json({ message: hasLiked ? 'Post unliked' : 'Post liked' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to like/unlike post' });
  }
});

export default router; 