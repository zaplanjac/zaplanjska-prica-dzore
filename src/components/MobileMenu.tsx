import React, { useState } from 'react';
import { X, BookOpen, Tag, Users, ChevronDown, Clock } from 'lucide-react';
import { t } from '../utils/textConverter';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHome: () => void;
  onViewAuthors: () => void;
  onViewHistory: () => void;
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onBackToHome, 
  onViewAuthors, 
  onViewHistory,
  onCategorySelect,
  selectedCategory
}) => {
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

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

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    onClose();
  };

  const categories = [
    { name: 'Technology', displayName: t('Technology'), count: 1, subcategories: ['Дигитални минимализам', 'Вештачка интелигенција'] },
    { name: 'Culture', displayName: t('Culture'), count: 2, subcategories: ['Читање', 'Храна и култура'] },
    { name: 'Environment', displayName: t('Environment'), count: 1, subcategories: ['Урбано баштованство', 'Одрживост'] },
    { name: 'Science', displayName: t('Science'), count: 1, subcategories: ['Неуронаука', 'Психологија'] },
    { name: 'Philosophy', displayName: t('Philosophy'), count: 1, subcategories: ['Лутање', 'Мишљење'] }
  ];

  const menuItems = [
    { icon: BookOpen, label: t('Stories'), onClick: handleHomeClick },
    { icon: Users, label: t('Authors'), onClick: handleAuthorsClick },
    { icon: Clock, label: 'Историја', onClick: handleHistoryClick }
  ];

  const toggleCategories = () => {
    setShowCategories(!showCategories);
    if (!showCategories) {
      setExpandedCategory(null);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

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
              
              {/* Categories Section */}
              <li>
                <div className="p-4">
                  {/* Categories Toggle Button */}
                  <button
                    onClick={toggleCategories}
                    className={`flex items-center justify-between w-full p-3 rounded-xl transition-colors duration-200 group ${
                      selectedCategory !== 'all' 
                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                        : 'hover:bg-amber-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Tag className={`w-5 h-5 transition-colors duration-200 ${
                        selectedCategory !== 'all' 
                          ? 'text-amber-600' 
                          : 'text-gray-600 group-hover:text-amber-600'
                      }`} />
                      <span className={`font-medium transition-colors duration-200 ${
                        selectedCategory !== 'all' 
                          ? 'text-amber-700' 
                          : 'text-gray-900 group-hover:text-amber-700'
                      }`}>
                        {selectedCategory === 'all' ? t('Categories') : 
                          categories.find(cat => cat.name === selectedCategory)?.displayName || selectedCategory
                        }
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        showCategories ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {/* Categories List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      showCategories 
                        ? 'max-h-96 opacity-100 mt-2' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-2 ml-8">
                      {/* All Categories Option */}
                      <button
                        onClick={() => handleCategoryClick('all')}
                        className={`w-full p-3 rounded-lg transition-colors duration-200 border ${
                          selectedCategory === 'all'
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'border-transparent hover:bg-amber-50 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">
                            Све категорије
                          </span>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {categories.reduce((total, cat) => total + cat.count, 0)}
                          </span>
                        </div>
                      </button>

                      {categories.map((category) => (
                        <div key={category.name} className="group">
                          {/* Main Category Button */}
                          <button
                            onClick={() => handleCategoryClick(category.name)}
                            className={`w-full p-3 rounded-lg transition-colors duration-200 border ${
                              selectedCategory === category.name
                                ? 'bg-amber-50 border-amber-200 text-amber-700'
                                : 'border-transparent hover:bg-amber-50 hover:border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium ${
                                  selectedCategory === category.name ? 'text-amber-700' : 'text-gray-900 group-hover:text-amber-700'
                                }`}>
                                  {category.displayName}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {category.count}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {category.subcategories.map((sub) => (
                                <span
                                  key={sub}
                                  className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                                    selectedCategory === category.name
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'text-gray-600 bg-gray-50 group-hover:bg-amber-100 group-hover:text-amber-700'
                                  }`}
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
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