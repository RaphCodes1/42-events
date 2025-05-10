import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === null) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
      return true;
    }
    return stored === 'true';
  });

  useEffect(() => {
    const isDarkStored = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkStored);
    document.documentElement.classList.toggle('dark', isDarkStored);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('darkMode', String(newIsDark));
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  return { isDark, toggleTheme };
};