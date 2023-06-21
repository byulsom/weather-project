const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

router.get('/', authenticateToken, (req, res) => {
  // Access the user information from req.decoded
  const userId = req.decoded.userId;
  const unlimtId = req.decoded.unlmitId;
  const companyId = req.decoded.companyId;
  // Handle the request and send the response
  
  const response = {
    userId: userId,
    unlimtId: unlimtId,
    companyId: companyId
  };

  res.status(200).json(response);
});

module.exports = router;
