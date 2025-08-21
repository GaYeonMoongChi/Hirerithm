import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import FileLogo from "@/assets/icon/FileLogo.svg";
import ArrowIcon from "@/assets/icon/ArrowIcon.svg";
import MemberNavigation from "@/components/Navigation/MemberNavigation";
import StrengthCategoryReport from "@/features/recommend-strength/components/StrengthCategoryReport";

import "@/features/recommend-strength/styles/strengthResult.css";

import type {
  StrengthCategoryResultProps,
  CandidateViewModel,
  ResultsSummaryItem,
} from "@/types/strengthResult";

const StrengthCategoryResult: React.FC<StrengthCategoryResultProps> = ({
  recommendResult,
}) => {
  const [showReport, setShowReport] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [recommendResults, setRecommendResults] = useState<
    CandidateViewModel[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHasMounted(true);

    // 안전 가드
    const list = recommendResult?.recommendations ?? [];
    if (list.length > 0) {
      const formatted: CandidateViewModel[] = list
        .slice(0, 5)
        .map((item, i) => ({
          rank: i + 1,
          name: item.name,
          score: `${item.score} / 5.0`,
          reason: item.reason,
          resume_keywords: item.resume_keyword ?? [],
          recruiter_keywords: item.recruiter_keyword ?? [],
          recruiter_keyword_description:
            item.recruiter_keyword_description ?? {},
        }));

      setRecommendResults(formatted);
      setIsLoading(false);
    } else {
      // 데이터 없을 때도 로딩 종료
      setRecommendResults([]);
      setIsLoading(false);
    }
  }, [recommendResult]);

  // 추천 결과 요약
  const resultsSummary: ResultsSummaryItem[] =
    recommendResults.length > 0
      ? [
          {
            title: "추천 결과",
            author: "하이어리즘 대표 김가연",
            keywords: recommendResults[0].recruiter_keywords
              ?.map((k) => `[ ${k} ]`)
              .join(" "),
            candidates: recommendResults.map((item) => ({
              rank: item.rank,
              info: item.name || `지원자 ${item.rank}`,
              score: item.score,
            })),
          },
        ]
      : [];

  return (
    <div className="strength-category-result_wrapper">
      {/* 네비게이션 */}
      <MemberNavigation />

      <AnimatePresence mode="wait">
        {!showReport ? (
          <motion.div
            key="firstPage"
            {...(hasMounted && {
              initial: { opacity: 0, x: 50 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -50 },
              transition: { duration: 0.4 },
            })}
          >
            <header>
              <div className="strength-category-result_page-index-wrapper">
                <img src={FileLogo} alt="-" />
                <h2>추출된 강점 키워드 / 강점 기반 후보자 추천</h2>
              </div>
            </header>

            <div className="strength-category-result_first-page">
              <main>
                <h3 className="strength-category-result_strength-box-header">
                  추출된 강점 키워드
                </h3>

                <div className="strength-category-result_wrapper2">
                  <div className="strength-category-result_keyword-wrapper">
                    <div className="keyword-result-title">
                      입력하신 글에서 추출된 강점 키워드들이에요!
                    </div>

                    {isLoading ? (
                      <div className="loading-wrapper">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">
                          정보를 불러오는 중입니다...
                        </span>
                      </div>
                    ) : (
                      <div className="strength-category-result__keyword">
                        {recommendResults[0]?.recruiter_keywords?.map(
                          (keyword, i) => (
                            <div className="keyword-detail" key={i}>
                              <span className="keyword">{keyword}</span>
                              <p>
                                {
                                  recommendResults[0]
                                    ?.recruiter_keyword_description?.[keyword]
                                }
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="strength-category-result_score-header">
                  <h3>추출된 강점 키워드 기반 추천 인재 Top 5</h3>
                </div>

                {isLoading ? (
                  <div className="loading-wrapper">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">
                      정보를 불러오는 중입니다...
                    </span>
                  </div>
                ) : (
                  <ol className="strength-category-result_score-list">
                    {recommendResults.map((item) => (
                      <li key={item.rank} className="score-list-item">
                        <strong>
                          {item.name} ({item.score} 점)
                        </strong>
                        <ul>
                          <li>
                            {item.resume_keywords?.map((k, i) => (
                              <span key={i}>{k}</span>
                            ))}
                          </li>
                          <li>{item.reason}</li>
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}

                <button
                  className="image-recommend-result_job-seeker-button"
                  onClick={() => setShowReport(true)}
                >
                  <img src={ArrowIcon} alt="➜" />
                  <span>추천 결과 보고서 열람</span>
                </button>
              </main>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="reportPage"
            {...(hasMounted && {
              initial: { opacity: 0, x: -50 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 50 },
              transition: { duration: 0.4 },
            })}
          >
            <StrengthCategoryReport
              onBack={() => setShowReport(false)}
              resultsSummary={resultsSummary}
              candidates={recommendResults}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StrengthCategoryResult;
