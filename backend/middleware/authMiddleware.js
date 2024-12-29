const jwt = require('jsonwebtoken');

// Ensure the JWT_SECRET is loaded
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token missing or malformed' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from the header

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id; // Attach admin ID to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
