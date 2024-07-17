import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./ProfileSection.css";
import Logo from "../../Images/Social Web App Logo.jpeg";
import userIcon from "../../Images/usericon.png";
import axios from 'axios';

const API_BASE = "http://localhost:4002/";

function ProfileSection() {
    const { userId } = useParams();

    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [username, setUsername] = useState('');

    const fetchUserData = async (userId) => {
        // Fetch followers count
        const responseFollowers = await axios.get(`${API_BASE}users/${userId}/followers`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (responseFollowers.status === 200) {
            const { count } = responseFollowers.data;
            setFollowers(count);
        } else {
            console.error("Failed to fetch followers count");
        }

        // Fetch following count
        const responseFollowing = await axios.get(`${API_BASE}users/${userId}/following`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (responseFollowers.status === 200) {
            const { count } = responseFollowing.data;
            setFollowing(count);
        } else {
            console.error("Failed to fetch following count");
        }

        // Fetch user profile data
        const responseProfile = await axios.get(`${API_BASE}user/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
             }
        });

        if (responseFollowers.status === 200) {
            const { username } = responseProfile.data;
            setUsername(username);
        } else {
            console.error("Failed to fetch user profile data");
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
                <i class="fas fa-search fa-2x"></i>
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
