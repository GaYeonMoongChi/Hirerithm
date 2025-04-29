// localhost:3000/user

import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./styles/PersonalMain.css";
import NotMemberNavigation from "../../Component/Navigation/NotMemberNavigation";
import ResumeRegistrationIcon from "../../Image/Icon/ResumeRegistrationIcon.svg";
import BannerImage from "../../Image/Mainbanner/BannerImage.png";
import UpAnimation from "../../Image/Icon/UpAnimation.svg";
import DownAnimation from "../../Image/Icon/DownAnimation.svg";

function PersonalMain() {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  const buttonSectionRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 네비게이션 바 표시될때는 배너 화살표 버튼을 더 위에 배치
  const [isTop, setIsTop] = useState(true);

  const downButtonRef = useRef(null);
  const upButtonRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  const triggerClickAnimation = (ref) => {
    if (!ref.current) return;
    ref.current.classList.add("clicked-animation");
    setTimeout(() => {
      ref.current.classList.remove("clicked-animation");
    }, 600); // 애니메이션 길이
  };

  useEffect(() => {
    const handleScroll = () => {
      const bannerTop = bannerRef.current?.getBoundingClientRect().top ?? 0;
      const buttonTop =
        buttonSectionRef.current?.getBoundingClientRect().top ?? 0;

      setIsTop(window.scrollY < 50);

      // ↓ 버튼 애니메이션 + 자동 스크롤
      if (
        buttonTop < window.innerHeight / 2 &&
        buttonTop > -200 &&
        !isAutoScrolling
      ) {
        triggerClickAnimation(downButtonRef);
        setIsAutoScrolling(true);
        scrollToSection(buttonSectionRef);
        setTimeout(() => setIsAutoScrolling(false), 1000);
      }

      // ↑ 버튼 애니메이션 + 자동 스크롤
      if (
        bannerTop < window.innerHeight / 2 &&
        bannerTop > -200 &&
        !isAutoScrolling
      ) {
        triggerClickAnimation(upButtonRef);
        setIsAutoScrolling(true);
        scrollToSection(bannerRef);
        setTimeout(() => setIsAutoScrolling(false), 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="personal-main_container">
      {/* 네비게이션바 */}
      <NotMemberNavigation />

      {/* 배너 이미지 */}
      <motion.div
        ref={bannerRef}
        className="banner"
        style={{ backgroundImage: `url(${BannerImage})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 배너 하단 버튼 */}
        <div className={`banner-button-wrapper ${isTop ? "tight" : ""}`}>
          <button
            ref={downButtonRef}
            className="scroll-button"
            onClick={() => scrollToSection(buttonSectionRef)}
          >
            <motion.img
              src={DownAnimation}
              alt="↓ 이력서 등록하러 가기"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </button>
        </div>
      </motion.div>

      {/* 이력서 등록 / 맞춤기업 테스트 이동 버튼 */}
      <div ref={buttonSectionRef} className="button-section">
        {/* 상단으로 돌아가는 버튼 */}
        <div className="section-top-button-wrapper">
          <button
            ref={upButtonRef}
            className="scroll-button"
            onClick={() => scrollToSection(bannerRef)}
          >
            <motion.img
              src={UpAnimation}
              alt="↑ 배너로 돌아가기"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </button>
        </div>

        <div className="button-wrapper">
          <button
            className="resume-button"
            onClick={() => {
              console.log("이력서 버튼 클릭됨");
              navigate("/resume_registration");
            }}
          >
            <img src={ResumeRegistrationIcon} alt="📄" />
            <p>이력서 등록하러 가기</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PersonalMain;
