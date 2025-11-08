const userService = require('../../business/service/userService');
const tokenService = require('../../business/service/tokenService');

// Middleware to validate user authentication
exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = tokenService.verifyAccessToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.log(decoded, 'decoded id')
    // Attach user to request
    req.user = {
      id: decoded
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Optional: Middleware to check if user has required role
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Add role-based logic if needed
    // if (req.user.role !== role) {
    //   return res.status(403).json({ error: 'Insufficient permissions' });
    // }

    next();
  };
};