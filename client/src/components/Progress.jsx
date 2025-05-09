import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Progress = ({ taskList, projectDetails }) => {
  const navigate = useNavigate();
  const completed = taskList.filter(task => task.done).length;
  const total = taskList.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className='progress-container' style={{ padding: '1rem' }}>
      <div className="progress">
        <h3>Progress</h3>
        <div style={{ background: '#ddd', borderRadius: '10px', height: '20px', width: '100%' }}>
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: 'linear-gradient(150deg,rgb(132, 25, 255)  28%, rgb(195, 164, 236) 89%)',
              borderRadius: '10px',
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      </div>
      <p>{completed} of {total} subtasks completed ({Math.round(percentage)}%)</p>
      <br />
      <div className="time-worked"> {/* i have written its css in startworking.css */}

        <h4 style={{ marginRight: '10px' }}>Time Worked: </h4>


        <span className="time-worked">
          {projectDetails ? formatTime(projectDetails.totalTimeWorkedSeconds) : '00:00:00'}
        </span>

      </div>
      <div className="view-btn-container">

        <button className='view-btn '  onClick={() => navigate(`/project/${project._id}`)} >View Graph</button>
      </div>


      <div style={{ width: 'auto', height: '1px', backgroundColor: '#ccc', marginTop: '4px' }}></div>

    </div>
  );
};

export default Progress;
