import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import "./ProfileSection.css";
import Logo from "../../Images/Social Web App Logo.jpeg";
import searchIcon from "../../Images/SearchIcon.png";
import userIcon from "../../Images/usericon.png";

const API_BASE = "http://localhost:4002/";

function ProfileSection() {
    const location = useLocation();
    const { userId } = location.state || {};

    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch followers count
                const responseFollowers = await fetch(`${API_BASE}users/${userId}/followers`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (responseFollowers.ok) {
                    const { count } = await responseFollowers.json();
                    setFollowers(count);
                } else {
                    console.error("Failed to fetch followers count");
                }

                // Fetch following count
                const responseFollowing = await fetch(`${API_BASE}users/${userId}/following`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (responseFollowing.ok) {
                    const { count } = await responseFollowing.json();
                    setFollowing(count);
                } else {
                    console.error("Failed to fetch following count");
                }

                // Fetch user profile data
                const responseProfile = await fetch(`${API_BASE}users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                     }
                });

                if (responseProfile.ok) {
                    const { username } = await responseProfile.json();
                    setUsername(username);
                } else {
                    console.error("Failed to fetch user profile data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]); // Adding userId as a dependency to useEffect

    return (
        <div className="ProfileSection">
            <div className="LogoSearch">
                <img src={Logo} alt="" />
                <input type="text" />
                <img src={searchIcon} alt="" />
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
