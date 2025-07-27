import { BrowserRouter, Routes, Route } from "react-router-dom";

// 메인 페이지
import PersonalMain from "@/pages/main/PersonalMain";
import CorporateMain from "@/pages/main/CorporateMain";
import HeadhunterMain from "@/pages/main/HeadhunterMain";

// 인증 페이지
import LoginPage from "@/pages/auth/Login";
import SignupPage from "@/pages/auth/Signup";
import FindIdPage from "@/pages/auth/FindId";
import FindPasswordPage from "@/pages/auth/ResetPassword";

// 추천 관련 페이지
// import CorporateImage from "@/pages/browse/CorporateImage";
// import StrengthRecommend from "@/pages/browse/StrengthRecommend";
// import CorporateImageResult from "@/pages/browse/CorporateImageResult";
// import StrengthResult from "@/pages/browse/StrengthResult";

// 기타 페이지
import ResumePage from "@/pages/resumeAccess/ResumeBuilderPage";
import FullViewMainPage from "@/pages/browse/Browse";
// import MyPage from "@/pages/MyPage";

// import { useState } from "react";

function App() {
  // const [recommendResult, setRecommendResult] = useState<unknown>(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* 메인페이지 */}
        <Route path="/user" element={<PersonalMain />} />
        <Route path="/" element={<CorporateMain />} />
        <Route path="/headhunter" element={<HeadhunterMain />} />

        {/* 로그인 & 회원가입 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find_id" element={<FindIdPage />} />
        <Route path="/find_password" element={<FindPasswordPage />} />

        {/* 추천 */}
        {/*
        <Route path="/recommend_company" element={<CorporateImage />} />
        <Route
          path="/recommend_strength"
          element={
            <StrengthRecommend setRecommendResult={setRecommendResult} />
          }
        />
         */}

        {/* 추천 결과 */}
        {/*
        <Route
          path="/recommend_company/result"
          element={<CorporateImageResult />}
        />
        <Route
          path="/recommend_strength/result"
          element={<StrengthResult recommendResult={recommendResult} />}
        />
        */}

        {/* 이력서 등록 */}
        <Route path="/user/resume" element={<ResumePage />} />

        {/* 전체 DB 조회 */}
        <Route path="/full_view" element={<FullViewMainPage />} />

        {/* 마이페이지 
        <Route path="/MyPage" element={<MyPage />} />*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
