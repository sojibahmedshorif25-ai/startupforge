import Opportunity from '../models/Opportunity.js';
import Startup from '../models/Startup.js';
import User from '../models/User.js';

export const createOpportunity = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.status(400).json({ message: 'Create a startup first' });
    const user = await User.findOne({ email: req.user.email });
    if (!user.isPremium && user.opportunityCount >= 3) {
      return res.status(403).json({ message: 'Please purchase premium to post more opportunities' });
    }
    const { role_title, required_skills, work_type, commitment_level, deadline, description } = req.body;
    const opportunity = await Opportunity.create({
      startup_id: startup._id,
      role_title,
      required_skills: required_skills || [],
      work_type,
      commitment_level,
      deadline,
      description: description || '',
    });
    await User.findByIdAndUpdate(user._id, { $inc: { opportunityCount: 1 } });
    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOpportunities = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.json([]);
    const opportunities = await Opportunity.find({ startup_id: startup._id }).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.status(400).json({ message: 'No startup found' });
    const opportunity = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, startup_id: startup._id },
      req.body,
      { new: true }
    );
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    if (!startup) return res.status(400).json({ message: 'No startup found' });
    const opportunity = await Opportunity.findOneAndDelete({ _id: req.params.id, startup_id: startup._id });
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOpportunities = async (req, res) => {
  try {
    const { role_title, required_skills, work_type, industry, page = 1, limit = 9 } = req.query;
    const query = {};
    if (role_title) {
      query.role_title = { $regex: role_title, $options: 'i' };
    }
    if (required_skills) {
      query.required_skills = { $regex: required_skills, $options: 'i' };
    }
    if (work_type) {
      query.work_type = { $in: work_type.split(',') };
    }
    if (industry) {
      const startups = await Startup.find({ industry: { $in: industry.split(',') }, status: 'approved' }).select('_id');
      query.startup_id = { $in: startups.map(s => s._id) };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const opportunities = await Opportunity.find(query)
      .populate('startup_id', 'startup_name logo industry')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const total = await Opportunity.countDocuments(query);
    res.json({
      opportunities,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('startup_id');
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .populate('startup_id', 'startup_name logo industry')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
