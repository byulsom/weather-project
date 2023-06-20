const express = require('express');
const router = express.Router();
const User = require('../models/user');
const axios = require('axios');
const bcrypt = require('bcrypt');

// GET request to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET request to retrieve a specific user by ID
router.get('/:id', getUser, (req, res) => {
  res.json(res.user);
});

// POST request to create a new user
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({ username, email, password: hashedPassword, role });
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH request to update a user
router.patch('/:id', getUser, async (req, res) => {
  const { username, email, active } = req.body;

  if (username != null) {
    res.user.username = username;
  }
  if (email != null) {
    res.user.email = email;
  }
  if (active != null) {
    res.user.active = active;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE request to set a user as inactive
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set the user's active status to false
    user.active = false;

    await user.save();

    res.json({ message: 'User set as inactive' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware function to get a user by ID
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
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
