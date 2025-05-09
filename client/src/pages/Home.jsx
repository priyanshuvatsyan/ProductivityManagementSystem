import React from 'react';
import Navigation from '../components/Nagivation';
import AllTasks from '../components/AllTasks';
import './styles/Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="nav-left">
        <Navigation />
      </div>
      <div className="main-right">
        <AllTasks />
      </div>
    </div>
  );
}
