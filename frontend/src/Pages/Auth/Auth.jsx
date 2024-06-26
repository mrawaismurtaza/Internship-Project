import React from 'react';
import './Auth.css';
import Login from '../../SubPages/Login/Login';
import Signup from '../../SubPages/Signup/Signup';

function Auth() {
  return (
    <div className="Auth">
      <Login/>
      <Signup/>
    </div>
  );
}

export default Auth;