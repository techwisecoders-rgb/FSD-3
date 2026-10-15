import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const AUTH_KEY = 'workforce_auth_user_v1';
const USERS_KEY = 'workforce_registered_users_v1';

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const getUsers = () => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const register = async ({ fullName, email, phone, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 700));
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setAuthLoading(false);
      const err = 'An account with this email already exists.';
      setAuthError(err);
      return { success: false, error: err };
    }
    const newUser = {
      id: user-\,
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.replace(/\\D/g, \'\'),
      password,
      workerProfile: null,
      avatar: https://api.dicebear.com/7.x/initials/svg?seed=\&backgroundColor=2563EB&textColor=ffffff,
      joinedAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    setAuthLoading(false);
    return { success: true, user: safeUser };
  };

  const login = async ({ email, password }) => {
    setAuthLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 600));
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) {
      setAuthLoading(false);
      const err = 'Incorrect email or password. Please try again.';
      setAuthError(err);
      return { success: false, error: err };
    }
    const { password: _, ...safeUser } = found;
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    setAuthLoading(false);
    return { success: true, user: safeUser };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setCurrentUser(null);
    setAuthError(null);
  };

  const clearAuthError = () => setAuthError(null);

  const updateProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === currentUser.id);
    if (idx === -1) { setAuthLoading(false); return { success: false, error: 'User not found' }; }
    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    saveUsers(users);
    const { password: _, ...safeUser } = updatedUser;
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
    setCurrentUser(safeUser);
    setAuthLoading(false);
    return { success: true, user: safeUser };
  };

  const isLoggedIn = Boolean(currentUser);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, authLoading, authError, register, login, logout, clearAuthError, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
