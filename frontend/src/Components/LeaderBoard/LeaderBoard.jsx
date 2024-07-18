import React, { useEffect, useState } from 'react';
import "./LeaderBoard.css";
import axios from 'axios';

const API_BASE = "http://localhost:4002/";

function LeaderBoard() {
  const [noOfPosts, setNoOfPosts] = useState([]);

  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get(`${API_BASE}leaderboard`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setNoOfPosts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return (
      <ul className="list-group">
        {noOfPosts.length === 0 ? (
          <p>No data available</p>
        ) : (
          noOfPosts.map((user, index) => (
            <li key={user._id} className="leaderboard-item list-group-item">
              <p className='h2'>{index + 1}. {user.userDetails.username}</p>
              <p>Posts: {user.postCount}</p>
            </li>
          ))
        )}
      </ul>
  );
}

export default LeaderBoard;
