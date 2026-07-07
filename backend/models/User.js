const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['Active', 'Blocked'],
      default: 'Active',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  {
    // Enable timestamps to automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the password before saving to the database.
 * 
 * WHY PASSWORDS SHOULD NEVER BE STORED AS PLAIN TEXT:
 * Storing passwords as plain text is a massive security risk. If a database is compromised, 
 * attackers would have immediate access to all user accounts. Passwords must be hashed so that 
 * even if the data is breached, the original passwords remain unknown.
 * 
 * WHY BCRYPT IS USED:
 * Bcrypt is a widely used hashing algorithm designed to be computationally expensive (slow). 
 * This slowness defends against brute-force and dictionary attacks. It also automatically 
 * handles "salting" (adding random data to the password before hashing) to protect against 
 * rainbow table attacks.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate a salt with a cost factor of 10
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method to compare a candidate password with the user's hashed password.
 * 
 * WHY COMPAREPASSWORD() IS NEEDED:
 * During login, the user provides a plain text password, but the database only stores the hashed 
 * version. We cannot "un-hash" the stored password to compare them. Instead, we must hash the 
 * provided candidate password and compare the resulting hash to the stored hash. This method 
 * encapsulates that logic so it can be easily used on any user document.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
