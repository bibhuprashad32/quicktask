import { useState, useEffect } from 'react';

const THEME_KEY = 'quicktask_theme_v1';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem(THEME_KEY, theme);

  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};