import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./ProfileSection.css";
import Logo from "../../Images/Social Web App Logo.jpeg";
import userIcon from "../../Images/usericon.png";
import axios from 'axios';

const API_BASE = "http://localhost:4002/";

function ProfileSection({ followers, following }) {
  const { userId } = useParams();
  const [username, setUsername] = useState('');

  const fetchUserData = async (userId) => {
    try {
      const responseProfile = await axios.get(`${API_BASE}user/${userId}`, {
        headers: { "Content-Type": "application/json" }
      });

      if (responseProfile.status === 200) {
        setUsername(responseProfile.data.username);
      } else {
        console.error("Failed to fetch user profile data");
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  return (
    <div className="ProfileSection">
      <div className="LogoSearch">
        <img src={Logo} alt="" />
        <input type="text" />
        <i className="fas fa-search fa-2x"></i>
      </div>
      <div className="ProfileImage">
        <img src={userIcon} alt="" />
        <p>{username}</p>
      </div>
      <div className="Count">
        <div className="Followers">
          <p>{followers}</p>
          <p>Followers</p>
        </div>
        <div className="Following">
          <p>{following}</p>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
