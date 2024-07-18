import React, { useEffect, useState } from "react";
import "./Post.css";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API_BASE = "http://localhost:4002/";

function Post() {
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE}posts/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setPosts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching posts. Please try again later.");
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`${API_BASE}posts/${postId}/like/${userId}`, {}, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: post.likes.includes(userId) 
                  ? post.likes.filter(id => id !== userId) 
                  : [...post.likes, userId] 
              } 
            : post
        ));
        toast.success("Post like status updated successfully");
      }
    } catch (error) {
      toast.error("Error updating like status. Please try again later.");
      console.error("Error updating like status:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div className="post-container overflow">
            {posts.map((post) => (
              <div key={post._id} className="card m-3">
                <div className="card-header">
                  <i className="fa fa-user me-1"></i>
                  <span className="fw-bold">{post.user.username}</span>
                </div>
                <div className="card-body">
                  {post.media && post.media.imageUrl && (
                    <img
                      src={post.media.imageUrl}
                      alt="Preview"
                      className="w-100 img-fluid"
                    />
                  )}
                  {post.media && post.media.videoUrl && (
                    <video
                      src={post.media.videoUrl}
                      controls
                      className="w-100"
                    />
                  )}
                </div>
                <div className="card-footer">
                  <i
                    className={`me-1 ${post.likes.includes(userId) ? "fas fa-heart" : "far fa-heart"}`}
                    onClick={() => handleLike(post._id)}
                    style={{ cursor: "pointer", color: post.likes.includes(userId) ? "blue" : "black" }}
                  ></i>
                  <span>{post.likes.length} Likes</span>
                  <p>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
