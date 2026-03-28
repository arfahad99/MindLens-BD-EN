"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          <span className="brand-icon">🧠</span>
          <div className="brand-text">
            <span className="brand-title">{t("app_title")}</span>
            <span className="brand-subtitle">{t("app_subtitle")}</span>
          </div>
        </Link>
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
