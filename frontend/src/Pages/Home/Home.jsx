import React from 'react'
import "./Home.css"
import LeftSide from '../../SubPages/LeftSide/LeftSide'

function Home() {
  return (
    <div className="Home">
      <div className="LeftSide">
        <LeftSide/>
      </div>
      <div className="PostSide">
        PostSide
      </div>
      <div className="RightSide">
        RightSide
      </div>
    </div>
  )
}

export default Home