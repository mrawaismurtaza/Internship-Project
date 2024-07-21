import React, { useState, useEffect } from "react";
import "./LeftSide.css";
import ProfileSection from "../../Components/ProfileSection/ProfileSection";
import FollowList from "../../Components/FollowList/FollowList";
import axios from "axios";
import { useParams } from "react-router-dom";

const API_BASE = "http://localhost:4002/";

function LeftSide() {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const { userId } = useParams();

  const fetchCounts = async () => {
    try {
      const responseFollowers = await axios.get(`${API_BASE}users/${userId}/followers`, {
        headers: { "Content-Type": "application/json" }
      });
      const responseFollowing = await axios.get(`${API_BASE}users/${userId}/following`, {
        headers: { "Content-Type": "application/json" }
      });

      if (responseFollowers.status === 200 && responseFollowing.status === 200) {
        setFollowers(responseFollowers.data.count);
        setFollowing(responseFollowing.data.count);
      } else {
        console.error("Failed to fetch followers or following counts");
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCounts();
    }
  }, [userId]);

  return (
    <div className="LeftSide overflow-hidden shadow-lg p-3 bg-light rounded">
      <div className="ProfileSection">
        <ProfileSection followers={followers} following={following} />
      </div>
      <div className="Suggestions overflow-auto">
        <FollowList onUpdate={fetchCounts} />
      </div>
    </div>
  );
}

export default LeftSide;
