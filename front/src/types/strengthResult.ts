// 추천 항목
export interface RecommendationItem {
  name: string;
  score: number; // 0~5.0 가정
  reason: string;
  resume_keyword: string[];
  recruiter_keyword: string[];
  recruiter_keyword_description: Record<string, string>;
}

// recommendResult prop 전체
export interface RecommendResult {
  recommendations: RecommendationItem[];
}

// 컴포넌트에서 가공해서 쓰는 항목
export interface CandidateViewModel {
  rank: number;
  name: string;
  score: string; // "4.7 / 5.0" 처럼 포맷된 문자열
  reason: string;
  resume_keywords: string[];
  recruiter_keywords: string[];
  recruiter_keyword_description: Record<string, string>;
}

// 보고서(자식 컴포넌트에 전달)용 요약
export interface ResultsSummaryItem {
  title: string;
  author: string;
  keywords?: string;
  candidates: Array<{
    rank: number;
    info: string;
    score: string;
  }>;
}

// StrengthCategoryResult props
export interface StrengthCategoryResultProps {
  recommendResult?: RecommendResult | null;
}
