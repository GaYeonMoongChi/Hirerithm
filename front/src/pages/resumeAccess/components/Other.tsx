import React, { useState, useEffect, useRef } from "react";
import ResumePlusIcon from "@/assets/icon/ResumePlusIcon.svg";
import "./css/resumeComponent.css";
import type { OtherInfoItem, OtherInfoValue } from "@/types/resume";

interface OtherProps {
  initialData?: OtherInfoValue;
  onChange: (data: OtherInfoValue) => void;
}

const Other: React.FC<OtherProps> = ({
  initialData = { otherinfo: "[]" },
  onChange,
}) => {
  // 초기값 파싱
  const parsedNotes: OtherInfoItem[] = (() => {
    try {
      const parsed = JSON.parse(initialData.otherinfo);
      if (Array.isArray(parsed)) {
        return parsed.map((note) => ({ note }));
      }
    } catch {
      // 파싱 실패 시 빈 항목 제공
    }
    return [{ note: "" }];
  })();

  const [otherItems, setOtherItems] = useState<OtherInfoItem[]>(parsedNotes);
  const hasMounted = useRef(false); // 최초 마운트 감지용

  useEffect(() => {
    if (hasMounted.current) {
      const validNotes = otherItems
        .map((item) => item.note.trim())
        .filter((note) => note !== "");
      onChange({ otherinfo: JSON.stringify(validNotes) });
    } else {
      hasMounted.current = true;
    }
  }, [otherItems, onChange]);

  const handleChange = (index: number, value: string) => {
    const updated = [...otherItems];
    updated[index].note = value;
    setOtherItems(updated);
  };

  const addOther = () => {
    setOtherItems([...otherItems, { note: "" }]);
  };

  return (
    <div className="resume-item">
      <div className="resume-item-container">
        {otherItems.map((item, index) => (
          <div className="resume-form-item" key={index}>
            <textarea
              id={`other-${index}`}
              placeholder="기타사항 입력 (예: 병역사항, 건강상태 등)"
              value={item.note}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}

        <button onClick={addOther} className="plus-button">
          기타 사항 추가 <img src={ResumePlusIcon} alt="➕" />
        </button>
      </div>
    </div>
  );
};

export default Other;
