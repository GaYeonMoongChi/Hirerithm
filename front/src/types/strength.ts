/** 강점 추천 API 요청 페이로드 */
export interface StrengthRecommendPayload {
  /** 필수 조건(필수 입력) */
  required: string;
  /** 우대 사항(선택) */
  preferred?: string;
  /** 기타(선택) */
  etc?: string;
}

/** 추천 결과 아이템 (서버 snake_case 기준) */
export interface RecommendedItem {
  resume_id: string;
  name: string;
  score: number;
}

/** 추천 결과 응답 */
export interface RecommendResultType {
  recommended: RecommendedItem[];
}

/** 페이지/컴포넌트에서 사용하는 props
 *  - props도 types 폴더에 모으는 팀 컨벤션을 따른 버전
 */
export interface StrengthRecommendProps {
  setRecommendResult: (result: RecommendResultType) => void;
}
