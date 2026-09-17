import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import Startup from '../models/Startup.js';
import User from '../models/User.js';
import { mockApplications, mockOpportunities } from '../config/mockStore.js';
import { createNotificationHelper } from './notificationController.js';

export const applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, applicant_email, portfolio_link, motivation } = req.body;

    if (mongoose.connection.readyState === 1) {
      const existing = await Application.findOne({ opportunity_id, applicant_email });
      if (existing) {
        return res.status(400).json({ message: 'Already applied to this opportunity' });
      }
      const user = await User.findOne({ email: applicant_email });
      const opportunity = await Opportunity.findById(opportunity_id).populate('startup_id');
      const application = await Application.create({
        opportunity_id,
        applicant_email,
        applicant_name: user?.name || req.user?.name || '',
        portfolio_link: portfolio_link || '',
        motivation,
      });

      if (opportunity && opportunity.startup_id && opportunity.startup_id.founder_email) {
        await createNotificationHelper({
          user_email: opportunity.startup_id.founder_email,
          title: '🔔 New Application Received',
          message: `${user?.name || applicant_email} applied for role: ${opportunity.role_title}`,
          type: 'application_status',
          link: '/dashboard/founder/applications',
        });
      }

      return res.status(201).json(application);
    }

    // Mock Fallback
    const existing = mockApplications.find(
      (a) => a.opportunity_id === opportunity_id && a.applicant_email === applicant_email
    );
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this opportunity' });
    }

    const opp = mockOpportunities.find((o) => o._id === opportunity_id);
    const newApp = {
      _id: `app_${Date.now()}`,
      opportunity_id: opp || { role_title: 'Software Developer', startup_id: { startup_name: 'NexusAI' } },
      applicant_email,
      applicant_name: req.user?.name || 'Applicant',
      portfolio_link: portfolio_link || '',
      motivation,
      status: 'pending',
      applied_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    mockApplications.push(newApp);
    return res.status(201).json(newApp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const applications = await Application.find({ applicant_email: req.user.email })
        .populate({
          path: 'opportunity_id',
          populate: { path: 'startup_id', select: 'startup_name logo' },
        })
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    const apps = mockApplications.filter((a) => a.applicant_email === req.user.email);
    return res.json(apps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFounderApplications = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      if (!startup) return res.json([]);
      const opportunities = await Opportunity.find({ startup_id: startup._id }).select('_id');
      const applications = await Application.find({
        opportunity_id: { $in: opportunities.map((o) => o._id) },
      })
        .populate({
          path: 'opportunity_id',
          select: 'role_title',
        })
        .sort({ createdAt: -1 });
      return res.json(applications);
    }

    return res.json(mockApplications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate('opportunity_id');
      if (!application) return res.status(404).json({ message: 'Application not found' });

      // Send notification to collaborator applicant
      const roleName = application.opportunity_id?.role_title || 'Opportunity';
      const statusTitle = status === 'accepted' ? '🎉 Application Accepted!' : 'Application Status Update';
      const statusMessage =
        status === 'accepted'
          ? `Congratulations! Your application for "${roleName}" has been ACCEPTED by the founder.`
          : `Your application for "${roleName}" has been updated to ${status.toUpperCase()}.`;

      await createNotificationHelper({
        user_email: application.applicant_email,
        title: statusTitle,
        message: statusMessage,
        type: 'application_status',
        link: '/dashboard/collaborator/applications',
      });

      return res.json(application);
    }

    const app = mockApplications.find((a) => a._id === req.params.id);
    if (app) {
      app.status = status;
      await createNotificationHelper({
        user_email: app.applicant_email,
        title: status === 'accepted' ? '🎉 Application Accepted!' : 'Application Status Update',
        message: `Your application status has been updated to ${status}.`,
        type: 'application_status',
        link: '/dashboard/collaborator/applications',
      });
    }
    return res.json(app);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
