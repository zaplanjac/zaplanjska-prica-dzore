import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { BookOpen, Mail, User, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthorLoginProps {
  onLogin: (user: any) => void;
}

export const AuthorLogin: React.FC<AuthorLoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  if (isAuthenticated) {
    return <Navigate to="/author" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Молимо унесите валидну email адресу');
      setIsLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Лозинка мора имати најмање 6 карактера');
      setIsLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Молимо унесите ваше име');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate authentication - in production this would be a real API call
      setTimeout(() => {
        const user = {
          email: formData.email,
          displayName: formData.name,
          photoURL: null
        };
        
        // Store user in localStorage for persistence
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        onLogin(user);
        setIsAuthenticated(true);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      setError('Грешка при пријави. Покушајте поново.');
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-cream-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-serif font-bold text-gray-900">
              Читај о Заплању
            </h1>
          </div>
          <h2 className="text-xl text-gray-600">Пријава за ауторе</h2>
          <p className="text-gray-500 mt-2">
            Поделите ваше приче о Заплању са светом
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Добродошли, аутори!
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Пријавите се са вашим email-ом да бисте могли да објављујете ваше приче о Заплању.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Ваше име *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Унесите ваше име"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email адреса *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="vase.ime@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Лозинка *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                  placeholder="Унесите лозинку"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Пријављивање...' : 'Пријави се'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Зашто се пријавити?</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Објављујте ваше приче о Заплању</li>
                <li>• Уређујте и управљајте вашим садржајем</li>
                <li>• Повежите се са другим ауторима</li>
                <li>• Пратите статистике читања</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Демо подаци: bilo.koji@email.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};