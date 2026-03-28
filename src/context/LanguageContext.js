"use client";

import { createContext, useContext, useState, useEffect } from "react";
import translations from "../data/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("bn");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("mbti-lang");
    if (saved && (saved === "bn" || saved === "en")) {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "bn" ? "en" : "bn";
    setLanguage(newLang);
    localStorage.setItem("mbti-lang", newLang);
  };

  const t = (key) => {
    if (translations[key]) {
      return translations[key][language] || key;
    }
    return key;
  };

  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
