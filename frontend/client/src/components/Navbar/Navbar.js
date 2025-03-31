import React from 'react'
import './Navbar.css'
import logo from "../../assets/Logo.jpeg"; 



const Navbar =  ({ setShowLogin }) => {
  return (
    <div className="auth-container1">
          {/* Logo Image at the top */}
          <img src={logo} alt="Logo" className="logo" />
  
        <div className='navbar'>

            
        </div>
      </div>
  );
};

export default Navbar