import React from "react";
import "./LeftSide.css";
import ProfileSection from "../../Components/ProfileSection/ProfileSection";

function LeftSide() {
  return (
    <div className="LeftSide">
      <div className="ProfileSection">
        <ProfileSection />
      </div>
      <div className="Suggestions">
        Suggestions
      </div>
    </div>
  );
}

export default LeftSide;
