import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BookOpen, Lock, User, Shield } from 'lucide-react';
import { t } from '../utils/textConverter';

interface AdminLoginProps {
  onLogin: (userType: 'admin' | 'editor') => void;
  isAuthenticated: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Разликовање између администратора и едитора
    if (credentials.username === 'admin' && credentials.password === 'admin2024') {
      setTimeout(() => {
        onLogin('admin');
        setIsLoading(false);
      }, 1000);
    } else if (credentials.username === 'editor' && credentials.password === 'editor2024') {
      setTimeout(() => {
        onLogin('editor');
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setError('Неисправни подаци за пријаву');
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <a href="/" className="flex items-center space-x-2 group">
              <BookOpen className="w-8 h-8 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />
              <h1 className="text-3xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-200">
                {t('Readwell')}
              </h1>
            </a>
          </div>
          <h2 className="text-xl text-gray-600">Админ/Едитор панел</h2>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Корисничко име
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin или editor"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Лозинка
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Унесите лозинку"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Пријављивање...' : 'Пријави се'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Демо подаци:</h4>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-medium">Администратор:</span>
                  <span>admin / admin2024</span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-medium">Едитор:</span>
                  <span>editor / editor2024</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-4">
              <p><strong>Администратор:</strong> Може да брише све постове</p>
              <p><strong>Едитор:</strong> Може да креира и уређује постове</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};