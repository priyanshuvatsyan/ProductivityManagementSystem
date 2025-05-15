import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../api/axios';
import Navigation from './Nagivation'
import Progress from './Progress';
import Subtasks from './subtasks';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './styles/TaskDetails.css';

export default function TaskDetails() {

  const { projectId } = useParams(); // This should be a string, like "663f4e89..."

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



  const [project, setproject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {

        const res = await axios.get(`/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setproject(res.data);
      }
      catch (err) {
        console.log('Failed to fetch project details', err);
      }
    }

    fetchProject();
  }, [projectId])


  if (!project) {
    return <div>Loading...</div>;
  }

  const formattedData = project.timeWorkedPerDay.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    hours: (item.totalSeconds / 3600).toFixed(2),
  }));

  const totalDaysWorked = project.timeWorkedPerDay.length;



  return (
    <div>
      <div className="navigation">
        <Navigation />
      </div>
      <div className="main-container">
      <div className="taskDetails">
        <div className="chart">
          <div className="task-details-container">
            <h2>{project.projectName}</h2>
            <p>Total Time Worked: {(project.totalTimeWorkedSeconds / 3600).toFixed(2)} hrs</p>
            <p >Days Worked: {totalDaysWorked}</p>

            <div className="chart-section">
              <h3 className="chart-title">Time Worked Per Day</h3>
              <p className="chart-subtitle">
                Track your productivity visually. Hover on data points to see exact hours.
              </p>

              <ResponsiveContainer className= {"ResponsiveContainer"} width="100%" height={550}>
                <LineChart className={"line-chart"} data={formattedData} margin={{ top: 30, right: 40, left: 20 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7b2cbf" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#b185db" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" angle={-35} textAnchor="end" height={70} />
                  <YAxis
                    label={{
                      value: 'Hours Worked',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 10,
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #ccc',
                      borderRadius: '10px',
                      fontSize: '14px',
                    }}
                    labelStyle={{ fontWeight: 'bold' }}
                    formatter={(value) => [`${value} hrs`, 'Time']}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="url(#lineGradient)"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#7b2cbf', strokeWidth: 2, fill: 'white' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="summary-info">
                <p>Average Per Day: <strong>{(project.totalTimeWorkedSeconds / totalDaysWorked / 3600).toFixed(2)} hrs</strong></p>
              </div>
            </div>


          </div>
        </div>
        <div className="other-details  ">
          {/* Project details, tasklist etc. */}
          <div className="progress">
            <Progress taskList={taskList} projectDetails={projectDetails} />
          </div>
          <div className="subtasks">
            <Subtasks taskList={taskList} fetchTasks={fetchTasks} projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
