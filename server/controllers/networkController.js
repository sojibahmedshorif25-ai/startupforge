import Connection from '../models/Connection.js';
import User from '../models/User.js';

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentEmail = req.user?.email;
    const users = await User.find({ email: { $ne: currentEmail } })
      .select('name email image role skills bio')
      .limit(10);
    return res.status(200).json({ success: true, suggestions: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const sendConnectionRequest = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const requesterId = req.user._id;

    if (requesterId.toString() === targetUserId) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    const existing = await Connection.findOne({
      $or: [
        { requester: requesterId, recipient: targetUserId },
        { requester: targetUserId, recipient: requesterId },
      ]
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Connection or request already exists' });
    }

    const newConn = await Connection.create({
      requester: requesterId,
      recipient: targetUserId,
      status: 'pending'
    });

    return res.status(201).json({ success: true, connection: newConn });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
