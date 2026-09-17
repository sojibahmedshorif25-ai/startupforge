import mongoose from 'mongoose';
import Notification from '../models/Notification.js';

let mockNotifications = [];

export const createNotificationHelper = async ({ user_email, title, message, type = 'system', link = '' }) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Notification.create({ user_email, title, message, type, link });
    } else {
      mockNotifications.unshift({
        _id: `notif_${Date.now()}`,
        user_email,
        title,
        message,
        type,
        link,
        isRead: false,
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const user_email = req.user.email;

    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ user_email }).sort({ createdAt: -1 }).limit(20);
      const unreadCount = await Notification.countDocuments({ user_email, isRead: false });
      return res.json({ success: true, notifications, unreadCount });
    }

    const userNotifs = mockNotifications.filter((n) => n.user_email === user_email);
    const unreadCount = userNotifs.filter((n) => !n.isRead).length;

    return res.json({ success: true, notifications: userNotifs.slice(0, 20), unreadCount });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const user_email = req.user.email;
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      if (id === 'all') {
        await Notification.updateMany({ user_email, isRead: false }, { isRead: true });
      } else {
        await Notification.findOneAndUpdate({ _id: id, user_email }, { isRead: true });
      }
      return res.json({ success: true, message: 'Notifications updated' });
    }

    if (id === 'all') {
      mockNotifications.forEach((n) => {
        if (n.user_email === user_email) n.isRead = true;
      });
    } else {
      const n = mockNotifications.find((item) => item._id === id && item.user_email === user_email);
      if (n) n.isRead = true;
    }

    return res.json({ success: true, message: 'Notifications updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
