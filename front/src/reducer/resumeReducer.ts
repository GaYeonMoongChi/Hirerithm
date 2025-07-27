import type { ResumeState } from "@/types/resume";

// 초기 상태
export const initialResumeState: ResumeState = {
  personalData: {
    name: "",
    birth_date: "",
    gender: "",
    address: "",
    phone: "",
    current_salary: "",
    desired_salary: "",
  },
  education: [],
  career: [],
  certificates: [],
  skills: [],
  otherinfo: {
    otherinfo: "",
  },
  companyTest: null,
};

// 액션 타입 정의 (선택적)
export type ResumeAction =
  | { type: "SET_PERSONAL"; payload: ResumeState["personalData"] }
  | { type: "SET_EDUCATION"; payload: ResumeState["education"] }
  | { type: "SET_CAREER"; payload: ResumeState["career"] }
  | { type: "SET_CERTIFICATES"; payload: ResumeState["certificates"] }
  | { type: "SET_SKILLS"; payload: ResumeState["skills"] }
  | { type: "SET_OTHERINFO"; payload: ResumeState["otherinfo"] }
  | { type: "SET_COMPANYTEST"; payload: ResumeState["companyTest"] };

// 리듀서 함수
export function resumeReducer(
  state: ResumeState,
  action: ResumeAction
): ResumeState {
  console.log("📦 Reducer 실행:", {
    type: action.type,
    payload: action.payload,
    nextState: {
      ...state,
      [action.type.replace("SET_", "").toLowerCase()]: action.payload,
    },
  });

  switch (action.type) {
    case "SET_PERSONAL":
      return { ...state, personalData: action.payload };
    case "SET_EDUCATION":
      return { ...state, education: action.payload };
    case "SET_CAREER":
      return { ...state, career: action.payload };
    case "SET_CERTIFICATES":
      return { ...state, certificates: action.payload };
    case "SET_SKILLS":
      return { ...state, skills: action.payload };
    case "SET_OTHERINFO":
      return { ...state, otherinfo: action.payload };
    case "SET_COMPANYTEST":
      return { ...state, companyTest: action.payload };
    default:
      return state;
  }
}
