import React, { useState, useEffect, useRef } from "react";
import ResumePlusIcon from "@/assets/icon/ResumePlusIcon.svg";
import "./css/resumeComponent.css";
import type { Skill } from "@/types/resume";

type Props = {
  initialData?: Skill[];
  onChange: (data: Skill[]) => void;
};

const Skills: React.FC<Props> = ({ initialData = [], onChange }) => {
  const [skills, setSkills] = useState<Skill[]>([]); // 빈 배열로 초기화
  const hasMounted = useRef(false); // 무한 루프 방지용

  // 최초 1회만 initialData 반영
  useEffect(() => {
    if (Array.isArray(initialData)) {
      setSkills(initialData);
    }
  }, []); // 빈 배열: mount 시 1회만 실행

  // skills가 바뀔 때만 onChange 호출
  useEffect(() => {
    if (hasMounted.current) {
      onChange(skills);
    } else {
      hasMounted.current = true;
    }
  }, [skills, onChange]);

  const handleChange = (index: number, value: string) => {
    const updated = [...skills];
    updated[index].skill = value;
    setSkills(updated);
  };

  const addSkill = () => {
    setSkills([...skills, { skill: "" }]);
  };

  return (
    <div className="resume-item">
      <div className="resume-item-container">
        {skills.map((item, index) => (
          <div className="resume-form-item" key={index}>
            <label>Stack</label>
            <input
              id={`skill-${index}`}
              type="text"
              placeholder="사용 가능한 기술스택 입력"
              value={item.skill}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={addSkill} className="plus-button">
          기술 추가 <img src={ResumePlusIcon} alt="➕" />
        </button>
      </div>
    </div>
  );
};

export default Skills;
