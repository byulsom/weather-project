const express = require('express');
const router = express.Router();
const Unlimit = require('../models/unlimit');
const jwt = require('jsonwebtoken');
const config = require('config');

// Getting all unlimits
router.get('/', async (req, res) => {
  try {
    const unlimits = await Unlimit.find();
    res.json(unlimits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one unlimit
router.get('/:id', getUnlimit, (req, res) => {
  res.json(res.unlimit);
});

// Creating a new unlimit
router.post('/', async (req, res) => {
  const { unlimitname, email, password, role } = req.body;

  try {
    // Create a new unlimit
    const unlimit = new Unlimit({ unlimitname, email, password, role });
    const newUnlimit = await unlimit.save();

    // Generate JWT token
    const token = jwt.sign({ unlimitId: newUnlimit._id }, config.get('jwtSecret'));

    res.status(201).json({ newUnlimit, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a unlimit
router.patch('/:id', getUnlimit, async (req, res) => {
  const { unlimitname, email } = req.body;

  if (unlimitname != null) {
    res.unlimit.unlimitname = unlimitname;
  }
  if (email != null) {
    res.unlimit.email = email;
  }

  try {
    const updatedUnlimit = await res.unlimit.save();
    res.json(updatedUnlimit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a unlimit
router.delete('/:id', async (req, res) => {
  try {
    const unlimitId = req.params.id;
    await Unlimit.findByIdAndDelete(unlimitId);
    res.json({ message: 'Unlimit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUnlimit(req, res, next) {
  try {
    const unlimitId = req.params.id;
    const unlimit = await Unlimit.findById(unlimitId);

    if (!unlimit) {
      return res.status(404).json({ message: 'Unlimit not found' });
    }

    res.unlimit = unlimit;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


module.exports = router;
