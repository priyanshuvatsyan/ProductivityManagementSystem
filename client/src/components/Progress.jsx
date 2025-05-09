import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Progress = ({ taskList }) => {

  const completed = taskList.filter(task => task.done).length;
  const total = taskList.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Progress</h3>
      <div style={{ background: '#ddd', borderRadius: '10px', height: '20px', width: '100%' }}>
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: '#4caf50',
            borderRadius: '10px',
            transition: 'width 0.5s ease-in-out'
          }}
        ></div>
      </div>
      <p>{completed} of {total} subtasks completed ({Math.round(percentage)}%)</p>
    </div>
  );
};

export default Progress;
