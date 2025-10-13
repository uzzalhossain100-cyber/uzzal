"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  currentLanguage: Language;
  switchLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('language') as Language) || 'bn';
    }
    return 'bn';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', currentLanguage);
    }
  }, [currentLanguage]);

  const switchLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};