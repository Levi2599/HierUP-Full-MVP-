import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    () => localStorage.getItem('pref-lang') || 'en'
  );

  const applyLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  };

  // Apply on mount and whenever language changes
  useEffect(() => {
    applyLanguage(language);
  }, [language]);

  const setLanguage = (lang) => {
    localStorage.setItem('pref-lang', lang);
    setLanguageState(lang);
  };

  // Strips decorative emoji/pictographs from UI labels for a consistent, mature
  // look, while preserving directional arrows (← →) which are legitimate UI cues.
  const emojiOnly = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu;
  const t = (key) => {
    const raw = translations[language]?.[key] ?? translations['en'][key] ?? key;
    return typeof raw === 'string'
      ? raw.replace(emojiOnly, '').replace(/\s{2,}/g, ' ').trim()
      : raw;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
