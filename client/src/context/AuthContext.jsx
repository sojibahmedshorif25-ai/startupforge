import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { translations } from '../utils/translations';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dark/Light Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default dark mode for modern SaaS aesthetic
  });

  // Language state (EN / BN)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'EN' ? 'BN' : 'EN';
    setLanguage(nextLang);
    localStorage.setItem('language', nextLang);
  };

  const t = (key) => {
    const langDict = translations[language] || translations.EN;
    return langDict[key] || translations.EN[key] || key;
  };

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('startup_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to StartupForge! Explore startup teams today.', read: false, date: 'Just now' },
    { id: 2, text: 'Tip: Complete your profile skills to boost AI matching accuracy.', read: false, date: '5m ago' },
  ]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const toggleBookmark = (startupId) => {
    setBookmarks((prev) => {
      const exists = prev.includes(startupId);
      const updated = exists ? prev.filter((id) => id !== startupId) : [...prev, startupId];
      localStorage.setItem('startup_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('sf_token');
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
      if (token) localStorage.removeItem('sf_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (!data.user) throw new Error('Invalid response');
    if (data.token) {
      localStorage.setItem('sf_token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    if (!data.user) throw new Error('Invalid response');
    if (data.token) {
      localStorage.setItem('sf_token', data.token);
    }
    setUser(data.user);
    return data;
  };

  const demoGoogleLogin = async (role = 'collaborator') => {
    const googleUser = {
      name: 'Google User',
      email: `google_${Date.now()}@gmail.com`,
      password: 'GoogleLogin123!',
      role,
      image: 'https://lh3.googleusercontent.com/a/default-user',
    };
    try {
      return await register(googleUser);
    } catch {
      return await login(googleUser.email, googleUser.password);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    localStorage.removeItem('sf_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoGoogleLogin,
        logout,
        setUser,
        checkAuth,
        darkMode,
        toggleTheme,
        language,
        toggleLanguage,
        t,
        bookmarks,
        toggleBookmark,
        notifications,
        markNotificationsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
