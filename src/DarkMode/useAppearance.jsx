// hooks/useAppearance.js
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useAppearance = () => {
  const { theme, language, fontSize, updateTheme, updateLanguage, updateFontSize } = useTheme();
  const [appearance, setAppearance] = useState({
    theme,
    language,
    fontSize
  });

  useEffect(() => {
    setAppearance({ theme, language, fontSize });
  }, [theme, language, fontSize]);

  const updateAppearance = (newAppearance) => {
    updateTheme(newAppearance.theme);
    updateLanguage(newAppearance.language);
    updateFontSize(newAppearance.fontSize);
  };

  return {
    appearance,
    setAppearance,
    updateAppearance
  };
};