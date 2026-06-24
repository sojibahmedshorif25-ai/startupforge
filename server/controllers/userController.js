import User from '../models/User.js';
import Startup from '../models/Startup.js';
import Opportunity from '../models/Opportunity.js';
import Application from '../models/Application.js';

export const updateProfile = async (req, res) => {
  try {
    const { name, image, skills, bio } = req.body;
    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { name, image, skills, bio },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getFounderStats = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    const startup = await Startup.findOne({ founder_email: req.user.email });
    let totalOpportunities = 0;
    let totalApplications = 0;
    let acceptedMembers = 0;
    if (startup) {
      const opportunities = await Opportunity.find({ startup_id: startup._id });
      totalOpportunities = opportunities.length;
      const oppIds = opportunities.map(o => o._id);
      const applications = await Application.find({ opportunity_id: { $in: oppIds } });
      totalApplications = applications.length;
      acceptedMembers = applications.filter(a => a.status === 'accepted').length;
    }
    res.json({
      totalOpportunities,
      totalApplications,
      acceptedMembers,
      isPremium: user?.isPremium || false,
      opportunityCount: user?.opportunityCount || 0,
    });
  } catch (error) {
    console.error('Founder Stats Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getCollaboratorStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments({ applicant_email: req.user.email });
    const accepted = await Application.countDocuments({ applicant_email: req.user.email, status: 'accepted' });
    const pending = await Application.countDocuments({ applicant_email: req.user.email, status: 'pending' });
    res.json({ totalApplications, accepted, pending });
  } catch (error) {
    console.error('Collaborator Stats Error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
