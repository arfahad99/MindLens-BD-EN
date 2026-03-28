"use client";

import { useLanguage } from "../context/LanguageContext";

const featureIcons = ["🔬", "🌐", "📊", "🎯"];

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: featureIcons[0],
      title: t("feature_1_title"),
      desc: t("feature_1_desc"),
    },
    {
      icon: featureIcons[1],
      title: t("feature_2_title"),
      desc: t("feature_2_desc"),
    },
    {
      icon: featureIcons[2],
      title: t("feature_3_title"),
      desc: t("feature_3_desc"),
    },
    {
      icon: featureIcons[3],
      title: t("feature_4_title"),
      desc: t("feature_4_desc"),
    },
  ];

  return (
    <section className="features-section">
      <h2 className="section-title">{t("features_title")}</h2>
      <div className="features-grid">
        {features.map((feature, i) => (
          <div
            key={i}
            className="feature-card"
            style={{ "--card-delay": `${i * 0.1}s` }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
