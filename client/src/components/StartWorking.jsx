import React, { useState, useEffect, useRef } from 'react';
import Navigation from './Nagivation';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import Progress from './Progress';
import Subtasks from './Subtasks';
import './styles/StartWorking.css';

export default function StartWorking() {
  const { projectId } = useParams();

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const [taskList, setTaskList] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);

  const [loading, setloading] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handlePauseResume = () => {
    setIsRunning(prev => !prev);
  };

  const handleDone = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);


    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const timeWorkedInMinutes = elapsed / 60;

    try {
      setloading(true)
      const token = localStorage.getItem('token');
      await axios.put(
        `/projects/${projectId}/update-time`,
        {
          date: dateString,
          timeWorked: timeWorkedInMinutes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error(err);
    }finally{
      setloading(false)}

    setElapsed(0);
  };

  // Fetch project and task data
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/projects/${projectId}/task`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskList(res.data.taskList);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjectDetails(res.data);
    } catch (err) {
      console.error('Error fetching project:', err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
      fetchProjectDetails();
    }
  }, [projectId]);

  const formatTime = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, '0');
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div>
      <div className="navigation">
        <Navigation />
      </div>

      <div className="clock-details-container">
        <div className="clock">
          <h1>{formatTime(elapsed)}</h1>
          <div className="buttons-container">
            <button onClick={() => setIsRunning(true)}>Start</button>
            <button onClick={handlePauseResume}>
              {isRunning ? 'Pause' : 'Resume'}
            </button>
            <button onClick={handleDone}>Done</button>
          </div>
        </div>
        <div className="details">
          <div className="progress">
            <Progress taskList={taskList} projectDetails={projectDetails} />
          </div>
          <div className="subtasks">
            <Subtasks taskList={taskList} fetchTasks={fetchTasks} projectId={projectId} />
          </div>
        </div>
      </div>

 {loading && (
  <div className="dialog-backdrop">
    <div className="dialog authdialog">
      <p>⏳ Please wait, We are saving your progress...</p>
    </div>
  </div>
)}

    </div>
  );
}
