const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String },
  // mobileNumber: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wallet: { type: Number, default: 1500 },

}, { timestamps: true });
const User = mongoose.model('User', userSchema);
module.exports = User;