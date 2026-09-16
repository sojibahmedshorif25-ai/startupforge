import mongoose from 'mongoose';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Opportunity from '../models/Opportunity.js';
import Payment from '../models/Payment.js';
import { mockUsers, mockStartups, mockOpportunities, mockPayments } from '../config/mockStore.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalUsers = await User.countDocuments();
      const totalStartups = await Startup.countDocuments();
      const totalOpportunities = await Opportunity.countDocuments();
      const payments = await Payment.find({ payment_status: 'completed' });
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
      return res.json({ totalUsers, totalStartups, totalOpportunities, totalRevenue, payments });
    }

    const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);
    return res.json({
      totalUsers: mockUsers.length,
      totalStartups: mockStartups.length,
      totalOpportunities: mockOpportunities.length,
      totalRevenue,
      payments: mockPayments,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }
    const users = mockUsers.map(({ password, ...u }) => u);
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.isBlocked = !user.isBlocked;
      await user.save();
      return res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
    }

    const user = mockUsers.find((u) => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isBlocked = !user.isBlocked;
    return res.json({ success: true, message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllStartupsAdmin = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startups = await Startup.find().sort({ createdAt: -1 });
      return res.json(startups);
    }
    return res.json(mockStartups);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const approveStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json({ success: true, message: 'Startup approved successfully', startup });
    }

    const startup = mockStartups.find((s) => s._id === req.params.id);
    if (startup) startup.status = 'approved';
    return res.json({ success: true, message: 'Startup approved successfully', startup });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const removeStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findByIdAndDelete(req.params.id);
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      await Opportunity.deleteMany({ startup_id: startup._id });
      return res.json({ success: true, message: 'Startup and its opportunities removed' });
    }

    const idx = mockStartups.findIndex((s) => s._id === req.params.id);
    if (idx !== -1) mockStartups.splice(idx, 1);
    return res.json({ success: true, message: 'Startup and its opportunities removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const payments = await Payment.find().sort({ createdAt: -1 });
      return res.json(payments);
    }
    return res.json(mockPayments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
