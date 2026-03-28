"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { t } = useLanguage();
  const { user, isLoggedIn } = useAuth();

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

        <div className="navbar-right">
          <LanguageSwitcher />

          {isLoggedIn ? (
            <Link href="/profile" className="navbar-avatar" id="profile-link" title={user?.name}>
              <div
                className="avatar-circle"
                style={{ background: user?.avatar?.color || "#7c3aed" }}
              >
                {user?.avatar?.initial || user?.name?.charAt(0).toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link href="/login" className="btn-login" id="login-nav-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>{t("login_btn")}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
