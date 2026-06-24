import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// The "protect" middleware acts as a security guard. It inspects incoming requests before they reach private database controllers.
export const protect = async (req, res, next) => {
  let token;

  // Check if the request has an Authorization header, and if it starts with the word "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token string (e.g. from "Bearer eyJhbGci..." we extract "eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Cryptographically verify the token using our secret key. If tampered with, this will throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database matching the decoded ID.
      // We call select('-password') to make sure we don't carry the hashed password around.
      req.user = await User.findById(decoded.id).select('-password');

      // Execute next() to proceed to the main controller function.
      next();
    } catch (error) {
      console.error(error);
      // Return status 401 (Unauthorized) if the signature validation fails
      res.status(401).json({ message: 'Not authorized, token validation failed' });
    }
  }

  // If no token exists at all in the header, return status 401
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// The "admin" middleware inspects the attached req.user to ensure they have administrative permissions.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    // Proceed if the user role is indeed admin
    next();
  } else {
    // Return status 403 (Forbidden) if the user is a standard customer
    res.status(403).json({ message: 'Not authorized as an admin user' });
  }
};
