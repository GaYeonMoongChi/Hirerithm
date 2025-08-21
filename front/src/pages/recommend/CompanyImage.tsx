import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import debounce from "lodash.debounce";

import RecommendIcon from "@/assets/icon/RecommendIcon.svg";
import FileLogo from "@/assets/icon/FileLogo.svg";
import AiIcon from "@/assets/icon/AiIcon.svg";
import CheckIcon from "@/assets/icon/CheckIcon.svg";

import MemberNavigation from "@/components/MemberNavigation";
import "@/styles/corporateImage.css";

import type {
  CompanyName,
  SuggestionList,
  CompanyAutoCompleteResponse,
  CompanyKeywordResponse,
  CompanyResultState,
} from "@/types/companyImage";

const CompanyImage: React.FC = () => {
  const [companyName, setCompanyName] = useState<CompanyName>("");
  const [suggestions, setSuggestions] = useState<SuggestionList>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const address = import.meta.env.VITE_BACKEND_ADDRESS as string | undefined;

  // 기업 이미지 검색 요청 처리
  const handleSearch = async (): Promise<void> => {
    if (!companyName.trim()) return;
    if (!address) {
      alert(
        "서버 주소가 설정되지 않았습니다. .env의 VITE_BACKEND_ADDRESS를 확인하세요."
      );
      return;
    }
    setIsLoading(true);

    try {
      const res = await axios.get<CompanyKeywordResponse>(
        `${address}/company/${encodeURIComponent(companyName)}/keyword`
      );

      const state: CompanyResultState = {
        companyName,
        data: res.data,
      };

      navigate("/recommend_company/result", { state });
    } catch (err) {
      alert("기업 정보를 찾을 수 없습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = useCallback(
    async (prefix: string): Promise<void> => {
      if (!prefix.trim()) {
        setSuggestions([]);
        return;
      }
      if (!address) return;

      try {
        const res = await axios.get<CompanyAutoCompleteResponse>(
          `${address}/company/autosearch`,
          { params: { prefix } }
        );
        setSuggestions(res.data ?? []);
      } catch (err) {
        console.error("자동완성 오류:", err);
        setSuggestions([]);
      }
    },
    [address]
  );

  const debouncedFetch = useMemo(
    () => debounce(fetchSuggestions, 200),
    [fetchSuggestions]
  );

  useEffect(() => {
    // 언마운트 시 디바운스 취소
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCompanyName(value);
    debouncedFetch(value);
  };

  const handleSuggestionClick = (name: string) => {
    setCompanyName(name);
    setSuggestions([]);
  };

  return (
    <div className="image-recommend_wrapper">
      <MemberNavigation />

      <header>
        <div className="image-recommend_page-index-wrapper">
          <img src={FileLogo} alt="-" />
          <h2>기업 이미지 기반 추천</h2>
        </div>
        <p>
          기업 이미지 기반 후보자 추천 페이지입니다. 기업명을 입력해주세요! 각
          카테고리별 기업 이미지 점수를 열람할 수 있어요!
        </p>
      </header>

      <main>
        <img
          src={RecommendIcon}
          className="recommend-icon"
          alt="기업 이미지 기반 후보자 추천"
        />

        <div className="image-recommend_corporate-name-input-wrapper">
          <label>
            <img src={CheckIcon} alt="✔" /> 기업명
          </label>
          <input
            value={companyName}
            onChange={handleInputChange}
            placeholder="예) 네이버, 카카오, 토스"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="autocomplete-suggestions">
              {suggestions.map((company, index) => (
                <li key={index} onClick={() => handleSuggestionClick(company)}>
                  {company}
                </li>
              ))}
            </ul>
          )}
        </div>

        {isLoading ? (
          <div className="loading-indicator">
            기업 이미지에 맞는 후보자를 찾는 중입니다...
          </div>
        ) : (
          <button
            className="image-recommend_result-button"
            onClick={handleSearch}
          >
            <img src={AiIcon} className="ai-icon" alt="-" />
            <span>AI의 추천 결과 확인하기</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default CompanyImage;
