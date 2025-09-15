import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeType = 'default' | 'masculino' | 'femenino' | 'no-binario';
type GenderType = 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  applyGenderTheme: (gender: GenderType) => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('default');
  const [isDark, setIsDark] = useState(false);

  // Cargar tema guardado del localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('emocionaliaplus-theme') as ThemeType;
    const savedDarkMode = localStorage.getItem('emocionaliaplus-dark-mode') === 'true';
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
    setIsDark(savedDarkMode);
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover clases de tema anteriores
    root.classList.remove('theme-masculino', 'theme-femenino', 'theme-no-binario');
    
    // Aplicar nuevo tema
    if (theme !== 'default') {
      root.classList.add(`theme-${theme}`);
    }

    // Aplicar modo oscuro
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Guardar en localStorage
    localStorage.setItem('emocionaliaplus-theme', theme);
    localStorage.setItem('emocionaliaplus-dark-mode', isDark.toString());
  }, [theme, isDark]);

  const applyGenderTheme = (gender: GenderType) => {
    let newTheme: ThemeType = 'default';
    
    switch (gender) {
      case 'masculino':
        newTheme = 'masculino';
        break;
      case 'femenino':
        newTheme = 'femenino';
        break;
      case 'otro':
        newTheme = 'no-binario';
        break;
      case 'prefiero_no_decir':
        newTheme = 'no-binario'; // Tema neutro para quienes prefieren no decir
        break;
    }
    
    setTheme(newTheme);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  const value: ThemeContextType = {
    theme,
    setTheme,
    applyGenderTheme,
    isDark,
    toggleDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};