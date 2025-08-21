// @/pages/recommendResult/CorporateImageResult.tsx

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

import FileLogo from "@/assets/icon/FileLogo.svg";
import ArrowIcon from "@/assets/icon/ArrowIcon.svg";
import MemberNavigation from "@/components/MemberNavigation";
import "@/pages/recommendResult/companyResult.css";

import RecommandReport from "@/pages/recommendResult/components/CorporateImageReport";

// 타입
import type {
  CorporateImageLocationState,
  RawKeywordItem,
  CompanyCategoryScore,
  CandidateRow,
  ResultsSummaryItem,
} from "@/types/companyImageResult";

const CorporateImageResult = () => {
  // ✅ 라우터 state 타입 안전
  const location = useLocation() as unknown as {
    state?: CorporateImageLocationState;
  };
  const companyName = location.state?.companyName ?? "ooo";

  // ✅ Vite 환경변수 (요청하신 라인 그대로)
  const BACK_URL = import.meta.env.VITE_BACKEND_ADDRESS as string | undefined;

  const [isLoading, setIsLoading] = useState(true);

  // 영문 카테고리 → 한글 매핑
  const categoryMapping: Record<string, string> = {
    Teamculture: "조직문화",
    Evaluation: "공정한 평가, 성장지원",
    "Pay Level": "보상수준",
    "Vision & Direction": "비전 및 방향성",
    "Welfare Quality": "복지",
    Workload: "워라밸",
  };

  // 더미 (state 없을 때 fallback)
  const companyDummydata: RawKeywordItem[] = [
    { rank: "1", subject: "조직문화", score: 5.0 },
    { rank: "2", subject: "공정한 평가, 성장지원", score: 4.3 },
    { rank: "3", subject: "보상수준", score: 4.0 },
    { rank: "4", subject: "비전 및 방향성", score: 2.5 },
    { rank: "5", subject: "복지", score: 2.1 },
    { rank: "6", subject: "워라밸", score: 1.0 },
  ];

  const rawCompanyData: RawKeywordItem[] =
    location.state?.data?.keywordArray ?? companyDummydata;

  // 원본 → 한글 카테고리/표시용 구조로 매핑
  const mappedCompanyData: CompanyCategoryScore[] = useMemo(() => {
    return rawCompanyData.map((item) => {
      // category(영문)가 있으면 매핑, 없으면 subject 사용
      const display = item.category
        ? (categoryMapping[item.category] ?? item.category)
        : (item.subject ?? "");

      return {
        rank: item.rank,
        category: display,
        subject: item.subject,
        score: item.score,
        description: item.description,
        comments: item.comments ?? [],
      };
    });
  }, [rawCompanyData]);

  // 요약 테이블용(점수 내림차순)
  const mappedCompanySummary: CompanyCategoryScore[] = useMemo(
    () =>
      [...mappedCompanyData]
        .sort((a, b) => b.score - a.score)
        .map((item, index) => ({
          rank: index + 1,
          category: item.category,
          score: item.score,
        })),
    [mappedCompanyData]
  );

  // Top2 키워드
  const topTwoKeywords: CompanyCategoryScore[] = useMemo(
    () => [...mappedCompanyData].sort((a, b) => b.score - a.score).slice(0, 2),
    [mappedCompanyData]
  );

  // 추천 결과
  const [recommendResults, setRecommendResults] = useState<
    ResultsSummaryItem[]
  >([]);
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!BACK_URL) {
          // 백엔드 주소가 없으면 더미로 표시하고 종료
          setRecommendResults([
            {
              title: `${companyName} 직무 추천 결과`,
              author: "유니코서치 대리 김가연",
              keywords: "[ 추천 키워드 ]",
              candidates: [
                { rank: 1, info: "김철수 (29), 남", score: "5.0" },
                { rank: 2, info: "김민지 (27), 여", score: "4.9" },
                { rank: 3, info: "박희망 (30), 남", score: "4.0" },
                { rank: 4, info: "박찬희 (30), 남", score: "3.9" },
                { rank: 5, info: "최민서 (30), 여", score: "3.5" },
              ],
            },
          ]);
          return;
        }

        const res = await axios.get(
          `${BACK_URL}/recommendation/candidate/${companyName}`
        );

        // 백엔드 응답 스키마 예시 가정
        const formatted: CandidateRow[] = (res.data ?? []).map(
          (item: any, index: number) => {
            const resume = item?.resume ?? {};
            const age = resume?.age ?? "-";
            const gender = resume?.gender ?? "-";
            const name = resume?.name ?? `지원자 ${index + 1}`;
            const compatibilityScore =
              typeof item?.compatibilityScore === "number"
                ? String(item.compatibilityScore.toFixed(1))
                : String(item?.compatibilityScore ?? "-");

            return {
              rank: index + 1,
              info: `${name} (${age}), ${gender}`,
              score: compatibilityScore, // 문자열로 통일
            };
          }
        );

        setRecommendResults([
          {
            title: `${companyName} 직무 추천 결과`,
            author: "유니코서치 대리 김가연",
            keywords: "[ 추천 키워드 ]",
            candidates: formatted,
          },
        ]);
      } catch (error) {
        console.error("추천 결과 불러오기 실패:", error);
        // 실패 시에도 화면은 그려지도록 안전 처리
        setRecommendResults([
          {
            title: `${companyName} 직무 추천 결과`,
            author: "유니코서치 대리 김가연",
            keywords: "[ 추천 키워드 ]",
            candidates: [],
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [BACK_URL, companyName]);

  return (
    <div className="image-recommend-result_wrapper">
      {isLoading ? (
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <span className="loading-text">정보를 불러오는 중입니다...</span>
        </div>
      ) : (
        <>
          <MemberNavigation />

          <AnimatePresence mode="wait">
            {!showReport ? (
              <motion.div
                key="firstPage"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <header>
                  <div className="image-recommend-result_page-index-wrapper">
                    <img src={FileLogo} alt="파일 아이콘" />
                    <h2>
                      [ {companyName} ] 기업 이미지 점수 / 점수 기반 후보자 추천
                    </h2>
                  </div>
                </header>

                <div className="image-recommend-result_first-page">
                  <main>
                    <h3 className="image-recommend-result_graph-header">
                      이미지 카테고리별 점수
                    </h3>

                    <div className="result-graph-and-keyword">
                      <div className="image-recommend-result_graph">
                        <RadarChart
                          cx={200}
                          cy={150}
                          outerRadius={120}
                          width={450}
                          height={300}
                          data={mappedCompanyData}
                        >
                          <PolarGrid />
                          <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: "#1e1e1e", fontSize: 16 }}
                            tickMargin={100}
                          />
                          <PolarRadiusAxis
                            domain={[0, 5]}
                            tick={{ fontSize: 0 }}
                            axisLine={false}
                            tickCount={6}
                          />
                          <Radar
                            name="점수"
                            dataKey="score"
                            stroke="#008A34"
                            fill="#008A34"
                            fillOpacity={0.5}
                          />
                        </RadarChart>

                        <div className="image-recommend-result_top2">
                          <div className="keyword-result-title">
                            [{companyName} 기업] 이미지 키워드 Top 2를 뽑았어요!
                          </div>

                          <div className="image-recommend-result_keyword">
                            {topTwoKeywords.map((item, idx) => (
                              <div className="keyword-detail" key={idx}>
                                <span className="keyword">{item.category}</span>
                                <p>{item.description ?? "설명이 없습니다."}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="image-recommend-result_review">
                      <h3 className="image-recommend-result_graph-header">
                        실제 {companyName} 기업 직원 반응
                      </h3>

                      <ul className="review-list">
                        {topTwoKeywords.flatMap((item) =>
                          (item.comments ?? []).map((comment, i) => (
                            <li key={`${item.category}-${i}`}>
                              <span className="keyword">{item.category}</span>
                              <p>“{comment}”</p>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    <div className="image-recommend-result_score-header">
                      <h3>기업 이미지 전체 점수표</h3>
                      <div className="score-legend">
                        <div>
                          <span className="high-score"></span>
                          <span className="middle-score"></span>
                          <span className="low-score"></span>
                        </div>
                        <p>점수 (높음-보통-낮음) 순</p>
                      </div>
                    </div>

                    <div className="company-result-summary-tables">
                      <table className="image-recommend-result_score-table">
                        <tbody>
                          {mappedCompanyData.map((item, idx) => {
                            const score = item.score;
                            const category = item.category;
                            let levelClass = "";

                            if (score >= 4.0) levelClass = "high-score";
                            else if (score >= 2.5) levelClass = "middle-score";
                            else levelClass = "low-score";

                            return (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{category}</td>
                                <td>{score} 점</td>
                                <td>
                                  <span className={levelClass}></span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="image-recommend-result_score-header">
                      <h3>추천된 후보자 전체 점수표</h3>
                      <div className="score-legend">
                        <div>
                          <span className="high-score"></span>
                          <span className="middle-score"></span>
                          <span className="low-score"></span>
                        </div>
                        <p>점수 (높음-보통-낮음) 순</p>
                      </div>
                    </div>

                    <div className="company-result-summary-tables">
                      <table className="image-recommend-result_score-table">
                        <tbody>
                          {(recommendResults[0]?.candidates ?? []).map(
                            (item, idx) => {
                              const numericScore = Number(item.score);
                              const levelClass =
                                !isNaN(numericScore) && numericScore >= 4.0
                                  ? "high-score"
                                  : !isNaN(numericScore) && numericScore >= 2.5
                                    ? "middle-score"
                                    : "low-score";

                              return (
                                <tr key={idx}>
                                  <td>{item.rank}</td>
                                  <td>{item.info}</td>
                                  <td>{item.score} 점</td>
                                  <td>
                                    <span className={levelClass}></span>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>

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
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              >
                <RecommandReport
                  onBack={() => setShowReport(false)}
                  companySummary={mappedCompanySummary}
                  resultsSummary={recommendResults}
                  candidates={recommendResults[0]?.candidates ?? []}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default CorporateImageResult;
