export type CompanyName = string;

export type Suggestion = string;
export type SuggestionList = Suggestion[];

// 자동완성 응답
export type CompanyAutoCompleteResponse = SuggestionList;

// 키워드/결과 응답 (우선 unknown으로 두고, 확인되면 구체화)
export type CompanyKeywordResponse = unknown;

// 라우팅 state로 넘길 때 사용
export interface CompanyResultState {
  companyName: CompanyName;
  data: CompanyKeywordResponse;
}
