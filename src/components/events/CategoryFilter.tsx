import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { EventCategory } from '../../types';

interface CategoryFilterProps {
  currentCategory: EventCategory | 'all';
  onCategoryChange: (category: EventCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  currentCategory,
  onCategoryChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'conference', label: 'Conferences' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'meetup', label: 'Meetups' },
    { value: 'exhibition', label: 'Exhibitions' },
    { value: 'other', label: 'Other' },
  ];

  const getCurrentCategoryLabel = () => {
    return categories.find(cat => cat.value === currentCategory)?.label || 'All Categories';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (category: EventCategory | 'all') => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-transparent border-none shadow-none focus:outline-none text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100/20 dark:hover:bg-gray-700/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter size={16} />
        <span className="hidden sm:inline">{getCurrentCategoryLabel()}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white/80 dark:bg-gray-900/80 border-none z-10"
          >
            <div className="py-1 rounded-md bg-transparent shadow-xs">
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100/30 dark:hover:bg-gray-700/30 ${
                    currentCategory === category.value ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => handleSelect(category.value as EventCategory | 'all')}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};