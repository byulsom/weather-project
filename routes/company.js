const express = require('express');
const router = express.Router();
const Company = require('../models/company');
const jwt = require('jsonwebtoken');
const config = require('config');

// Getting all companys
router.get('/', async (req, res) => {
  try {
    const companys = await Company.find();
    res.json(companys);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting one company
router.get('/:id', getCompany, (req, res) => {
  res.json(res.company);
});

// Creating a new company
router.post('/', async (req, res) => {
  const { companyname, email, password, role } = req.body;

  try {
    // Create a new company
    const company = new Company({ companyname, email, password, role });
    const newCompany = await company.save();

    // Generate JWT token
    const token = jwt.sign({ companyId: newCompany._id }, config.get('jwtSecret'));

    res.status(201).json({ newCompany, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating a company
router.patch('/:id', getCompany, async (req, res) => {
  const { companyname, email } = req.body;

  if (companyname != null) {
    res.company.companyname = companyname;
  }
  if (email != null) {
    res.company.email = email;
  }

  try {
    const updatedCompany = await res.company.save();
    res.json(updatedCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting a company
router.delete('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    await Company.findByIdAndDelete(companyId);
    res.json({ message: 'Company deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getCompany(req, res, next) {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.company = company;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


module.exports = router;
