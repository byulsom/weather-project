const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  // Check if the user is authenticated
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify the token and extract the user data
    const userData = jwt.verify(token, 'your-secret-key');
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateUser };
