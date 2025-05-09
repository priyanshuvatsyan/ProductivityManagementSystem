import React, { useState, useEffect } from 'react';
import './styles/Navigation.css';
import { LogOut,LogIn, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);
  
  useEffect(() => {
    const token = localStorage.getItem('token');  
    setisLoggedIn(!!token);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setisLoggedIn(false);
    navigate('/authentication');
     };

  return (
    <>
      <div className="menu-icon" onClick={toggleMenu}>
        <Menu size={30} />
      </div>

      <div className={`nav-container ${isOpen ? 'open' : ''}`}>
        <h1 className="logo">PMS</h1>
        <ul className="nav-data">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/predictions">Predictions</Link></li>
          <li><Link to="/more">More</Link></li>
        </ul>
        <div className="logout" onClick={isLoggedIn?handleLogout: ()=> navigate('/authentication') }>

          {isLoggedIn? <LogOut size={30} /> :  <LogIn size={30} />}
        </div>
      </div>
    </>
  );
}
