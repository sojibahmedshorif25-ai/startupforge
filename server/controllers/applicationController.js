import Application from '../models/Application.js';
import Opportunity from '../models/Opportunity.js';
import Startup from '../models/Startup.js';
import User from '../models/User.js';

export const applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, applicant_email, portfolio_link, motivation } = req.body;
    const existing = await Application.findOne({ opportunity_id, applicant_email });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this opportunity' });
    }
    const user = await User.findOne({ email: applicant_email });
    const application = await Application.create({
      opportunity_id,
      applicant_email,
      applicant_name: user?.name || '',
      portfolio_link: portfolio_link || '',
      motivation,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant_email: req.user.email })
      .populate({
        path: 'opportunity_id',
        populate: { path: 'startup_id', select: 'startup_name' }
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFounderApplications = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.json([]);
    const opportunities = await Opportunity.find({ startup_id: startup._id }).select('_id');
    const applications = await Application.find({
      opportunity_id: { $in: opportunities.map(o => o._id) }
    })
      .populate({
        path: 'opportunity_id',
        select: 'role_title',
      })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
