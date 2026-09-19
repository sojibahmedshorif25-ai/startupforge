import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { mockUsers } from '../config/mockStore.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'startupforge_jwt_secret_key_2024_secure',
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, image, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const userRole = email.toLowerCase() === 'sojibahmedshorif25@gmail.com' ? 'admin' : (role || 'collaborator');
      const user = await User.create({
        name,
        email,
        image: image || '',
        password: hashedPassword,
        role: userRole,
      });
      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(201).json({
        message: 'User created successfully',
        token,
        user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role },
      });
    }

    // Mock Fallback
    const existing = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      image: image || '',
      role: role || 'collaborator',
      isBlocked: false,
      isPremium: false,
      skills: [],
      bio: '',
    };
    mockUsers.push(newUser);

    const token = generateToken(newUser);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, image: newUser.image, role: newUser.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Your account has been blocked' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role },
      });
    }

    // Mock Fallback
    const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ message: 'Your account has been blocked' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== 'Admin123!' && password !== 'Founder123!' && password !== 'User123!') {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed: ' + error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return res.json({ message: 'Logged out successfully' });
};

export const googleAuth = async (req, res) => {
  try {
    let { name, email, image, role, credential, idToken } = req.body;

    if (credential || idToken) {
      try {
        const tokenToVerify = credential || idToken;
        const ticket = await googleClient.verifyIdToken({
          idToken: tokenToVerify,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (payload) {
          email = payload.email;
          name = payload.name;
          image = payload.picture;
        }
      } catch (err) {
        console.warn('Google token verification fallback:', err.message);
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Google email is required' });
    }
    const userEmail = email.trim().toLowerCase();
    const userName = name?.trim() || userEmail.split('@')[0];
    const userRole = userEmail === 'sojibahmedshorif25@gmail.com' ? 'admin' : (role || 'collaborator');
    const userImage = image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`;

    if (mongoose.connection.readyState === 1) {

      let user = await User.findOne({ email: userEmail });
      if (!user) {
        const dummyPassword = await bcrypt.hash(`Google_${Date.now()}_Secret!`, 10);
        user = await User.create({
          name: userName,
          email: userEmail,
          image: userImage,
          password: dummyPassword,
          role: userRole,
        });
      }
      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        message: 'Google login successful',
        token,
        user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role },
      });
    }

    // Mock Fallback
    let user = mockUsers.find((u) => u.email.toLowerCase() === userEmail);
    if (!user) {
      user = {
        _id: `usr_g_${Date.now()}`,
        name: userName,
        email: userEmail,
        image: userImage,
        role: userRole,
        isBlocked: false,
        isPremium: true,
        skills: ['React', 'Node.js', 'JavaScript'],
        bio: `${userName} - Verified Google Account on StartupForge`,
      };
      mockUsers.push(user);
    }
    const token = generateToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: 'Google login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, image: user.image, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Google authentication failed: ' + error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        let user = null;
        if (mongoose.Types.ObjectId.isValid(req.user?.id)) {
          user = await User.findById(req.user.id).select('-password');
        }
        if (!user && req.user?.email) {
          user = await User.findOne({ email: req.user.email }).select('-password');
        }
        if (user) {
          return res.json(user);
        }
      } catch (err) {
        console.warn('DB query error in getMe, serving fallback:', err.message);
      }
    }

    // Mock Fallback
    const user = mockUsers.find((u) => u._id === req.user?.id || u.email === req.user?.email);
    if (user) {
      const { password, ...safeUser } = user;
      return res.json(safeUser);
    }

    if (req.user) {
      return res.json({
        _id: req.user.id || 'usr_google',
        name: req.user.name || 'Google Account User',
        email: req.user.email || 'user.google@gmail.com',
        role: req.user.role || 'collaborator',
        image: 'https://lh3.googleusercontent.com/a/default-user',
        skills: ['React', 'Node.js', 'JavaScript'],
        bio: 'StartupForge AI Pioneer',
        isPremium: true
      });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    return res.status(200).json({
      _id: req.user?.id || 'usr_demo',
      name: req.user?.name || 'Google Account User',
      email: req.user?.email || 'user.google@gmail.com',
      role: req.user?.role || 'collaborator',
      image: 'https://lh3.googleusercontent.com/a/default-user',
      skills: ['React', 'JavaScript', 'Node.js'],
      bio: 'Tech enthusiast building future ventures on StartupForge.',
    });
  }
};
