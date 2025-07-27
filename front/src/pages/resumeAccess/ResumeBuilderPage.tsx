import React, { useReducer, useEffect } from "react";
import Resume from "./Resume";
import { resumeReducer, initialResumeState } from "@/reducer/resumeReducer";
import type { ResumeAction } from "@/reducer/resumeReducer";
import type { ResumeState } from "@/types/resume";

const ResumeBuilderPage: React.FC = () => {
  // localStorage에서 초기 resume 데이터를 불러와서 초기 상태 생성
  const saved = localStorage.getItem("resumeData");
  const parsedState: ResumeState = saved
    ? { ...initialResumeState, ...JSON.parse(saved) }
    : initialResumeState;

  // useReducer 초기화
  const [resumeState, dispatch] = useReducer<
    React.Reducer<ResumeState, ResumeAction>
  >(resumeReducer, parsedState);

  // 상태가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeState));
  }, [resumeState]);

  return <Resume resumeData={resumeState} dispatch={dispatch} />;
};

export default ResumeBuilderPage;
