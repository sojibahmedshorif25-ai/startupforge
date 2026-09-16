import mongoose from 'mongoose';
import Startup from '../models/Startup.js';
import { mockStartups } from '../config/mockStore.js';

export const createStartup = async (req, res) => {
  try {
    const { startup_name, logo, industry, description, funding_stage, team_size_needed } = req.body;

    if (mongoose.connection.readyState === 1) {
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
      return res.status(201).json(startup);
    }

    const newStartup = {
      _id: `stp_${Date.now()}`,
      startup_name,
      logo: logo || '',
      industry,
      description,
      funding_stage,
      founder_email: req.user.email,
      founder_name: req.user.name,
      team_size_needed: team_size_needed || 1,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    mockStartups.push(newStartup);
    return res.status(201).json(newStartup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      return res.json(startup);
    }
    const startup = mockStartups.find((s) => s.founder_email === req.user.email);
    return res.json(startup || null);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOneAndUpdate(
        { _id: req.params.id, founder_email: req.user.email },
        req.body,
        { new: true }
      );
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json(startup);
    }

    const idx = mockStartups.findIndex((s) => s._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Startup not found' });
    mockStartups[idx] = { ...mockStartups[idx], ...req.body };
    return res.json(mockStartups[idx]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOneAndDelete({ _id: req.params.id, founder_email: req.user.email });
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json({ message: 'Startup deleted' });
    }

    const idx = mockStartups.findIndex((s) => s._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Startup not found' });
    mockStartups.splice(idx, 1);
    return res.json({ message: 'Startup deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllStartups = async (req, res) => {
  try {
    const { industry, page = 1, limit = 10 } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { status: 'approved' };
      if (industry) {
        query.industry = { $in: industry.split(',') };
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const startups = await Startup.find(query).skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 });
      const total = await Startup.countDocuments(query);
      return res.json({ startups, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
    }

    // Mock Fallback
    let filtered = mockStartups.filter((s) => s.status === 'approved');
    if (industry) {
      const indList = industry.split(',');
      filtered = filtered.filter((s) => indList.includes(s.industry));
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
    return res.json({
      startups: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getStartupById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findById(req.params.id);
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json(startup);
    }
    const startup = mockStartups.find((s) => s._id === req.params.id);
    if (!startup) return res.status(404).json({ message: 'Startup not found' });
    return res.json(startup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeaturedStartups = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startups = await Startup.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(6);
      return res.json(startups);
    }
    const featured = mockStartups.filter((s) => s.status === 'approved').slice(0, 6);
    return res.json(featured);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adminGetAllStartups = async (req, res) => {
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

export const adminApproveStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json(startup);
    }
    const startup = mockStartups.find((s) => s._id === req.params.id);
    if (startup) startup.status = 'approved';
    return res.json(startup);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const adminRemoveStartup = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findByIdAndDelete(req.params.id);
      if (!startup) return res.status(404).json({ message: 'Startup not found' });
      return res.json({ message: 'Startup removed' });
    }
    const idx = mockStartups.findIndex((s) => s._id === req.params.id);
    if (idx !== -1) mockStartups.splice(idx, 1);
    return res.json({ message: 'Startup removed' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
