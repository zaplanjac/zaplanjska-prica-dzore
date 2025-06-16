import { useState, useEffect } from 'react';

interface User {
  email: string;
  displayName: string;
  photoURL?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // This is a mock function since we're not using real Google auth
    // In a real app, this would handle Google OAuth
    throw new Error('Use the email/password form instead');
  };

  const signInWithEmail = async (email: string, password: string, name: string) => {
    // Simulate API call
    return new Promise<User>((resolve, reject) => {
      setTimeout(() => {
        if (email && password.length >= 6 && name) {
          const user: User = {
            email,
            displayName: name,
            photoURL: undefined
          };
          setUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    logout
  };
};