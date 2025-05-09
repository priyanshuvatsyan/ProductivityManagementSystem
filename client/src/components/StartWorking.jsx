import React, { useState, useEffect, useRef } from 'react';
import Navigation from './Nagivation';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import Progress from './Progress';
import Subtasks from './subtasks';


export default function StartWorking() {
    const { projectId } = useParams();  // Get projectId from URL

    //console.log(projectId);  // You now have the projectId from the URL

  
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleDone = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);

    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

    const timeWorkedInMinutes = seconds / 60; // Convert seconds to minutes
  
    // Make API call to update the time for this project
    try {
        const token = localStorage.getItem('token');
        await axios.put(
            `/projects/${projectId}/update-time`,
            {
                date : dateString,
                timeWorked : timeWorkedInMinutes,
            },
            {
                headers: { Authorization: `Bearer ${token}` }, // Ensure authorization
              }
        )
    } catch (err) {
        console.error(err);
    }
    
   
    setSeconds(0);
  };

  return (
    <div>
      <div className="navigation">
       {/*  <Navigation /> */}
      </div>

      <div className="clock" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1>{formatTime(seconds)}</h1>
        <button onClick={() => setIsRunning(true)}>Start</button>
        <button onClick={() => setIsRunning(false)}>Pause</button>
        <button onClick={handleDone}>Done</button>
      </div>

      <div className="details">
        {/* Project details, tasklist etc. */}
        <div className="progress">
        <Progress projectId={projectId} />

        </div>
        <div className="subtasks">
        <Subtasks projectId={projectId} />

        </div>
      </div>
    </div>
  );
}
