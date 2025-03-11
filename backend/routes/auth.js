const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { referalCodeModels } = require('../models/refralCode');
const JWT_SECRET = 'bunneybet';

router.post('/signup', async (req, res) => {
  const { username, email, password, referalId } = req.body;
  // console.log(req.body)
  // Ensure all fields are provided
  const referal = await referalCodeModels.findOne({ referalCode: referalId });
  console.log(referal, referalId, "referal")
  if (!referal) {
    return res.status(400).json({ message: 'Invalid referal Id' });
  }
  if (!referalId || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({
      referalId: referalId,
      username,
      email,
      password: hashedPassword,
      // userNo: userNo,
      wallet: 15000,
    });

    const savedUser = await newUser.save();
    console.log(savedUser)

    await savedUser.save();

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully',
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email, userNo: savedUser.userNo, referalId: savedUser.referalId },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username }).populate('wallet');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletBalance: user.wallet || 0,
        referalId: user.referalId
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/name/:id', async (req, res) => {
  const { id } = req.params; // Access the 'id' from the URL parameter
  try {
    // Find the user by the provided ID from MongoDB
    const user = await User.findById(id);
    // const Wallet = await User_Wallet.findOne({ user: id });
    // console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with the username
    res.json({ username: user.username, walletBalance: user.wallet, email: user.email });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;