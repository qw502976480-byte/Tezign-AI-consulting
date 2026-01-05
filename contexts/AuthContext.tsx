import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Booking {
  id: string;
  date: string; // ISO String
  slot: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  name: string; // Used as Account Name (Fixed)
  nickname?: string; // Display Name (Editable)
  email?: string;
  company?: string;
  avatar?: string; // CSS gradient string or image URL
  password?: string; // In a real app, never store this plain text in context/localstorage
  bookmarks?: string[]; // Array of slugs
  bookings?: Booking[]; // Array of booking objects
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  toggleBookmark: (slug: string) => void;
  addBooking: (booking: Booking) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check local storage on mount
    const access = localStorage.getItem('lumina_access') === 'true';
    const storedUser = localStorage.getItem('lumina_user');
    
    setIsAuthenticated(access);
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // Ensure nickname exists for legacy data
        if (!parsed.nickname) parsed.nickname = parsed.name;
        // Ensure bookmarks exists
        if (!parsed.bookmarks) parsed.bookmarks = [];
        // Ensure bookings exists
        if (!parsed.bookings) parsed.bookings = [];
        setUser(parsed);
      } catch (e) {
        setUser({ name: 'User', nickname: 'User', bookmarks: [], bookings: [] });
      }
    }
  }, []);

  const login = (userData: any) => {
    localStorage.setItem('lumina_access', 'true');
    
    // Pre-seed some bookmarks for the demo if none exist
    const defaultBookmarks = userData.bookmarks || ['aurora-growth', 'new-product-decision', 'content-production'];
    
    const userToSave = { 
        ...userData, 
        nickname: userData.nickname || userData.name, // Default nickname to account name
        company: userData.companyName || userData.company,
        bookmarks: defaultBookmarks,
        bookings: userData.bookings || []
    }; 
    localStorage.setItem('lumina_user', JSON.stringify(userToSave));
    setIsAuthenticated(true);
    setUser(userToSave);
  };

  const logout = () => {
    localStorage.removeItem('lumina_access');
    localStorage.removeItem('lumina_user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('lumina_user', JSON.stringify(updatedUser));
  };

  const toggleBookmark = (slug: string) => {
    if (!user) return;
    const currentBookmarks = user.bookmarks || [];
    let newBookmarks;
    if (currentBookmarks.includes(slug)) {
        newBookmarks = currentBookmarks.filter(s => s !== slug);
    } else {
        newBookmarks = [...currentBookmarks, slug];
    }
    updateProfile({ bookmarks: newBookmarks });
  };

  const addBooking = (booking: Booking) => {
    if (!user) return;
    const currentBookings = user.bookings || [];
    const newBookings = [booking, ...currentBookings];
    updateProfile({ bookings: newBookings });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, updateProfile, toggleBookmark, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};