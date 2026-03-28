"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="hero-content">
        <div className="hero-badge">🧠 MBTI</div>
        <h1 className="hero-title">{t("hero_title")}</h1>
        <p className="hero-subtitle">{t("hero_subtitle")}</p>
        <Link href="/test" className="btn-primary" id="start-test-btn">
          <span>{t("start_test")}</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="personality-orbit">
        {["🏛️", "🔬", "👑", "⚡", "🌟", "🦋", "🎭", "🎪"].map(
          (emoji, i) => (
            <div
              key={i}
              className="orbit-item"
              style={{ "--orbit-delay": `${i * -3}s` }}
            >
              <span>{emoji}</span>
            </div>
          )
        )}
      </div>
    </section>
  );
}
