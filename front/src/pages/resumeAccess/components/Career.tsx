import React, { useState, useRef, useEffect } from "react";
import ResumePlusIcon from "@/assets/icon/ResumePlusIcon.svg";
// import DeleteIcon from "../../Image/Icon/DeleteIcon.svg";
import "./css/resumeComponent.css";
import type { CareerItem } from "@/types/resume";

interface CareerProps {
  initialData?: CareerItem[];
  onChange: (data: CareerItem[]) => void;
}

const Career: React.FC<CareerProps> = ({ initialData = [], onChange }) => {
  const [experiences, setExperiences] = useState<CareerItem[]>(initialData);
  const endRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (onChange) onChange(experiences);
  }, []);

  const updateExperiences = (updated: CareerItem[]) => {
    setExperiences(updated);
    if (onChange) onChange(updated);
  };

  const handleChange = (
    index: number,
    field: keyof CareerItem | "isCurrent",
    value: string
  ) => {
    const updated = [...experiences];

    if (field === "start_year" || field === "end_year") {
      value = value.replace(/[^0-9.]/g, "").slice(0, 7);
    }

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    if (updated[index].isCurrent) {
      updated[index].end_year = "";
    }

    updateExperiences(updated);

    if (field === "start_year" && /^\d{4}\.\d{1,2}$/.test(value)) {
      endRefs.current[index]?.focus();
    }
  };

  const handleCurrentToggle = (index: number, isCurrent: boolean) => {
    const updated = [...experiences];
    updated[index].isCurrent = isCurrent;
    if (isCurrent) {
      updated[index].end_year = "";
    }
    updateExperiences(updated);
  };

  const addExperience = () => {
    const updated: CareerItem[] = [
      ...experiences,
      {
        company: "",
        position: "",
        description: "",
        isCurrent: false,
        start_year: "",
        end_year: "",
      },
    ];
    updateExperiences(updated);
  };

  /*const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    endRefs.current.splice(index, 1);
    updateExperiences(updated);
  };*/

  return (
    <div className="resume-item">
      {experiences.map((exp, index) => (
        <div className="resume-item-container" key={index}>
          <div className="resume-form-item">
            <label>기업명</label>
            <input
              id={`company-${index}`}
              type="text"
              placeholder="기업명 입력"
              value={exp.company || ""}
              onChange={(e) => handleChange(index, "company", e.target.value)}
            />
          </div>

          <div className="resume-form-item">
            <label>직급</label>
            <input
              id={`position-${index}`}
              type="text"
              placeholder="직급 (직무내용) 입력"
              value={exp.position || ""}
              onChange={(e) => handleChange(index, "position", e.target.value)}
            />
          </div>

          <div className="resume-form-item">
            <label>입사연월</label>
            <input
              type="text"
              placeholder="6자리 입사 연,월 입력 (YYYYMM)"
              value={exp.start_year || ""}
              onChange={(e) =>
                handleChange(index, "start_year", e.target.value)
              }
            />
          </div>

          <div className="resume-form-item">
            <label>재직중 여부</label>
            <select
              value={
                exp.isCurrent === false
                  ? "퇴사"
                  : exp.isCurrent === true
                    ? "재직중"
                    : ""
              }
              onChange={(e) =>
                handleCurrentToggle(index, e.target.value === "재직중")
              }
            >
              <option disabled value="">
                클릭해서 재직중 여부 선택하기
              </option>
              <option value="재직중">재직중</option>
              <option value="퇴사">퇴사</option>
            </select>
          </div>

          {!exp.isCurrent && (
            <div className="resume-form-item">
              <label>퇴사연월</label>
              <input
                type="text"
                placeholder="6자리 퇴사 연,월 입력 (YYYYMM)"
                value={exp.end_year || ""}
                onChange={(e) =>
                  handleChange(index, "end_year", e.target.value)
                }
                ref={(el: HTMLInputElement | null) => {
                  endRefs.current[index] = el;
                }}
              />
            </div>
          )}

          <div className="resume-form-item">
            <label>업무내용 상세</label>
            <textarea
              placeholder="업무내용 상세 입력 (주요 프로젝트, 경험)"
              value={exp.description || ""}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
            />
          </div>
        </div>
      ))}

      <button onClick={addExperience} className="plus-button">
        경력 사항 추가 <img src={ResumePlusIcon} alt="➕" />
      </button>
    </div>
  );
};

export default Career;
