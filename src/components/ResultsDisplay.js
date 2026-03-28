"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import personalities from "../data/personalities";

export default function ResultsDisplay() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("mbti-result");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setResult(parsed);
    setPersonality(personalities[parsed.type]);

    // Reveal animation
    setTimeout(() => setRevealed(true), 300);
  }, [router]);

  if (!result || !personality) {
    return (
      <div className="results-loading">
        <div className="loading-spinner" />
        <p>{t("loading")}</p>
      </div>
    );
  }

  const dimensions = [
    {
      key: "EI",
      left: "E",
      right: "I",
      label: t("dimension_EI"),
    },
    {
      key: "SN",
      left: "S",
      right: "N",
      label: t("dimension_SN"),
    },
    {
      key: "TF",
      left: "T",
      right: "F",
      label: t("dimension_TF"),
    },
    {
      key: "JP",
      left: "J",
      right: "P",
      label: t("dimension_JP"),
    },
  ];

  const getDimensionPercent = (score, max = 24) => {
    // score ranges from -max to +max
    // Positive = right side (I, N, F, P), Negative = left side (E, S, T, J)
    const percent = ((score + max) / (2 * max)) * 100;
    return Math.round(Math.min(Math.max(percent, 5), 95));
  };

  const handleRetake = () => {
    localStorage.removeItem("mbti-result");
    router.push("/test");
  };

  return (
    <div className={`results-container ${revealed ? "revealed" : ""}`}>
      {/* Main Result Card */}
      <div
        className="result-hero-card"
        style={{ "--result-color": personality.color }}
      >
        <div className="result-emoji">{personality.emoji}</div>
        <div className="result-type-badge">{result.type}</div>
        <h1 className="result-name">{personality.name[language]}</h1>
        <p className="result-description">
          {personality.description[language]}
        </p>
      </div>

      {/* Dimension Breakdown */}
      <div className="dimensions-card">
        <h2 className="card-title">{t("dimension_breakdown")}</h2>
        <div className="dimensions-list">
          {dimensions.map((dim) => {
            const score = result.scores[dim.key];
            const percent = getDimensionPercent(score);
            const winning = score > 0 ? dim.right : dim.left;
            return (
              <div key={dim.key} className="dimension-row">
                <div className="dimension-label">{dim.label}</div>
                <div className="dimension-bar-container">
                  <span
                    className={`dim-letter left ${
                      winning === dim.left ? "winning" : ""
                    }`}
                  >
                    {dim.left}
                  </span>
                  <div className="dimension-bar">
                    <div
                      className="dimension-fill"
                      style={{
                        width: `${percent}%`,
                        background: personality.color,
                      }}
                    />
                    <div
                      className="dimension-marker"
                      style={{ left: `${percent}%` }}
                    />
                  </div>
                  <span
                    className={`dim-letter right ${
                      winning === dim.right ? "winning" : ""
                    }`}
                  >
                    {dim.right}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="traits-grid">
        <div className="trait-card strengths-card">
          <h2 className="card-title">
            <span className="trait-icon">💪</span> {t("strengths")}
          </h2>
          <ul className="trait-list">
            {personality.strengths[language].map((s, i) => (
              <li key={i} className="trait-item" style={{ "--item-delay": `${i * 0.1}s` }}>
                <span className="trait-bullet">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="trait-card weaknesses-card">
          <h2 className="card-title">
            <span className="trait-icon">🔍</span> {t("weaknesses")}
          </h2>
          <ul className="trait-list">
            {personality.weaknesses[language].map((w, i) => (
              <li key={i} className="trait-item" style={{ "--item-delay": `${i * 0.1}s` }}>
                <span className="trait-bullet">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="results-actions">
        <button
          className="btn-primary"
          onClick={handleRetake}
          id="retake-btn"
        >
          {t("retake_test")}
        </button>
        <Link href="/" className="btn-secondary" id="home-btn">
          {t("go_home")}
        </Link>
      </div>
    </div>
  );
}
