import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Progress = ({ projectId }) => {
  const [taskList, setTaskList] = useState([]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/projects/${projectId}/task`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTaskList(res.data.taskList);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

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
