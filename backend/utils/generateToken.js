import jwt from 'jsonwebtoken';

// This utility function takes a user's database ID and generates a secure JSON Web Token (JWT).
const generateToken = (id) => {
  // We sign (create) a token with the user's ID as the payload.
  // The token is encrypted using our secret key (JWT_SECRET) and is set to expire in 30 days.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;
