import React, { useState } from "react";
import "./PublishPost.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4002/";

function PublishPost() {
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const { userId } = useParams();

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
        setShowPreview(true);
        setVideo(null); // Clear video if an image is chosen
      };
    }
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setVideo(reader.result);
        setShowPreview(true);
        setImage(null); // Clear image if a video is chosen
      };
    }
  };

  const handleRemoveMedia = () => {
    setImage(null);
    setVideo(null);
    setShowPreview(false);
  };

  const sharePost = async () => {
    try {
      const mediaData = image ? { imageUrl: image } : { videoUrl: video };
      const response = await axios.post(`${API_BASE}createpost/${userId}`, {
        description,
        ...mediaData,
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.status === 201) {
        toast.success(`Post is shared successfully`);
        setDescription("");
        setImage(null);
        setVideo(null);
        setShowPreview(false);
      }
    } catch (error) {
      toast.error("Failed to share the post");
    }
  };

  return (
    <div className="d-grid gap-3">
      <div className="d-flex justify-content-around pb-3 border-bottom">
        <i className="fa fa-user fa-2x"></i>
        <input
          type="text"
          placeholder="What's on your mind"
          className="input-lg w-75 focus-ring ps-3"
          value={description}
          onChange={handleDescription}
        />
      </div>
      <div className="d-flex justify-content-around pb-3 mt-2">
        <div className="upload-image position-relative">
          <i className="fa-solid fa-image fa-2x i-hover text-primary"></i>
          <input
            type="file"
            className="file-upload"
            accept="image/*"
            onChange={handleImage}
          />
        </div>
        <div className="upload-video position-relative">
          <i className="fa-solid fa-video fa-2x i-hover text-primary"></i>
          <input
            type="file"
            name="video"
            id="video"
            className="file-upload"
            accept="video/*"
            onChange={handleVideo}
          />
        </div>
        <div className="share-button">
          <button className="btn btn-outline-primary" onClick={sharePost}>Share</button>
        </div>
      </div>
      {showPreview && (
        <div className="previewPost">
          <p>{description}</p>
          {image && <img src={image} alt="Preview" className="w-100" />}
          {video && <video src={video} controls className="w-100" />}
          <i className="fa fa-times" aria-hidden="true" onClick={handleRemoveMedia}></i>
        </div>
      )}
    </div>
  );
}

export default PublishPost;
