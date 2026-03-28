"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import questions from "../data/questions";

const answerOptions = [
  { value: 2, key: "strongly_agree" },
  { value: 1, key: "agree" },
  { value: 0, key: "neutral" },
  { value: -1, key: "disagree" },
  { value: -2, key: "strongly_disagree" },
];

export default function QuizEngine() {
  const { language, t } = useLanguage();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animDir, setAnimDir] = useState("next");

  const question = questions[currentIndex];
  const progress = Math.round(
    (Object.keys(answers).length / questions.length) * 100
  );

  const handleAnswer = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: value,
    }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setAnimDir("next");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setAnimDir("prev");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const calculateResult = () => {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

    questions.forEach((q) => {
      const answer = answers[q.id];
      if (answer !== undefined) {
        scores[q.dimension] += answer * q.direction;
      }
    });

    const type = [
      scores.EI > 0 ? "I" : "E",
      scores.SN > 0 ? "N" : "S",
      scores.TF > 0 ? "F" : "T",
      scores.JP > 0 ? "P" : "J",
    ].join("");

    // Store scores and type for results page
    const result = {
      type,
      scores,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("mbti-result", JSON.stringify(result));
    router.push("/results");
  };

  const isLastQuestion = currentIndex === questions.length - 1;
  const allAnswered = Object.keys(answers).length === questions.length;
  const currentAnswer = answers[question.id];

  return (
    <div className="quiz-container">
      {/* Progress Bar */}
      <div className="quiz-progress-wrapper">
        <div className="quiz-progress-header">
          <span className="quiz-progress-label">{t("progress")}</span>
          <span className="quiz-progress-count">
            {Object.keys(answers).length}/{questions.length}
          </span>
        </div>
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-card" key={currentIndex}>
        <div className="quiz-question-number">
          {t("question")} {currentIndex + 1} {t("of")} {questions.length}
        </div>
        <h2 className="quiz-question-text">
          {language === "bn" ? question.text_bn : question.text_en}
        </h2>

        <div className="quiz-options">
          {answerOptions.map((option) => (
            <button
              key={option.value}
              className={`quiz-option ${
                currentAnswer === option.value ? "selected" : ""
              }`}
              onClick={() => handleAnswer(option.value)}
              id={`option-${option.key}`}
            >
              <span className="option-indicator">
                {currentAnswer === option.value ? "●" : "○"}
              </span>
              <span className="option-text">{t(option.key)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button
          className="btn-nav btn-prev"
          onClick={goPrev}
          disabled={currentIndex === 0}
          id="prev-btn"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t("previous")}
        </button>

        {isLastQuestion ? (
          <button
            className="btn-nav btn-submit"
            onClick={calculateResult}
            disabled={!allAnswered}
            id="submit-btn"
          >
            {t("submit")}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button
            className="btn-nav btn-next"
            onClick={goNext}
            disabled={currentAnswer === undefined}
            id="next-btn"
          >
            {t("next")}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Question dots navigation */}
      <div className="quiz-dots">
        {questions.map((q, i) => (
          <button
            key={q.id}
            className={`quiz-dot ${i === currentIndex ? "current" : ""} ${
              answers[q.id] !== undefined ? "answered" : ""
            }`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Question ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
