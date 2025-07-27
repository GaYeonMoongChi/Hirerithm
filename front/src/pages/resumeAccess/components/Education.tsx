import React, { useState, useEffect } from "react";
import ResumePlusIcon from "@/assets/icon/ResumePlusIcon.svg";
import "./css/resumeComponent.css";
import type { EducationItem } from "@/types/resume";

interface EducationProps {
  initialData?: EducationItem[];
  onChange: (data: EducationItem[]) => void;
}

const Education: React.FC<EducationProps> = ({
  initialData = [],
  onChange,
}) => {
  const [educations, setEducations] = useState<EducationItem[]>(initialData);

  const handleChange = (
    index: number,
    field: keyof EducationItem,
    value: string | boolean
  ) => {
    const updated = [...educations];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setEducations(updated);
  };

  const addEducation = () => {
    setEducations([
      ...educations,
      {
        school_name: "",
        major: "",
        graduation_status: "",
        degree: "",
        exam_passed: false,
      },
    ]);
  };

  useEffect(() => {
    onChange(educations);
  }, [educations]);

  return (
    <div className="resume-item">
      {educations.map((edu, index) => (
        <div className="resume-item-container" key={index}>
          <div className="resume-form-edu">
            <label>학력사항</label>
            <select
              value={edu.degree}
              onChange={(e) => handleChange(index, "degree", e.target.value)}
            >
              <option disabled value="">
                클릭해 학력 선택
              </option>
              <option value="대학교(4년 이상)">대학교(4년 이상)</option>
              <option value="대학교(2,3년)">대학교(2,3년)</option>
              <option value="대학원(석사)">대학원(석사)</option>
              <option value="대학원(박사)">대학원(박사)</option>
              <option value="고등학교">고등학교</option>
              <option value="중학교">중학교</option>
              <option value="초등학교">초등학교</option>
            </select>
          </div>

          {[
            "대학교(4년 이상)",
            "대학원(석사)",
            "대학원(박사)",
            "대학교(2,3년)",
          ].includes(edu.degree) && (
            <>
              <div className="resume-form-item">
                <label>학교명</label>
                <input
                  type="text"
                  value={edu.school_name}
                  onChange={(e) =>
                    handleChange(index, "school_name", e.target.value)
                  }
                  placeholder="학교명 입력"
                />
              </div>

              <div className="resume-form-gra_sta">
                <label>졸업 상태</label>
                <select
                  value={edu.graduation_status}
                  onChange={(e) =>
                    handleChange(index, "graduation_status", e.target.value)
                  }
                >
                  <option disabled value="">
                    클릭해 졸업 상태 선택
                  </option>
                  <option value="졸업">졸업</option>
                  <option value="재학">재학</option>
                  <option value="수료">수료</option>
                  <option value="중퇴">중퇴</option>
                </select>
              </div>

              <div className="resume-form-item">
                <label>전공명</label>
                <input
                  type="text"
                  value={edu.major}
                  onChange={(e) => handleChange(index, "major", e.target.value)}
                  placeholder="전공명 입력"
                />
              </div>
            </>
          )}

          {["초등학교", "중학교", "고등학교"].includes(edu.degree) && (
            <>
              <div className="resume-form-checkbox">
                <label className="checkbox-label">
                  {edu.degree === "초등학교" && "초입 검정고시"}
                  {edu.degree === "중학교" && "중입 검정고시"}
                  {edu.degree === "고등학교" && "고입 검정고시"}
                  <input
                    type="checkbox"
                    className="exam-checkbox"
                    checked={edu.exam_passed}
                    onChange={(e) =>
                      handleChange(index, "exam_passed", e.target.checked)
                    }
                  />
                </label>
              </div>

              {!edu.exam_passed && (
                <div className="resume-form-item">
                  <label>학교명</label>
                  <input
                    type="text"
                    value={edu.school_name}
                    onChange={(e) =>
                      handleChange(index, "school_name", e.target.value)
                    }
                    placeholder="학교명을 입력하세요"
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}

      <button onClick={addEducation} className="plus-button">
        학력 사항 추가 <img src={ResumePlusIcon} alt="➕" />
      </button>
    </div>
  );
};

export default Education;
