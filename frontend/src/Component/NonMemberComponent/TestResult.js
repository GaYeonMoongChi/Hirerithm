import React, { useState, useEffect } from "react";
import "./resumeComponent.css";

const categoryLabel = {
  TeamCulture: "조직문화 (TeamCulture)",
  Evaluation: "공정한 평가, 성장지원 (Evaluation)",
  PayLevel: "보상수준 (PayLevel)",
  VisionDirection: "비전 및 방향성 (VisionDirection)",
  Welfare: "복지 (Welfare)",
  Workload: "워라벨 (Workload)",
};

const TestResult = ({ onStartTest, scores, onChange }) => {
  const [manualScores, setManualScores] = useState({
    TeamCulture: "",
    Evaluation: "",
    PayLevel: "",
    VisionDirection: "",
    Welfare: "",
    Workload: "",
  });

  // TEST 결과가 들어오면 상위에 전달
  useEffect(() => {
    if (scores) {
      const companyTestString = JSON.stringify(scores);
      onChange({ companyTest: companyTestString });
    }
  }, [scores, onChange]);

  const handleChange = (category, value) => {
    setManualScores((prev) => {
      const updated = {
        ...prev,
        [category]: value,
      };

      // 모든 입력값 number 형식으로
      const parsedScores = {};
      let allValid = true;

      for (const [cat, val] of Object.entries(updated)) {
        const numberValue = parseFloat(val);
        if (val === "") continue;

        if (isNaN(numberValue) || numberValue < 1 || numberValue > 5) {
          allValid = false;
          break;
        }
        parsedScores[cat] = numberValue;
      }

      // 유효성 검사 통과하면 상위로 전달
      if (
        allValid &&
        Object.keys(parsedScores).length === Object.keys(categoryLabel).length
      ) {
        const companyTestString = JSON.stringify(parsedScores);
        onChange({ companyTest: companyTestString });
      }

      return updated;
    });
  };

  const displayScores = scores;

  return (
    <div className="resume-item-container">
      <button className="test-page-button" onClick={onStartTest}>
        맞춤기업 TEST 하러가기
      </button>

      {/* TEST 결과 or 직접 입력 */}
      {displayScores ? (
        <div className="resume-item-container">
          <h3 className="test-result-title">[TEST 결과]</h3>
          <p className="test-result-detail">
            * 점수가 높을 수록 해당 특징을 가진 기업과 잘 맞을 확률이 높아요!
          </p>
          <div className="test-result-item">
            <ul>
              {Object.entries(displayScores)
                .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                .map(([category, score]) => (
                  <li key={category}>
                    <span className="test-category"></span>
                    <label>{categoryLabel[category]}</label>
                    <span className="result-score">
                      {parseFloat(score).toFixed(2)}점
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="resume-item-container">
          <h3 className="test-result-title">[직접 점수 입력]</h3>
          <p className="test-result-detail">
            각 항목별 점수를 1~5점 사이로 입력해주세요. 소수점 한 자리까지 입력
            (ex. 1.4, 4.6)
          </p>
          <div className="test-result-input-item">
            {Object.keys(categoryLabel).map((category) => (
              <div key={category} className="input-item">
                <label>{categoryLabel[category]}</label>
                <input
                  type="text"
                  value={manualScores[category]}
                  onChange={(e) => handleChange(category, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestResult;
