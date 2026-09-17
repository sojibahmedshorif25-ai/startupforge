import mongoose from 'mongoose';
import Bookmark from '../models/Bookmark.js';
import Startup from '../models/Startup.js';
import Opportunity from '../models/Opportunity.js';

// In-memory mock store fallback for bookmarks
let mockBookmarks = [];

export const toggleBookmark = async (req, res) => {
  try {
    const user_email = req.user.email;
    const { item_type, startup_id, opportunity_id } = req.body;

    if (!item_type || (!startup_id && !opportunity_id)) {
      return res.status(400).json({ message: 'Invalid bookmark payload' });
    }

    if (mongoose.connection.readyState === 1) {
      const query = { user_email, item_type };
      if (item_type === 'startup') query.startup_id = startup_id;
      if (item_type === 'opportunity') query.opportunity_id = opportunity_id;

      const existing = await Bookmark.findOne(query);
      if (existing) {
        await Bookmark.findByIdAndDelete(existing._id);
        return res.json({ success: true, bookmarked: false, message: 'Bookmark removed' });
      }

      await Bookmark.create(query);
      return res.json({ success: true, bookmarked: true, message: 'Saved to bookmarks' });
    }

    // Mock Fallback
    const existingIdx = mockBookmarks.findIndex((b) => {
      if (b.user_email !== user_email || b.item_type !== item_type) return false;
      if (item_type === 'startup') return b.startup_id === startup_id;
      return b.opportunity_id === opportunity_id;
    });

    if (existingIdx > -1) {
      mockBookmarks.splice(existingIdx, 1);
      return res.json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    }

    mockBookmarks.push({
      _id: `bm_${Date.now()}`,
      user_email,
      item_type,
      startup_id,
      opportunity_id,
      createdAt: new Date(),
    });
    return res.json({ success: true, bookmarked: true, message: 'Saved to bookmarks' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const user_email = req.user.email;

    if (mongoose.connection.readyState === 1) {
      const bookmarks = await Bookmark.find({ user_email })
        .populate('startup_id')
        .populate({
          path: 'opportunity_id',
          populate: { path: 'startup_id', select: 'startup_name logo industry' },
        })
        .sort({ createdAt: -1 });

      const startups = bookmarks.filter((b) => b.item_type === 'startup' && b.startup_id).map((b) => b.startup_id);
      const opportunities = bookmarks.filter((b) => b.item_type === 'opportunity' && b.opportunity_id).map((b) => b.opportunity_id);

      return res.json({
        success: true,
        startups,
        opportunities,
        rawIds: bookmarks.map((b) => ({
          type: b.item_type,
          id: b.item_type === 'startup' ? b.startup_id?._id : b.opportunity_id?._id,
        })),
      });
    }

    // Mock Fallback
    const userBms = mockBookmarks.filter((b) => b.user_email === user_email);
    return res.json({
      success: true,
      startups: [],
      opportunities: [],
      rawIds: userBms.map((b) => ({
        type: b.item_type,
        id: b.item_type === 'startup' ? b.startup_id : b.opportunity_id,
      })),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
