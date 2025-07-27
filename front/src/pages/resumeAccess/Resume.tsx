import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./css/resume.css";
import FileLogo from "@/assets/icon/FileLogo.svg";
import NotMemberNavigation from "@/components/NotMemberNavigation";
import PersonalData from "./components/PersonalData";
import Education from "./components/Education";
import Experience from "./components/Career";
import License from "./components/License";
import Skills from "./components/Skills";
import Other from "./components/Other";
import TestResult from "./components/TestResult";
import CompanyTest from "./components/CompanyTest";
import { AnimatePresence, motion } from "framer-motion";
import type { ResumeAction } from "@/reducer/resumeReducer";
import type { ResumeState } from "@/types/resume";

interface ResumeProps {
  resumeData: ResumeState;
  dispatch: React.Dispatch<ResumeAction>;
}

const Resume: React.FC<ResumeProps> = ({ resumeData, dispatch }) => {
  const [showCompanyTest, setShowCompanyTest] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [author, setAuthor] = useState<string>("");
  const BACK_URL = import.meta.env.VITE_BACKEND_ADDRESS;

  // mount 여부 확인 (애니메이션 제어용)
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 공통 핸들러: key와 값만 넘겨서 dispatch
  const handleChange = useCallback(
    <K extends keyof ResumeState>(key: K, value: ResumeState[K]) => {
      const typeMap: Record<keyof ResumeState, ResumeAction["type"]> = {
        personalData: "SET_PERSONAL",
        education: "SET_EDUCATION",
        career: "SET_CAREER",
        certificates: "SET_CERTIFICATES",
        skills: "SET_SKILLS",
        otherinfo: "SET_OTHERINFO",
        companyTest: "SET_COMPANYTEST",
      };
      dispatch({ type: typeMap[key], payload: value as any });
    },
    [dispatch]
  );

  // CompanyTest 보기/숨기기 제어
  const handleStartTest = () => {
    if (!hasMounted) return;
    window.scrollTo(0, 0);
    setShowCompanyTest(true);
  };

  const handleBackToResume = (scores: ResumeState["companyTest"]) => {
    if (scores) {
      handleChange("companyTest", scores);
    }
    setShowCompanyTest(false);
  };

  // 문자열일 수 있는 companyTest 데이터 파싱
  const parsedScores = useMemo(() => {
    return typeof resumeData.companyTest === "string"
      ? JSON.parse(resumeData.companyTest)
      : resumeData.companyTest;
  }, [resumeData.companyTest]);

  // 제출 버튼 클릭 시 이력서 전송
  const handleSubmitResume = async () => {
    const {
      personalData,
      education,
      career,
      certificates,
      skills,
      otherinfo,
      companyTest,
    } = resumeData;

    const {
      name,
      birth_date,
      gender,
      address,
      phone,
      current_salary,
      desired_salary,
    } = personalData;

    // 필수 항목 검증
    if (
      !name ||
      !birth_date ||
      !gender ||
      !address ||
      !phone ||
      !current_salary ||
      !desired_salary
    ) {
      alert("인적사항의 모든 필수 항목을 입력해주세요.");
      return;
    }

    if (!author.trim()) {
      alert("작성자를 입력해주세요.");
      return;
    }

    // 제출할 데이터 구성
    const finalResumeData = {
      name,
      birth_date,
      gender,
      address,
      phone,
      current_salary,
      desired_salary,
      education: JSON.stringify(education),
      career: JSON.stringify(career),
      certificates: JSON.stringify(certificates),
      skills: JSON.stringify(skills),
      otherinfo: JSON.stringify(otherinfo),
      companyTest,
    };

    // 전송 요청
    try {
      const response = await fetch(`${BACK_URL}/resume/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalResumeData),
      });

      if (response.ok) {
        const result = await response.json();
        const resumeId = result.resume_id;

        // 키워드 추출 요청
        const keywordResponse = await fetch(
          `${BACK_URL}/resume/${resumeId}/keyword`,
          { method: "POST" }
        );
        if (keywordResponse.ok) {
          const keywordResult = await keywordResponse.json();
          console.log("추출된 키워드:", keywordResult.keywords);
        }

        alert("이력서가 성공적으로 제출되었습니다!");
      } else {
        alert("제출 실패: 서버 오류");
      }
    } catch (error) {
      console.error("제출 중 오류:", error);
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="resume-container">
      <NotMemberNavigation />

      <AnimatePresence mode="wait">
        {showCompanyTest ? (
          <motion.div
            key="company-test"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <CompanyTest onBackToResume={handleBackToResume} />
          </motion.div>
        ) : (
          <motion.div
            key="resume"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <header>
                <div className="image-recommend_page-index-wrapper">
                  <img src={FileLogo} alt="-" />
                  <h2>이력서 등록</h2>
                </div>
                <p>
                  <strong>*</strong> 필수 항목은 꼭 입력해주세요. 자세히
                  입력할수록 매칭률이 높아집니다!
                </p>
                <p>
                  <strong>자동 저장</strong> 기능이 동작하므로, 입력한 내용은
                  유지됩니다.
                </p>
              </header>

              <main className="resume-main">
                <label className="resume-title-label">인적사항</label>
                <PersonalData
                  initialData={resumeData.personalData}
                  onChange={(data) => handleChange("personalData", data)}
                />

                <label className="resume-title-label">학력</label>
                <Education
                  initialData={resumeData.education}
                  onChange={(data) => handleChange("education", data)}
                />

                <div className="experience-label">
                  <label className="resume-title-label">경력</label>
                  <p>
                    직무명, 직무내용은 자세히 입력할수록 매칭 확률이 올라갑니다!
                  </p>
                </div>
                <Experience
                  initialData={resumeData.career}
                  onChange={(data) => handleChange("career", data)}
                />

                <label className="resume-title-label">자격증</label>
                <License
                  initialData={resumeData.certificates}
                  onChange={(data) => handleChange("certificates", data)}
                />

                <div className="skills-label">
                  <label className="resume-title-label">SKILLS</label>
                  <p>Language / Web FE & BE / DB / DevOps & Cloud / Tool</p>
                </div>
                <Skills
                  initialData={resumeData.skills}
                  onChange={(data) => handleChange("skills", data)}
                />

                <div className="others-label">
                  <label className="resume-title-label">기타</label>
                  <p>병역사항, 건강상태 등을 자유롭게 작성해주세요!</p>
                </div>
                <Other
                  initialData={resumeData.otherinfo}
                  onChange={(data) => handleChange("otherinfo", data)}
                />

                <div className="test-result-label">
                  <label className="resume-title-label">맞춤기업 TEST</label>
                  <p>나와 잘 맞는 기업과 매칭될 확률을 높여보세요!</p>
                </div>
                <TestResult
                  onStartTest={handleStartTest}
                  scores={parsedScores}
                  onChange={(data) =>
                    handleChange("companyTest", data.companyTest)
                  }
                />

                <div className="resume-signature-section">
                  <p>본 지원서의 내용은 사실이며 본인이 작성하였습니다.</p>
                  <div className="signature-author">
                    <label>
                      작성자<strong>*</strong>:
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="작성자명 입력"
                    />
                  </div>

                  <div className="signature-buttons">
                    <button onClick={handleSubmitResume}>제출</button>
                    <button>취소</button>
                  </div>
                </div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resume;
