import React, { useState, useEffect, useRef } from 'react';
import Navigation from './Nagivation';
import axios from '../api/axios';
import { useParams } from 'react-router-dom';
import Progress from './Progress';
import Subtasks from './Subtasks';
import './styles/StartWorking.css';

export default function StartWorking() {
  const { projectId } = useParams();

  const [taskList, setTaskList] = useState([]);
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

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      // Only set new startTime if it's the first time starting
      if (!startTime) {
        setStartTime(new Date());
      }
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const newElapsed = Math.floor((now - new Date(startTime)) / 1000);
        setElapsed(newElapsed);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, startTime]);

  const [projectDetails, setProjectDetails] = useState(null);
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

  const handleDone = async () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setStartTime(null);

    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    const timeWorkedInMinutes = elapsed / 60;

    try {
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
    }

    setElapsed(0);
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
            <button onClick={() => {
              setIsRunning(true);
              if (!startTime) setStartTime(new Date());
            }}>Start</button>
            <button onClick={() => {
              setIsRunning(false);
              setStartTime(null);
            }}>Pause</button>
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
    </div>
  );
}
