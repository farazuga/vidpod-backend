const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['super_admin', 'amitrace', 'teacher', 'student'], required: true },
  phoneNumber: String,
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  isDeleted: { type: Boolean, default: false },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { transform: (doc, ret) => { delete ret.password; return ret; } }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
