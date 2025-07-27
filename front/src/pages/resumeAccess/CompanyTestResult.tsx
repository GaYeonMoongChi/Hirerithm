import React, { useState } from "react";
//import { useNavigate } from "react-router-dom";
//import axios from "axios";
import FileLogo from "@/assets/icon/FileLogo.svg";
import DownloadIcon from "@/assets/icon/DownloadIcon.svg";
import NonMemberNavigation from "@/components/NotMemberNavigation";
import "./css/companyTestResult.css";
import type { ResumeFormData } from "@/types/resume"; // 이력서 타입

interface CompanyTestResultProps {
  resumeData: ResumeFormData;
}

const CompanyTestResult: React.FC<CompanyTestResultProps> = ({
  resumeData,
}) => {
  //const navigate = useNavigate();
  //const address = process.env.REACT_APP_BACKEND_ADDRESS;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 2; // 고정된 페이지 수

  const scores = resumeData.companyTest;

  // 임시 컴포넌트 (별도 파일로 만들 수도 있음)
  const Cover: React.FC = () => (
    <div className="pdf-page">
      <h3>📄 맞춤기업 TEST 결과 요약</h3>
      <p>
        {resumeData.personalData.name}님의 테스트 결과를 기반으로, 기업과의 매칭
        가능성을 분석하였습니다.
      </p>
      <ul>
        <li>업무 강도(Workload)</li>
        <li>복지(Welfare)</li>
        <li>급여 수준(PayLevel)</li>
        <li>비전 방향성(VisionDirection)</li>
        <li>평가 체계(Evaluation)</li>
      </ul>
      <p>다음 페이지에서 항목별 점수를 확인할 수 있어요.</p>
    </div>
  );

  const Detail: React.FC = () => {
    if (!scores) {
      return (
        <div className="pdf-page">
          <p>테스트 결과가 존재하지 않습니다.</p>
        </div>
      );
    }

    return (
      <div className="pdf-page">
        <h3>📊 항목별 분석 점수</h3>
        <ul>
          <li>Workload (업무 강도): {scores.Workload}점</li>
          <li>Welfare (복지): {scores.Welfare}점</li>
          <li>Pay Level (급여 수준): {scores.PayLevel}점</li>
          <li>Vision Direction (비전 방향성): {scores.VisionDirection}점</li>
          <li>Evaluation (평가 체계): {scores.Evaluation}점</li>
        </ul>
      </div>
    );
  };

  const handleDownload = async (): Promise<void> => {
    // TODO : pdf 다운
    alert("PDF 다운로드 기능은 추후 제공될 예정입니다.");
  };

  // 페이지별 렌더링
  const renderReportContent = (): JSX.Element | null => {
    switch (currentPage) {
      case 1:
        return <Cover />;
      case 2:
        return <Detail />;
      default:
        return null;
    }
  };

  return (
    <div className="image-recommend_wrapper">
      <NonMemberNavigation />

      <header>
        <div className="image-recommend_page-index-wrapper">
          <img src={FileLogo} alt="-" />
          <h2>맞춤기업 TEST 결과</h2>
        </div>
        <p>
          : 결과 pdf 파일을 이력서에 포함시키면, 나와 잘 맞는 기업과 매칭될
          확률이 올라가요!
        </p>
      </header>

      <main>
        {/* 다운로드 버튼 */}
        <button
          className="test-result_download-button"
          onClick={handleDownload}
        >
          <img src={DownloadIcon} className="download-icon" alt="다운로드" />
          <span className="download-text">다운로드 (pdf 형식)</span>
        </button>

        <div className="test-result_report-content">
          <div className="test-result_report-summary">맞춤기업 TEST</div>

          <div className="pdf-preview-content">{renderReportContent()}</div>
        </div>

        {/* 페이지네이션 */}
        <div className="report-pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
};

export default CompanyTestResult;
