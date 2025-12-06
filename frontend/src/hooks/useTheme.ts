import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../contexts/ThemeContext';

/**
 * Hook personnalisé pour accéder au contexte du thème
 * @returns {ThemeContextType} Contexte theme avec isDark et toggleTheme
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
