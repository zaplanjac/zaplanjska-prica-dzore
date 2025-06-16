import React, { useState } from 'react';
import { BookOpen, ArrowLeft, Menu } from 'lucide-react';
import { CategoryDropdown } from './CategoryDropdown';
import { MobileMenu } from './MobileMenu';
import { t } from '../utils/textConverter';

interface HeaderProps {
  onBackToHome: () => void;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onBackToHome, showBackButton = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBackButton && (
                <button
                  onClick={onBackToHome}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="Назад на почетну"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 group"
              >
                <BookOpen className="w-7 h-7 text-amber-600 group-hover:text-amber-700 transition-colors duration-200" />
                <h1 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors duration-200">
                  Читај о Заплању
                </h1>
              </button>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                {t('Stories')}
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200">
                {t('Authors')}
              </a>
              <CategoryDropdown />
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Отвори мени"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onBackToHome={onBackToHome}
      />
    </>
  );
}