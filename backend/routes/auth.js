const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'bunneybet';
// Signup
// router.post('/signup', async (req, res) => {
//   const { name, email, phone, password } = req.body;
//   console.log(req.body);
//   try {
//     const user = new User({ name, email, phone, password, state, city, role });
//     await user.save();
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
//     res.status(201).json({ token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error('User not found');
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new Error('Invalid credentials');
//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
//     res.json({ token });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// module.exports = router;

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  // console.log(req.body)
  // Ensure all fields are provided
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    // let userNo;
    // let count = 5000;
    // do {
    //   userNo = `c${count}`;
    //   count++;
    // } while (await User.findOne({ userNo:userNo }));
    // const exist = await User.findOne({ userNo:userNo });
    // console.log(exist)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
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
      user: { id: savedUser._id, username: savedUser.username, email: savedUser.email, userNo: savedUser.userNo },
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