import React, { useState, useEffect } from "react";
import FileLogo from "@/assets/icon/FileLogo.svg";
import questions from "@/data/USER_CATEGORY.json";
import "./css/companyTest.css";
import type { CompanyTest } from "@/types/resume";

interface Question {
  question: string;
  positive_category: keyof CompanyTest;
  negative_category: keyof CompanyTest;
}

interface CompanyTestProps {
  onBackToResume: (scores: CompanyTest) => void;
}

const CompanyTest: React.FC<CompanyTestProps> = ({ onBackToResume }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const handleSelect = (questionIndex: number, score: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = score;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    const isAllAnswered = answers.every((a) => a !== null);
    if (!isAllAnswered) {
      alert("모든 문항에 답해주세요!");
      return;
    }

    // 점수 초기화
    const categoryScores: CompanyTest = {
      TeamCulture: 0,
      Evaluation: 0,
      PayLevel: 0,
      VisionDirection: 0,
      Welfare: 0,
      Workload: 0,
    };

    // 문항 수 집계
    const categoryCounts: Record<keyof CompanyTest, number> = {
      TeamCulture: 0,
      Evaluation: 0,
      PayLevel: 0,
      VisionDirection: 0,
      Welfare: 0,
      Workload: 0,
    };

    (questions as Question[]).forEach((q) => {
      categoryCounts[q.positive_category]++;
      categoryCounts[q.negative_category]++;
    });

    (questions as Question[]).forEach((q, index) => {
      const r = answers[index]!;
      const positiveScore = r;
      const negativeScore = 6 - r;

      categoryScores[q.positive_category] += positiveScore;
      categoryScores[q.negative_category] += negativeScore;
    });

    // 평균 계산 (소수점 둘째 자리까지 반올림)
    Object.keys(categoryScores).forEach((category) => {
      const key = category as keyof CompanyTest;
      if (categoryCounts[key] > 0) {
        categoryScores[key] =
          Math.round((categoryScores[key] / categoryCounts[key]) * 100) / 100;
      }
    });

    console.log("카테고리별 점수:", categoryScores);
    onBackToResume(categoryScores);
  };

  return (
    <div className="image-recommend_wrapper">
      <header>
        <div className="image-recommend_page-index-wrapper">
          <img src={FileLogo} alt="-" />
          <h2>맞춤기업 TEST</h2>
        </div>
      </header>

      <main className="company-test_main">
        {(questions as Question[]).map((q, idx) => (
          <div key={idx} className="company-test_question-block">
            <p className="company-test_question">
              Q{idx + 1}. {q.question}
            </p>
            <div className="company-test_choices">
              {[1, 2, 3, 4, 5].map((score) => {
                const sizeClass = {
                  1: "size-lg",
                  2: "size-md",
                  3: "size-sm",
                  4: "size-md",
                  5: "size-lg",
                }[score];

                const labelText = {
                  1: "매우 그렇지 않다",
                  3: "보통이다",
                  5: "매우 그렇다",
                }[score];

                return (
                  <div
                    key={score}
                    className={`company-test_choice-wrapper ${sizeClass}`}
                    onClick={() => handleSelect(idx, score)}
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      id={`q${idx}_opt${score}`}
                      checked={answers[idx] === score}
                      onChange={() => handleSelect(idx, score)}
                    />
                    <label
                      htmlFor={`q${idx}_opt${score}`}
                      className="company-test_choice"
                    />
                    {labelText && (
                      <div className="company-test_choice-label">
                        {labelText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <button onClick={handleSubmit} className="company-test_submit-btn">
          결과 제출하기
        </button>
      </main>
    </div>
  );
};

export default CompanyTest;
