import mongoose from 'mongoose';
import Opportunity from '../models/Opportunity.js';
import Startup from '../models/Startup.js';
import User from '../models/User.js';
import { mockOpportunities, mockStartups, mockUsers } from '../config/mockStore.js';

export const createOpportunity = async (req, res) => {
  try {
    const { role_title, required_skills, work_type, commitment_level, deadline, description } = req.body;

    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      if (!startup) return res.status(400).json({ message: 'Create a startup first' });
      const user = await User.findOne({ email: req.user.email });
      if (!user.isPremium && user.opportunityCount >= 3) {
        return res.status(403).json({ message: 'Please purchase premium to post more opportunities' });
      }
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
      return res.status(201).json(opportunity);
    }

    // Mock Fallback
    const startup = mockStartups.find((s) => s.founder_email === req.user.email) || mockStartups[0];
    const user = mockUsers.find((u) => u.email === req.user.email);
    if (user && !user.isPremium && (user.opportunityCount || 0) >= 3) {
      return res.status(403).json({ message: 'Please purchase premium to post more opportunities' });
    }

    const newOpp = {
      _id: `opp_${Date.now()}`,
      startup_id: {
        _id: startup._id,
        startup_name: startup.startup_name,
        logo: startup.logo,
        industry: startup.industry,
      },
      role_title,
      required_skills: Array.isArray(required_skills) ? required_skills : [],
      work_type,
      commitment_level,
      deadline,
      description: description || '',
      createdAt: new Date().toISOString(),
    };
    mockOpportunities.push(newOpp);
    if (user) user.opportunityCount = (user.opportunityCount || 0) + 1;
    return res.status(201).json(newOpp);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyOpportunities = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      if (!startup) return res.json([]);
      const opportunities = await Opportunity.find({ startup_id: startup._id }).sort({ createdAt: -1 });
      return res.json(opportunities);
    }

    const startup = mockStartups.find((s) => s.founder_email === req.user.email);
    if (!startup) return res.json([]);
    const opps = mockOpportunities.filter(
      (o) => o.startup_id._id === startup._id || o.startup_id === startup._id
    );
    return res.json(opps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateOpportunity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      if (!startup) return res.status(400).json({ message: 'No startup found' });
      const opportunity = await Opportunity.findOneAndUpdate(
        { _id: req.params.id, startup_id: startup._id },
        req.body,
        { new: true }
      );
      if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
      return res.json(opportunity);
    }

    const idx = mockOpportunities.findIndex((o) => o._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Opportunity not found' });
    mockOpportunities[idx] = { ...mockOpportunities[idx], ...req.body };
    return res.json(mockOpportunities[idx]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteOpportunity = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const startup = await Startup.findOne({ founder_email: req.user.email });
      if (!startup) return res.status(400).json({ message: 'No startup found' });
      const opportunity = await Opportunity.findOneAndDelete({ _id: req.params.id, startup_id: startup._id });
      if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
      return res.json({ message: 'Opportunity deleted' });
    }

    const idx = mockOpportunities.findIndex((o) => o._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Opportunity not found' });
    mockOpportunities.splice(idx, 1);
    return res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllOpportunities = async (req, res) => {
  try {
    const { role_title, required_skills, work_type, industry, page = 1, limit = 9 } = req.query;

    if (mongoose.connection.readyState === 1) {
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
        query.startup_id = { $in: startups.map((s) => s._id) };
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const opportunities = await Opportunity.find(query)
        .populate('startup_id', 'startup_name logo industry')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
      const total = await Opportunity.countDocuments(query);
      return res.json({
        opportunities,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)) || 1,
      });
    }

    // Mock Fallback
    let filtered = [...mockOpportunities];
    if (role_title) {
      filtered = filtered.filter((o) => o.role_title.toLowerCase().includes(role_title.toLowerCase()));
    }
    if (required_skills) {
      filtered = filtered.filter((o) =>
        o.required_skills.some((s) => s.toLowerCase().includes(required_skills.toLowerCase()))
      );
    }
    if (work_type) {
      const wtList = work_type.split(',');
      filtered = filtered.filter((o) => wtList.includes(o.work_type));
    }
    if (industry) {
      const indList = industry.split(',');
      filtered = filtered.filter((o) => indList.includes(o.startup_id?.industry));
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = filtered.length;
    const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      opportunities: paginated,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOpportunityById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const opportunity = await Opportunity.findById(req.params.id).populate('startup_id');
      if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
      return res.json(opportunity);
    }

    const opportunity = mockOpportunities.find((o) => o._id === req.params.id);
    if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
    return res.json(opportunity);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFeaturedOpportunities = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const opportunities = await Opportunity.find()
        .populate('startup_id', 'startup_name logo industry')
        .sort({ createdAt: -1 })
        .limit(6);
      return res.json(opportunities);
    }
    return res.json(mockOpportunities.slice(0, 6));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
