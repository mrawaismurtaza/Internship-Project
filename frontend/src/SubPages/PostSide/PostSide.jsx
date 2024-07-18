import React from 'react'
import "./PostSide.css"
import Post from '../../Components/Posts/Post'
import PublishPost from '../../Components/PublishPost/PublishPost'

function PostSide() {
  return (
    <div className="card">
        <div className="card-header">
            <PublishPost/>
        </div>
        <div className="car-body posts overflow-auto">
            <Post/>
        </div>
    </div>
  )
}

export default PostSide