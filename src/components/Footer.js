"use client";

import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">{t("footer_text")}</p>
        <p className="footer-made">
          {t("made_with")} <span className="heart">❤️</span>
        </p>
      </div>
    </footer>
  );
}
