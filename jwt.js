const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.hasVisited; 

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

module.exports = authenticateToken;


