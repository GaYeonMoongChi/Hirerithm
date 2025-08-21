// 레이더 차트/테이블에 공통으로 쓰는 카테고리 점수
export interface CompanyCategoryScore {
  rank?: string | number; // 정렬 후 표시용(선택)
  category: string; // 한글 카테고리명
  subject?: string; // 원본 subject (옵션)
  score: number; // 0 ~ 5.0
  description?: string; // 키워드 설명(옵션)
  comments?: string[]; // 실제 직원 반응(옵션)
}

// 라우터 state로 들어오는 원본 아이템
export interface RawKeywordItem {
  rank?: string | number;
  subject?: string; // 영문/영문표기 등
  category?: string; // 영문 카테고리(예: 'Teamculture')
  score: number;
  description?: string;
  comments?: string[];
}

// 추천 테이블용 후보자 행
export interface CandidateRow {
  rank: number;
  info: string; // "김철수 (29), 남"
  score: string; // "4.7" 같은 문자열
}

// 보고서/요약 블록
export interface ResultsSummaryItem {
  title: string;
  author: string;
  keywords: string; // "[ 키워드 ]" 식 포맷 문자열
  candidates: CandidateRow[];
}

// 페이지 컴포넌트 prop/state 타입
export interface CorporateImageLocationState {
  companyName?: string;
  data?: { keywordArray?: RawKeywordItem[] };
}
