import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SortAsc, SortDesc, ChevronDown } from 'lucide-react';
import { SortOption } from '../../types';

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  currentSort,
  onSortChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'title-asc', label: 'Title (A-Z)', icon: <SortAsc size={16} /> },
    { value: 'title-desc', label: 'Title (Z-A)', icon: <SortDesc size={16} /> },
    { value: 'date-asc', label: 'Date (Earliest)', icon: <SortAsc size={16} /> },
    { value: 'date-desc', label: 'Date (Latest)', icon: <SortDesc size={16} /> },
    { value: 'created-asc', label: 'Created (Oldest)', icon: <SortAsc size={16} /> },
    { value: 'created-desc', label: 'Created (Newest)', icon: <SortDesc size={16} /> },
  ];

  const getCurrentSortLabel = () => {
    return sortOptions.find(option => option.value === currentSort)?.label || 'Sort';
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

  const handleSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-transparent border-none shadow-none focus:outline-none text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100/20 dark:hover:bg-gray-700/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sort: {getCurrentSortLabel()}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1 w-52 rounded-md shadow-lg bg-white/80 dark:bg-gray-900/80 border-none z-10"
          >
            <div className="py-1 rounded-md bg-transparent shadow-xs">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100/30 dark:hover:bg-gray-700/30 ${
                    currentSort === option.value ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-700 dark:text-gray-200'
                  }`}
                  onClick={() => handleSelect(option.value as SortOption)}
                >
                  <span className="w-5">{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};