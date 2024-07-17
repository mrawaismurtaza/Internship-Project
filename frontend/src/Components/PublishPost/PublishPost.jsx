import React, { useState } from "react";
import "./PublishPost.css";

function PublishPost() {
  const [image, setImage] = useState(null);
  const [descrption, setDescription] = useState("");

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for the image file
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleVideo = (e) => {

  }

  return (
    <div className="d-grid gap-3">
      <div className="d-flex justify-content-around pb-3 border-bottom">
        <i className="fa fa-user fa-2x"></i>
        <input
          type="text"
          placeholder="What's on your mind"
          className="input-lg w-75 focus-ring ps-3"
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
          <i className="fa-solid fa-video fa-2x i-hover text-primary"></i><input
            type="file"
            name="video"
            id="video"
            className="file-upload"
            accept="video/*"
            onChange={handleVideo}
          />
        </div>
        <div className="share-button">
        <button className="btn btn-outline-primary">Share</button></div>
        
      </div>
      <div className="previewPost">
        <p>{descrption}</p>
        <img src={image} alt="" className="w-100"/>
      </div>
    </div>
  );
}

export default PublishPost;
