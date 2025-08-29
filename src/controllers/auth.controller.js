import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const signToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    // Check if database is available
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message.includes('JWT_SECRET')) {
      res.status(503).json({ message: 'Authentication service not configured' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const login = async (req, res) => {
  try {
    // Check if database is available
    if (!process.env.MONGO_URI) {
      return res.status(503).json({ message: 'Database not configured' });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await user.matchPassword(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    if (error.message.includes('JWT_SECRET')) {
      res.status(503).json({ message: 'Authentication service not configured' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const me = async (req, res) => {
  try {
    const u = req.user;
    res.json({
      user: {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role
      }
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
