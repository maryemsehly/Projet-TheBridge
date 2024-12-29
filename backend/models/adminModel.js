const mongoose = require('mongoose');

// Define the Admin schema
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate usernames
    },
    password: {
      type: String,
      required: true, // The password will be stored in plain text
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create and export the Admin model based on the schema
module.exports = mongoose.model('Admin', adminSchema);
