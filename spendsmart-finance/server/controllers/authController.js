import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const signToken = (userId) =>
  jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 'An account with this email already exists', 409);

    const user  = await User.create({ name, email, password });
    const token = signToken(user._id);
    return sendSuccess(res, { user, token, expiresIn: process.env.JWT_EXPIRES_IN || '7d' }, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password +isActive');

    if (!user || !user.isActive) return sendError(res, 'Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Invalid email or password', 401);

    const token = signToken(user._id);
    return sendSuccess(res, { user, token, expiresIn: process.env.JWT_EXPIRES_IN || '7d' }, `Welcome back, ${user.name}!`);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { user }, 'Profile fetched');
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const allowed = {};
    if (req.body.name)   allowed.name   = req.body.name;
    if (req.body.avatar) allowed.avatar = req.body.avatar;
    const user = await User.findByIdAndUpdate(req.user.userId, allowed, { new: true, runValidators: true });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { user }, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

export const deleteMe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, { isActive: false });
    return sendSuccess(res, null, 'Account deactivated');
  } catch (err) {
    next(err);
  }
};
