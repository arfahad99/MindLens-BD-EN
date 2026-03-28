"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import personalities from "../../data/personalities";

export default function ProfilePage() {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    setEditName(user?.name || "");
    setTimeout(() => setRevealed(true), 100);
  }, [isLoggedIn, router, user]);

  if (!isLoggedIn || !user) return null;

  const handleSaveName = () => {
    if (editName.trim()) {
      updateProfile({ name: editName.trim() });
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (language === "bn") {
      const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      return formatted.replace(/[0-9]/g, (d) => bnDigits[d]);
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPersonality = (type) => {
    return personalities[type] || null;
  };

  const history = user.testHistory || [];

  return (
    <div className="profile-page">
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className={`profile-container ${revealed ? "revealed" : ""}`}>
        {/* Profile Hero */}
        <div className="profile-hero-card">
          <div
            className="profile-avatar-large"
            style={{ background: user.avatar?.color || "#7c3aed" }}
          >
            {user.avatar?.initial || user.name?.charAt(0).toUpperCase()}
          </div>

          {isEditing ? (
            <div className="profile-edit-name">
              <input
                type="text"
                className="form-input profile-name-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                autoFocus
              />
              <div className="profile-edit-actions">
                <button className="btn-icon btn-save" onClick={handleSaveName}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button className="btn-icon btn-cancel" onClick={() => setIsEditing(false)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-name-row">
              <h1 className="profile-name">{user.name}</h1>
              <button className="btn-icon btn-edit" onClick={() => setIsEditing(true)} aria-label="Edit name">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>
          )}

          <p className="profile-email">{user.email}</p>
          <p className="profile-joined">
            {t("member_since")} {formatDate(user.createdAt)}
          </p>

          {/* Stats Row */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{history.length}</span>
              <span className="stat-label">{t("tests_taken")}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">
                {history.length > 0 ? history[0].type : "—"}
              </span>
              <span className="stat-label">{t("latest_type")}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">
                {history.length > 0
                  ? [...new Set(history.map((h) => h.type))].length
                  : "0"}
              </span>
              <span className="stat-label">{t("unique_types")}</span>
            </div>
          </div>
        </div>

        {/* Test History */}
        <div className="profile-section-card">
          <div className="card-title">
            <span>📊</span> {t("test_history")}
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              <div className="empty-icon">🧪</div>
              <p className="empty-text">{t("no_tests_yet")}</p>
              <Link href="/test" className="btn-primary" id="take-first-test-btn">
                <span>{t("take_first_test")}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="history-list">
              {history.map((entry, i) => {
                const personality = getPersonality(entry.type);
                return (
                  <div
                    key={entry.id || i}
                    className="history-item"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="history-emoji">
                      {personality?.emoji || "🧠"}
                    </div>
                    <div className="history-info">
                      <div className="history-type-row">
                        <span className="history-type-badge">{entry.type}</span>
                        <span className="history-type-name">
                          {personality
                            ? language === "bn"
                              ? personality.name_bn
                              : personality.name_en
                            : entry.type}
                        </span>
                      </div>
                      <span className="history-date">
                        {formatDate(entry.takenAt || entry.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <Link href="/test" className="btn-primary" id="retake-test-btn">
            <span>{t("start_test")}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>

          {showLogoutConfirm ? (
            <div className="logout-confirm">
              <span className="logout-confirm-text">{t("confirm_logout")}</span>
              <button className="btn-danger" onClick={handleLogout} id="confirm-logout-btn">
                {t("yes_logout")}
              </button>
              <button className="btn-secondary btn-sm" onClick={() => setShowLogoutConfirm(false)}>
                {t("cancel")}
              </button>
            </div>
          ) : (
            <button
              className="btn-secondary"
              onClick={() => setShowLogoutConfirm(true)}
              id="logout-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>{t("logout")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
