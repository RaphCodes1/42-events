import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (term: string) => void;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search',
  onSearch,
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.div 
      className="relative w-full max-w-md"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center">
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={18} 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-14 py-2 dark:border-gray-700 focus:outline-none focus:border-none focus:ring-0 transition-all duration-300 bg-gray-50 dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        {searchTerm && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute right-0 inset-y-0 w-14 flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={clearSearch}
          >
            <X size={18} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};