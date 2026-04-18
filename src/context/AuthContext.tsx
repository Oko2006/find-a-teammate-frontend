import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { apiService } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshProfile = async () => {
    try {
      const { profile, user } = await apiService.profiles.getCurrentProfile();
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch {
      setState(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setState(prev => ({ ...prev, accessToken: token }));
      refreshProfile();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.auth.login(email, password);
    const accessToken = response.data.access as string;
    const { user } = await apiService.profiles.getCurrentProfile();
    localStorage.setItem('user', JSON.stringify(user));
    setState({
      user,
      accessToken,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = async () => {
    await apiService.auth.logout();
    localStorage.removeItem('user');
    setState({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setState(prev => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
