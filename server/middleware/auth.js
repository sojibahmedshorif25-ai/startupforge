import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Session invalid, please login again' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'User not found' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }
    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
