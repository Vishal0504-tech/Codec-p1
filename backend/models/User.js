import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// The User Schema defines what fields a User document contains inside our MongoDB database.
const userSchema = new mongoose.Schema({
  // name: The display name of the customer or administrator.
  name: {
    type: String,
    required: true,
  },
  // email: Used as the unique login credential. We force it to be unique and lowercase.
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  // password: The hashed version of the user's password. It is marked as required.
  password: {
    type: String,
    required: true,
  },
  // role: Determines permissions. Customers are default "user", and store managers are "admin".
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
  // createdAt: Logs the exact timestamp when the user created their account.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook: Before saving a User document to MongoDB, automatically hash the password.
userSchema.pre('save', async function () {
  // If the password hasn't been modified, skip hashing (e.g., when updating username)
  if (!this.isModified('password')) {
    return;
  }

  // Generate a salt (random noise seed used to encrypt the password securely)
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the generated salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: Compares an entered plain-text password with the stored hashed password.
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
