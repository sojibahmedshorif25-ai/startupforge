import mongoose from 'mongoose';
import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';
import { mockUsers, mockStartups, mockOpportunities, mockApplications } from '../config/mockStore.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, image, skills, bio } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOneAndUpdate(
        { email: req.user.email },
        { name, image, skills, bio },
        { new: true }
      ).select('-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      return res.json(user);
    }

    const user = mockUsers.find((u) => u.email === req.user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (image) user.image = image;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim());
    if (bio) user.bio = bio;

    const { password, ...safe } = user;
    return res.json(safe);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFounderStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: req.user.email });
      const startup = await Startup.findOne({ founder_email: req.user.email });
      let totalOpportunities = 0;
      let totalApplications = 0;
      let acceptedMembers = 0;
      if (startup) {
        const opportunities = await Opportunity.find({ startup_id: startup._id });
        totalOpportunities = opportunities.length;
        const oppIds = opportunities.map((o) => o._id);
        const applications = await Application.find({ opportunity_id: { $in: oppIds } });
        totalApplications = applications.length;
        acceptedMembers = applications.filter((a) => a.status === 'accepted').length;
      }
      return res.json({
        totalOpportunities,
        totalApplications,
        acceptedMembers,
        isPremium: user?.isPremium || false,
        opportunityCount: user?.opportunityCount || 0,
      });
    }

    // Mock Fallback
    const user = mockUsers.find((u) => u.email === req.user.email);
    const startup = mockStartups.find((s) => s.founder_email === req.user.email);
    let totalOpportunities = 0;
    let totalApplications = 0;
    let acceptedMembers = 0;

    if (startup) {
      const opps = mockOpportunities.filter((o) => o.startup_id._id === startup._id || o.startup_id === startup._id);
      totalOpportunities = opps.length;
      totalApplications = mockApplications.length;
      acceptedMembers = mockApplications.filter((a) => a.status === 'accepted').length;
    }

    return res.json({
      totalOpportunities,
      totalApplications,
      acceptedMembers,
      isPremium: user?.isPremium || false,
      opportunityCount: user?.opportunityCount || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCollaboratorStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalApplications = await Application.countDocuments({ applicant_email: req.user.email });
      const accepted = await Application.countDocuments({ applicant_email: req.user.email, status: 'accepted' });
      const pending = await Application.countDocuments({ applicant_email: req.user.email, status: 'pending' });
      return res.json({ totalApplications, accepted, pending });
    }

    const apps = mockApplications.filter((a) => a.applicant_email === req.user.email);
    return res.json({
      totalApplications: apps.length,
      accepted: apps.filter((a) => a.status === 'accepted').length,
      pending: apps.filter((a) => a.status === 'pending').length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
