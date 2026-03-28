"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="lang-switcher"
      aria-label="Toggle language"
      id="language-toggle"
    >
      <span className={`lang-option ${language === "bn" ? "active" : ""}`}>
        বাংলা
      </span>
      <span className="lang-divider">|</span>
      <span className={`lang-option ${language === "en" ? "active" : ""}`}>
        EN
      </span>
    </button>
  );
}
