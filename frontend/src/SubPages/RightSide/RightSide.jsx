import React from 'react'
import "./RightSide.css"
import LeaderBoard from '../../Components/LeaderBoard/LeaderBoard'

function RightSide() {
  return (
    <div className="RightSide">
      <div className="d-flex justify-content-center p-3">
      <p className='h2 text-primary'>Leader Board</p>

      </div>
      <div className="p-3">

      <LeaderBoard/>
      </div>
    </div>
  )
}

export default RightSide