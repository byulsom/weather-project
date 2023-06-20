const express = require('express');
const router = express.Router();
const User = require('../models/user');

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
    const user = new User({ username, email, password, role });
    const newUser = await user.save();
    res.status(201).json(newUser);    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a user
router.patch('/:id', getUser, async (req, res) => {
  const { cusername, email } = req.body;

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

// Deleting a company
router.delete('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    await User.findByIdAndDelete(companyId);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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
