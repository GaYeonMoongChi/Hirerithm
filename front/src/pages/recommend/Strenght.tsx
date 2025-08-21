// Strength.tsx (페이지/컴포넌트)

import { useState, type FC } from "react";
import axios from "axios";
import RecommendIcon from "@/assets/icon/RecommendIcon.svg";
import FileLogo from "@/assets/icon/FileLogo.svg";
import AiIcon from "@/assets/icon/AiIcon.svg";
import MemberNavigation from "@/components/MemberNavigation";
import "@/pages/recommend/strength.css";

import { useNavigate } from "react-router-dom";
import CheckIcon from "@/Image/Icon/CheckIcon.svg";

import type {
  RecommendResultType,
  StrengthRecommendProps,
  StrengthRecommendPayload,
} from "@/types/strength";

const Strength: FC<StrengthRecommendProps> = ({ setRecommendResult }) => {
  const navigate = useNavigate();

  const [required, setRequired] = useState("");
  const [preferred, setPreferred] = useState("");
  const [etc, setEtc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const address = import.meta.env.VITE_BACKEND_ADDRESS as string | undefined;

  const handleSubmit = async () => {
    if (!required.trim()) {
      alert("'요구사항' 항목은 필수항목입니다!");
      return;
    }
    if (!address) {
      alert("백엔드 주소가 설정되지 않았습니다. 환경변수를 확인하세요.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: StrengthRecommendPayload = {
        required,
        preferred: preferred || undefined,
        etc: etc || undefined,
      };

      const res = await axios.post<RecommendResultType>(
        `${address}/recommendation/candidate`,
        payload
      );

      setRecommendResult(res.data);
      navigate("/recommend_strength/result");
    } catch (error) {
      console.error("데이터 전송 에러:", error);
      alert("서버 통신 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="strength-category_wrapper">
      <MemberNavigation />

      <header>
        <div className="strength-category_page-index-wrapper">
          <img src={FileLogo} alt="" aria-hidden />
          <h2>강점 기반 추천</h2>
        </div>
        <p>
          강점 기반 후보자 추천 페이지입니다. 필수조건과 우대사항을 자유로운
          형식으로 작성하고, 원하는 인재를 찾아보세요!
        </p>
      </header>

      <main>
        <img
          src={RecommendIcon}
          className="recommend-icon"
          alt="강점 기반 후보자 추천"
        />

        <ul className="strength-category_textarea-wrapper">
          <li>
            <label>
              <img src={CheckIcon} alt="" aria-hidden /> 필수 SKILLS &amp; 조건
            </label>
            <textarea
              value={required}
              onChange={(e) => setRequired(e.target.value)}
              placeholder={`예) - React, Node.js 등 웹 개발 프레임워크 활용 경험
- Git 등 형상 관리 도구 사용 가능
- RESTful API 설계 및 연동 경험
- 기본적인 DB 설계 및 쿼리 작성 능력`}
              rows={4}
              cols={50}
            />
          </li>
          <li>
            <label>
              <img src={CheckIcon} alt="" aria-hidden /> 우대사항
            </label>
            <textarea
              value={preferred}
              onChange={(e) => setPreferred(e.target.value)}
              placeholder={`예) - TypeScript 사용 경험
- 클라우드(AWS, GCP 등) 환경에서의 개발 경험
- CI/CD 파이프라인 구축 경험
- 오픈소스 프로젝트 참여 경험`}
              rows={5}
              cols={50}
            />
          </li>
          <li>
            <label>
              <img src={CheckIcon} alt="" aria-hidden /> 기타
            </label>
            <textarea
              value={etc}
              onChange={(e) => setEtc(e.target.value)}
              placeholder="자유롭게 작성해주세요."
              rows={5}
              cols={50}
            />
          </li>
        </ul>

        <button
          className="strength-category_result-button"
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner" />
              <span>강점 키워드를 뽑는 중이에요.</span>
            </>
          ) : (
            <>
              <img src={AiIcon} className="ai-icon" alt="" aria-hidden />
              <span>추출된 강점 키워드 확인하기</span>
            </>
          )}
        </button>
      </main>
    </div>
  );
};

export default Strength;
