import React, { useState } from 'react';
import { X, BookOpen, Tag, Users, ChevronDown } from 'lucide-react';
import { t } from '../utils/textConverter';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToHome: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onBackToHome }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleHomeClick = () => {
    onBackToHome();
    onClose();
  };

  const categories = [
    { name: t('Technology'), count: 1, subcategories: ['Дигитални минимализам', 'Вештачка интелигенција'] },
    { name: t('Culture'), count: 2, subcategories: ['Читање', 'Храна и култура'] },
    { name: t('Environment'), count: 1, subcategories: ['Урбано баштованство', 'Одрживост'] },
    { name: t('Science'), count: 1, subcategories: ['Неуронаука', 'Психологија'] },
    { name: t('Philosophy'), count: 1, subcategories: ['Лутање', 'Мишљење'] }
  ];

  const menuItems = [
    { icon: BookOpen, label: t('Stories'), href: '#' },
    { icon: Users, label: t('Authors'), href: '#' }
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

  const handleSubcategoryClick = (subcategory: string) => {
    console.log('Selected subcategory:', subcategory);
    onClose();
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
                  <a
                    href={item.href}
                    className="flex items-center space-x-3 p-4 rounded-xl hover:bg-amber-50 transition-colors duration-200 group"
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-200" />
                    <span className="text-gray-900 font-medium group-hover:text-amber-700 transition-colors duration-200">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
              
              {/* Categories Section */}
              <li>
                <div className="p-4">
                  {/* Categories Toggle Button */}
                  <button
                    onClick={toggleCategories}
                    className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-amber-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center space-x-3">
                      <Tag className="w-5 h-5 text-gray-600 group-hover:text-amber-600 transition-colors duration-200" />
                      <span className="text-gray-900 font-medium group-hover:text-amber-700 transition-colors duration-200">
                        {t('Categories')}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        showCategories ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {/* Categories List - Only show when toggled */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      showCategories 
                        ? 'max-h-96 opacity-100 mt-2' 
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="space-y-2 ml-8">
                      {categories.map((category) => (
                        <div key={category.name} className="group">
                          {/* Main Category Button */}
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full p-3 rounded-lg hover:bg-amber-50 transition-colors duration-200 border border-transparent hover:border-amber-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 group-hover:text-amber-700">
                                  {category.name}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                  {category.count}
                                </span>
                              </div>
                              <ChevronDown 
                                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                                  expandedCategory === category.name ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </button>
                          
                          {/* Subcategories - Only show when expanded */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedCategory === category.name 
                                ? 'max-h-96 opacity-100 mt-2' 
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="pl-4 space-y-1">
                              {category.subcategories.map((sub) => (
                                <button
                                  key={sub}
                                  onClick={() => handleSubcategoryClick(sub)}
                                  className="block w-full text-left text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-full hover:bg-amber-100 hover:text-amber-700 transition-colors duration-200"
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>
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