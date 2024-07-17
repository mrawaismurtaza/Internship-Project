import React from "react";
import "./LeftSide.css";
import ProfileSection from "../../Components/ProfileSection/ProfileSection";
import FollowList from "../../Components/FollowList/FollowList";

function LeftSide() {
  return (
    <div className="LeftSide overflow-hidden  shadow-lg p-3 bg-light rounded">
      <div className="ProfileSection">
        <ProfileSection />
      </div>
      <div className="Suggestions overflow-auto">
        <FollowList/>
      </div>
    </div>
  );
}

export default LeftSide;
