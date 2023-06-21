const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');

// Getting all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one user
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// Creating a new user
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Create a new user
    const user = new User({ username, email, password, role });
    const newUser = await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, config.get('jwtSecret'));

    res.status(201).json({ newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a user
router.patch('/:id', getUser, async (req, res) => {
  const { username, email } = req.body;

  if (username != null) {
    res.user.username = username;
  }
  if (email != null) {
    res.user.email = email;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a user
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUser(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


module.exports = router;
