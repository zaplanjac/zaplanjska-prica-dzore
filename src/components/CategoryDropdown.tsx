import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Tag } from 'lucide-react';
import { t } from '../utils/textConverter';

interface CategoryDropdownProps {
  onCategorySelect?: (category: string) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: t('Technology'), count: 1, subcategories: ['Дигитални минимализам', 'Вештачка интелигенција'] },
    { name: t('Culture'), count: 2, subcategories: ['Читање', 'Храна и култура'] },
    { name: t('Environment'), count: 1, subcategories: ['Урбано баштованство', 'Одрживост'] },
    { name: t('Science'), count: 1, subcategories: ['Неуронаука', 'Психологија'] },
    { name: t('Philosophy'), count: 1, subcategories: ['Лутање', 'Мишљење'] }
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
    onCategorySelect?.(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-2 py-1"
      >
        <span>{t('Categories')}</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
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
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="group">
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className="w-full text-left p-3 rounded-lg hover:bg-amber-50 transition-colors duration-200 border border-transparent hover:border-amber-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 group-hover:text-amber-700">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {category.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors duration-200"
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