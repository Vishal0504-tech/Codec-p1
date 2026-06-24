import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  // Extract user registration data from the incoming request body
  const { name, email, password } = req.body;

  try {
    // Check if a user with the same email already exists in the database
    const userExists = await User.findOne({ email });

    if (userExists) {
      // If user exists, return status 400 (Bad Request) and stop execution
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create and save the new user record. Mongoose will trigger the pre-save password-hashing hook.
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // If user is successfully created, send back user details and a signed JWT token with status 201 (Created)
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    // Return status 500 (Internal Server Error) if any database operations fail
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;

  try {
    // Find the user by their email address in the database
    const user = await User.findOne({ email });

    // If user is found, compare the plain-text password with the database's hashed password
    if (user && (await user.matchPassword(password))) {
      // If passwords match, return user details along with a new session JWT token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // If passwords mismatch or user isn't found, return status 401 (Unauthorized)
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Private (Requires valid token)
export const getUserProfile = async (req, res) => {
  try {
    // Our authMiddleware has already run and attached the authenticated user record to req.user.
    const user = await User.findById(req.user._id);

    if (user) {
      // Return user profile data
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
