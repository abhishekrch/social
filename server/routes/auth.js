import express from 'express';
import User from '../models/User.js';

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

export default router;