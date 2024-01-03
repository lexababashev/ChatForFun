import React from 'react';
import SwitchComponent from "../Switch/SwitchComponent"
import './Header.css';
import logo from '../../assets/icons/logo.svg'

const Header = () => {

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={logo} alt="logo" style={{ width: "3rem", height: "3rem" }} />
        </div>
        <div className='projectName'>
          <h1>ChatForFun</h1>
        </div>
        <div className="signIn">
          <button className="signInBtn">
            Sign In with
            <span className="g">G</span>
            <span className="o">o</span>
            <span className="o2">o</span>
            <span className="g2">g</span>
            <span className="l">l</span>
            <span className="e">e</span>
          </button>
        </div>

      </header>
      <SwitchComponent />
    </div>


  );
};

export default Header;

