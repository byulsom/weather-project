const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Company = require('../models/company');
const Unlimit = require('../models/unlimit');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.hasVisited; // Assuming the token is stored in a cookie named 'hasVisited'

  if (!token) {
    return res.status(401).json({
      message: 'No token provided',
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(419).json({
          code: 419,
          message: 'Token expired',
        });
      }
      return res.status(401).json({
        code: 401,
        message: 'Invalid token',
      });
    }

    // Token is valid, attach the decoded payload to the request for further use
    req.decoded = decoded;
    next();
  });
};

// Retrieve User Profile
router.get('/user/profile', authenticateToken, async (req, res) => {
  // Access the user information from req.decoded
  const userId = req.decoded.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // Construct the response data based on the user's profile
    const userProfile = {
      username: user.username,
      email: user.email,
      // Add more fields as needed
    };

    // Send the response with the user's profile
    res.status(200).json(userProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving user profile',
    });
  }
});

// Retrieve Company Profile
router.get('/company/profile', authenticateToken, async (req, res) => {
  // Access the company information from req.decoded
  const companyId = req.decoded.companyId;

  try {
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: 'Company not found',
      });
    }

    // Construct the response data based on the company's profile
    const companyProfile = {
      companyname: company.companyname,
      email: company.email,
      // Add more fields as needed
    };

    // Send the response with the company's profile
    res.status(200).json(companyProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving company profile',
    });
  }
});

// Retrieve Unlimit Profile
router.get('/unlimity/profile', authenticateToken, async (req, res) => {
  // Access the unlimit information from req.decoded
  const unlimitId = req.decoded.unlimitId;

  try {
    const unlimit = await Unlimit.findById(unlimitId);

    if (!unlimit) {
      return res.status(404).json({
        message: 'Unlimit not found',
      });
    }

    // Construct the response data based on the unlimit's profile
    const unlimitProfile = {
      unlimitname: unlimit.unlimitname,
      email: unlimit.email,
      // Add more fields as needed
    };

    // Send the response with the unlimit's profile
    res.status(200).json(unlimitProfile);
  } catch (err) {
    res.status(500).json({
      message: 'Error retrieving unlimit profile',
    });
  }
});

module.exports = router;
