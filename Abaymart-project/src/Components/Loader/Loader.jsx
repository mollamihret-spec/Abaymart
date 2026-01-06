import React from 'react'
import {FadeLoader} from 'react-spinners'
function Loader() {
  return (
    <div style={{
        display: "flex",
        alignItems: "Center",
        justifyContent: "Center",
        height: "50vh",


    }}>
        <FadeLoader color="#36d767"/>
    </div>
  )
}

export default Loader