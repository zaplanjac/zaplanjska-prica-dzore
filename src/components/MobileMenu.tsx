import React from 'react';
import { X, BookOpen, Users, Clock } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHome: () => void;
  onViewAuthors: () => void;
  onViewHistory: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onBackToHome, 
  onViewAuthors,
  onViewHistory
}) => {
  const handleHomeClick = () => {
    onBackToHome();
    onClose();
  };

  const handleAuthorsClick = () => {
    onViewAuthors();
    onClose();
  };

  const handleHistoryClick = () => {
    onViewHistory();
    onClose();
  };

  const menuItems = [
    { icon: BookOpen, label: 'Приче', onClick: handleHomeClick },
    { icon: Users, label: 'Аутори', onClick: handleAuthorsClick },
    { icon: Clock, label: 'Историја', onClick: handleHistoryClick }
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            <button
              onClick={handleHomeClick}
              className="flex items-center space-x-2 group"
            >
              <BookOpen className="w-7 h-7 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />
              <h1 className="text-xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-200">
                Читај о Заплању
              </h1>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Затвори мени"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.onClick}
                    className="flex items-center space-x-3 p-4 rounded-xl hover:bg-amber-50 transition-colors duration-200 group w-full text-left"
                  >
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-200" />
                    <span className="text-gray-900 font-medium group-hover:text-amber-700 transition-colors duration-200">
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <p className="text-sm text-gray-500 text-center">
              © 2024 Читај о Заплању. Сва права задржана.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};