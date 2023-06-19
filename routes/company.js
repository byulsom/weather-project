const express = require('express');
const router = express.Router();
const Company = require('../models/company');

// Getting all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
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
    const company = new Company({ companyname, email, password, role });
    const newCompany = await company.save();
    res.status(201).json(newCompany);    
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
    const company = await Company.findById(req.params.id);
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
