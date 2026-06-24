import Startup from '../models/Startup.js';
import User from '../models/User.js';

export const createStartup = async (req, res) => {
  try {
    const { startup_name, logo, industry, description, funding_stage, team_size_needed } = req.body;
    const startup = await Startup.create({
      startup_name,
      logo: logo || '',
      industry,
      description,
      funding_stage,
      founder_email: req.user.email,
      founder_name: req.user.name,
      team_size_needed: team_size_needed || 1,
    });
    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyStartup = async (req, res) => {
  try {
    const startup = await Startup.findOne({ founder_email: req.user.email });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStartup = async (req, res) => {
  try {
    const startup = await Startup.findOneAndUpdate(
      { _id: req.params.id, founder_email: req.user.email },
      req.body,
      { new: true }
    );
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStartup = async (req, res) => {
  try {
    const startup = await Startup.findOneAndDelete({ _id: req.params.id, founder_email: req.user.email });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const { industry, page = 1, limit = 10 } = req.query;
    const query = { status: 'approved' };
    if (industry) {
      query.industry = { $in: industry.split(',') };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const startups = await Startup.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await Startup.countDocuments(query);
    res.json({ startups, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStartupById = async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedStartups = async (req, res) => {
  try {
    const startups = await Startup.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(6);
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminGetAllStartups = async (req, res) => {
  try {
    const startups = await Startup.find().sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminApproveStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminRemoveStartup = async (req, res) => {
  try {
    const startup = await Startup.findByIdAndDelete(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    res.json({ message: 'Startup removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
