import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists in localStorage
    const savedUser = localStorage.getItem('carry1st_auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Seed a default logged-in user so the platform is interactive out-of-the-box
      const defaultAuthUser: AuthUser = {
        email: '0xchronosfi@gmail.com',
        name: 'Chronos User',
        isAdmin: true // Allow them to access both user dashboard AND admin panel!
      };
      setUser(defaultAuthUser);
      localStorage.setItem('carry1st_auth_user', JSON.stringify(defaultAuthUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API match
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Support admin account bypass
    const isAdmin = email.toLowerCase().includes('admin') || email === '0xchronosfi@gmail.com';
    const name = email.split('@')[0];
    const loggedUser: AuthUser = {
      email,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      isAdmin
    };

    setUser(loggedUser);
    localStorage.setItem('carry1st_auth_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isAdmin = email.toLowerCase().includes('admin') || email === '0xchronosfi@gmail.com';
    const loggedUser: AuthUser = {
      email,
      name,
      isAdmin
    };

    setUser(loggedUser);
    localStorage.setItem('carry1st_auth_user', JSON.stringify(loggedUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carry1st_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
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
