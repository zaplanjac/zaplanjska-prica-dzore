import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Tag, X } from 'lucide-react';
import { t } from '../utils/textConverter';

interface CategoryDropdownProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ 
  onCategorySelect, 
  selectedCategory 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: 'Technology', displayName: t('Technology'), count: 1, subcategories: ['Дигитални минимализам', 'Вештачка интелигенција'] },
    { name: 'Culture', displayName: t('Culture'), count: 2, subcategories: ['Читање', 'Храна и култура'] },
    { name: 'Environment', displayName: t('Environment'), count: 1, subcategories: ['Урбано баштованство', 'Одрживост'] },
    { name: 'Science', displayName: t('Science'), count: 1, subcategories: ['Неуронаука', 'Психологија'] },
    { name: 'Philosophy', displayName: t('Philosophy'), count: 1, subcategories: ['Лутање', 'Мишљење'] }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category: string) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    onCategorySelect('all');
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedCategory === 'all') {
      return t('Categories');
    }
    const category = categories.find(cat => cat.name === selectedCategory);
    return category ? category.displayName : selectedCategory;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-3 py-2 ${
          selectedCategory !== 'all' 
            ? 'text-amber-700 bg-amber-50 border border-amber-200' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <span>{getDisplayText()}</span>
        {selectedCategory !== 'all' ? (
          <X 
            className="w-4 h-4 hover:text-amber-900" 
            onClick={(e) => {
              e.stopPropagation();
              handleClearFilter();
            }}
          />
        ) : (
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 transform origin-top ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="p-4">
          <h3 className="text-lg font-serif font-bold text-gray-900 mb-3 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-amber-600" />
            {t('Categories')}
          </h3>
          
          {/* All Categories Option */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={`w-full text-left p-3 rounded-lg transition-colors duration-200 border mb-2 ${
              selectedCategory === 'all'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
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

          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="group">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 border ${
                    selectedCategory === category.name
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'border-transparent hover:bg-amber-50 hover:border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${
                      selectedCategory === category.name ? 'text-amber-700' : 'text-gray-900 group-hover:text-amber-700'
                    }`}>
                      {category.displayName}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
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
    </div>
  );
};