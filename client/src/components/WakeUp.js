import React from 'react'
import Spinner from "react-bootstrap/Spinner";

export default () =>
  <div className="container">
  <div className={'loading-wrapper fadein'}>
    <h4>Heroku is spinning up, one moment please...</h4>
    <div className={'loading'}>
      <span><Spinner animation="border" role="status">
      
      </Spinner></span>
    </div>
  </div>
  </div>
