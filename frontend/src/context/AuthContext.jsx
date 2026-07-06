import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('pkb_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('pkb_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('pkb_token', token);
    } else {
      localStorage.removeItem('pkb_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('pkb_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pkb_user');
    }
  }, [user]);

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
  }

  async function register(email, password) {
    const { data } = await api.post('/auth/register', { email, password });
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
