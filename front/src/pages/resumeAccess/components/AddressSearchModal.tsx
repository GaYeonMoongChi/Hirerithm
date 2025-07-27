import React from "react";
import DaumPostcode from "react-daum-postcode";
import type { Address } from "react-daum-postcode";
import LocationIcon from "@/assets/icon/LocationIcon.svg";
import "./css/addressSearchModal.css";
import "./css/resumeComponent.css";

type Props = {
  onComplete: (data: { address: string; zonecode: string } | null) => void;
};

const AddressSearchModal: React.FC<Props> = ({ onComplete }) => {
  const complete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname) extraAddress += data.bname;
      if (data.buildingName) {
        extraAddress += extraAddress
          ? `, ${data.buildingName}`
          : data.buildingName;
      }

      if (extraAddress) {
        fullAddress += ` (${extraAddress})`;
      }
    }

    onComplete({
      address: fullAddress,
      zonecode: data.zonecode,
    });
  };

  return (
    <div className="daum-post-background" onClick={() => onComplete(null)}>
      <div className="daum-post-container" onClick={(e) => e.stopPropagation()}>
        <div className="daum-post-header">
          <p>주소 검색</p>
          <img src={LocationIcon} alt="위치 아이콘" />
        </div>
        <DaumPostcode
          autoClose
          style={{ height: "500px", width: "100%" }}
          onComplete={complete}
        />
      </div>
    </div>
  );
};

export default AddressSearchModal;
