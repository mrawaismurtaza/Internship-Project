import React, { useEffect, useState } from "react";
import "./FollowList.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://localhost:4002";

function FollowList() {
  const [users, setUsers] = useState([]);
  const { userId } = useParams();
  const [booleanArray, setBooleanArray] = useState({});

  console.log(userId);

  const followUser = async (user) => {
    try {
      console.log(user);
      const response = await axios.post(
        `${API}/follow/${user._id}`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(`Successfully Followed`);
        fetchFollowerList();
      }
    } catch {
      toast.error(`Follow Unsuccessful`);
    }
  };

  const unFollowUser = async (user) => {
    try {
        const response = await axios.post(
            `${API}/unfollow/${user._id}`,
            { userId },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            toast.success(`Successfully unfollowed`);
            fetchFollowerList();
        }
    } catch (error) {
        toast.error(`Unfollow unsuccessful: ${error.response?.data?.error || error.message}`);
    }
};


  const fetchFollowerList = async () => {
    try {
      const response = await axios.get(`${API}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        console.log(response.data);
        setUsers(response.data.users);
        setBooleanArray(response.data.booleanArray);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchFollowerList();
  });

  return (
    <div className="list-group">
      {users.map((user, index) => (
        <div key={user._id} className="d-flex flex-row list-group-item">
          <div className="me-auto p-1 bd-highlight">
            <p className="h4">{user.username}</p>
          </div>
          <div className="p-1 bd-highlight">
            {booleanArray[index] ? (
              <button className="btn btn-light btn-sm border border-primary text-primary"
              onClick={() => unFollowUser(user)}>
                Followed
              </button>
            ) : (
              <button
                className="follow-button btn btn-primary btn-sm"
                onClick={() => followUser(user)}
              >
                Follow
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FollowList;
