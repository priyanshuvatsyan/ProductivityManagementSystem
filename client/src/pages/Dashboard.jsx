import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import './styles/Dashboard.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import Navigation from '../components/Nagivation';


export default function Dashboard() {

  const [projects, setprojects] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')
      setLoading(true);
      const res = await axios.get(`/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setprojects(res.data);
    } catch (error) {
      console.log("error fetching projects", error);

    }finally{
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchProjects();


  }, [])



  return (

    <div className="outer-dashboard-container">
      <Navigation/>
      <div className="dashboard-container">
        {projects.map((project) => {
          const formattedData = project.timeWorkedPerDay.map((item) => ({
            date: new Date(item.date).toLocaleDateString(),
            hours: (item.totalSeconds / 3600).toFixed(2),
          }));

          const totalDaysWorked = project.timeWorkedPerDay.length;
          const average = totalDaysWorked
            ? (project.totalTimeWorkedSeconds / totalDaysWorked / 3600).toFixed(2)
            : 0;

          return (
            <div key={project._id} className="project-card">
              <div className="project-chart">
                <h3 className="project-title">{project.projectName}</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formattedData} margin={{ top: 20, right: 20, left: 10 }}>
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7b2cbf" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#b185db" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-35} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} hrs`, 'Time']}
                      labelStyle={{ fontWeight: 'bold' }}
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
              </div>

              <div className="project-details">
                <p><strong>Total Time Worked:</strong> {(project.totalTimeWorkedSeconds / 3600).toFixed(2)} hrs</p>
                <p><strong>Days Worked:</strong> {totalDaysWorked}</p>
                <p><strong>Average Per Day:</strong> {average} hrs</p>
                <ul className="task-list">
                  {project.taskList.map((task, idx) => (
                    <li key={idx} className={task.done ? "task-done" : "task-pending"}>
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          );
        })}

      </div>

  {loading && (
  <div className="dialog-backdrop">
    <div className="dialog authdialog">
      <p>⏳ Please wait, Loading your Dashboard...</p>
    </div>
  </div>
)}
    </div>
  );
}

