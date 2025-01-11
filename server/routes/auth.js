import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{email}, {username}] });
    if (userExists) {
        return res.status(400).json({message: "User already exist"})
    }

    const user = new User ({username, email, password})
    await user.save();

    res.status(201).json({message: "User registered successfully"})
  } catch(e) {
    console.error(e);
    res.status(500).json({
        message: 'Registrastion Failed'
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
      return res.status(400).json({message: 'User Not Found'})
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
      return res.status(400).json({ message: 'Invalid Password'})
    }

    const token = jwt.sign(
      {userId: user._id},
      process.env.JWT_SECRET,
      {expiresIn: '7d'}
    )

    res.json({
      token, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({message: 'Login Failed'})
  }
})

export default router;