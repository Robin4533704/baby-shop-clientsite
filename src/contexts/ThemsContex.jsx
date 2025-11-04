// contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState('medium');

  // Load theme from localStorage on initial render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setFontSize(savedFontSize);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Set data-theme attribute for CSS variables
    root.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply language
  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  // Apply font size
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous font size classes
    root.classList.remove('text-small', 'text-medium', 'text-large');
    
    // Add current font size class
    root.classList.add(`text-${fontSize}`);
    
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const updateLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const updateFontSize = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const value = {
    theme,
    language,
    fontSize,
    updateTheme,
    updateLanguage,
    updateFontSize
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};