import React, { useState, useEffect, useRef } from "react";
import AddressSearchModal from "./AddressSearchModal";
import LocationIcon from "@/assets/icon/LocationIcon.svg";
import "./css/resumeComponent.css";
import type { PersonalData } from "@/types/resume";

type ResumePersonalDataProps = {
  initialData: PersonalData;
  onChange: (data: PersonalData) => void;
};

const ResumePersonalData: React.FC<ResumePersonalDataProps> = ({
  initialData,
  onChange,
}) => {
  const [name, setName] = useState(initialData.name);
  const [birthDate, setBirthDate] = useState(initialData.birth_date);
  const [gender, setGender] = useState(initialData.gender);
  const [address, setAddress] = useState(initialData.address);
  const [phone, setPhone] = useState(initialData.phone);
  const [currentSalary, setCurrentSalary] = useState(
    initialData.current_salary
  );
  const [desiredSalary, setDesiredSalary] = useState(
    initialData.desired_salary
  );
  const [isOpen, setIsOpen] = useState(false);

  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      onChange({
        name,
        birth_date: birthDate,
        gender,
        address,
        phone,
        current_salary: currentSalary,
        desired_salary: desiredSalary,
      });
    } else {
      hasMounted.current = true;
    }
  }, [name, birthDate, gender, address, phone, currentSalary, desiredSalary]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNums = e.target.value.replace(/[^0-9]/g, "");
    if (onlyNums.length <= 11) {
      setPhone(e.target.value);
    }
  };

  const handleAddressComplete = (
    data: { address: string; zonecode: string } | null
  ) => {
    if (data) {
      setAddress(data.address);
    }
    setIsOpen(false);
  };

  return (
    <div className="resume-item">
      <div className="resume-item-container">
        <div className="resume-form-item">
          <label>
            성명<strong>*</strong>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 입력"
          />
        </div>

        <div className="resume-form-item">
          <label>
            출생<strong>*</strong>
          </label>
          <input
            type="text"
            placeholder="8자리 생년월일 입력"
            className="birth-input"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            maxLength={8}
          />
        </div>

        <div className="resume-form-item">
          <label>
            성별<strong>*</strong>
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option disabled value="">
              클릭해 성별 선택
            </option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="resume-form-item">
          <label>
            주소<strong>*</strong>
          </label>
          <div className="adress-input">
            <input
              value={address}
              onClick={() => setIsOpen(true)}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="주소 입력"
            />
            <button type="button" onClick={() => setIsOpen(true)}>
              <img src={LocationIcon} alt="위치검색" />
            </button>
          </div>
          {isOpen && <AddressSearchModal onComplete={handleAddressComplete} />}
        </div>

        <div className="resume-form-item">
          <label>
            연락처<strong>*</strong>
          </label>
          <input
            type="text"
            onChange={handlePhoneChange}
            value={phone}
            placeholder="' - ' (하이픈) 제외 입력"
            maxLength={13}
          />
        </div>

        <div className="resume-form-item">
          <label>
            연봉정보<strong>*</strong>
          </label>
          <div>
            <input
              type="number"
              placeholder="현재 연봉"
              value={currentSalary}
              onChange={(e) =>
                setCurrentSalary(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <span className="won">만원</span>
            /
            <input
              type="number"
              placeholder="희망 연봉"
              value={desiredSalary}
              onChange={(e) =>
                setDesiredSalary(e.target.value.replace(/[^0-9]/g, ""))
              }
            />
            <span className="won">만원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePersonalData;
