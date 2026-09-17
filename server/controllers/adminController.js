import mongoose from 'mongoose';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import Payment from '../models/Payment.js';
import { mockUsers, mockStartups, mockOpportunities, mockPayments, mockApplications } from '../config/mockStore.js';
import { createNotificationHelper } from './notificationController.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalUsers = await User.countDocuments();
      const totalStartups = await Startup.countDocuments();
      const totalOpportunities = await Opportunity.countDocuments();
      const totalApplications = await Application.countDocuments();
      const pendingStartups = await Startup.countDocuments({ status: 'pending' });
      const payments = await Payment.find({ payment_status: 'completed' });
      const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

      return res.json({
        totalUsers,
        totalStartups,
        totalOpportunities,
        totalApplications,
        pendingStartups,
        totalRevenue,
        payments,
      });
    }

    const totalRevenue = mockPayments.reduce((sum, p) => sum + p.amount, 0);
    return res.json({
      totalUsers: mockUsers.length,
      totalStartups: mockStartups.length,
      totalOpportunities: mockOpportunities.length,
      totalApplications: mockApplications.length,
      pendingStartups: mockStartups.filter((s) => s.status === 'pending').length,
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

      await createNotificationHelper({
        user_email: user.email,
        title: user.isBlocked ? '⚠️ Account Suspended' : '✅ Account Restored',
        message: user.isBlocked
          ? 'Your account has been blocked by an administrator.'
          : 'Your account access has been restored.',
        type: 'system',
      });

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
    const { status = 'approved' } = req.body;
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!startup) return res.status(404).json({ message: 'Startup not found' });

      await createNotificationHelper({
        user_email: startup.founder_email,
        title: status === 'approved' ? '🚀 Startup Approved!' : 'Startup Review Update',
        message: `Your startup "${startup.startup_name}" has been ${status.toUpperCase()} by platform moderators.`,
        type: 'startup_status',
        link: '/dashboard/founder/my-startup',
      });

      return res.json({ success: true, message: `Startup ${status} successfully`, startup });
    }

    const startup = mockStartups.find((s) => s._id === req.params.id);
    if (startup) startup.status = status;
    return res.json({ success: true, message: `Startup ${status} successfully`, startup });
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

export const getAllApplicationsAdmin = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const applications = await Application.find()
        .populate({ path: 'opportunity_id', populate: { path: 'startup_id', select: 'startup_name' } })
        .sort({ createdAt: -1 });
      return res.json(applications);
    }
    return res.json(mockApplications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActivityLogs = async (req, res) => {
  try {
    const logs = [
      { id: '1', action: 'New Startup Registered', details: 'Aura Cloud posted by founder@auracloud.io', time: '10 mins ago' },
      { id: '2', action: 'Application Submitted', details: 'Senior React Engineer application submitted by sarah.c@dev.io', time: '25 mins ago' },
      { id: '3', action: 'Premium Subscription', details: 'Stripe payment $49.00 completed by founder@quantumlabs.ai', time: '1 hour ago' },
      { id: '4', action: 'Startup Approved', details: 'BioHealth Tech status set to Approved by Admin', time: '2 hours ago' },
      { id: '5', action: 'AI Resume Analysis', details: 'Resume analysis run for collaborator john.doe@mail.com', time: '4 hours ago' },
    ];
    return res.json({ success: true, logs });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
