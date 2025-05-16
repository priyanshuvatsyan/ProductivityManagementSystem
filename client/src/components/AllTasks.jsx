import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import './styles/Alltasks.css';
import { Play, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StartWorking from './StartWorking';

export default function AllTasks() {
  const [projects, setProjects] = useState([]);
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [showSubtaskDialog, setShowSubtaskDialog] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [activeSubtaskProjectId, setActiveSubtaskProjectId] = useState(null);
  const [authPopUp, setauthPopUp] = useState(false)
  const [loading, setLoading] = useState(false);
  const [allTaskloading, setallTaskloading] = useState(false);


  const navigate = useNavigate();

  const fetchProjects = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setallTaskloading(true);
   /*    console.log(token); */
    try {
      const res = await axios.get('/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }finally{
      setallTaskloading(false);
    }
  };

  const handleAddProject = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Login first");
     setLoading(true);
    try {
      const res = await axios.post('/projects', { projectName: newProjectName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => [...prev, res.data]);
      setShowProjectDialog(false);
      setNewProjectName('');
    } catch (err) {
      console.error('Failed to add project:', err);
    }finally {
    setLoading(false);
  }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login first');
     setLoading(true);
    try {
      await axios.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Failed to delete project:', err);
    }finally {
    setLoading(false);
  }
  };

  const handleToggleExpand = (projectId) => {
    setExpandedProjectId(prev => prev === projectId ? null : projectId);
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle || !activeSubtaskProjectId) return;
     setLoading(true);
    try {
      const res = await axios.post(`/projects/${activeSubtaskProjectId}/task`, {
        taskName: newSubtaskTitle
      });
      setProjects(prev =>
        prev.map(p =>
          p._id === activeSubtaskProjectId ? { ...p, taskList: res.data.taskList } : p
        )
      );
      setShowSubtaskDialog(false);
      setNewSubtaskTitle('');
      setActiveSubtaskProjectId(null);
    } catch (err) {
      console.error('Failed to add subtask:', err);
    }finally {
    setLoading(false);
  }

  };

  const handleToggleDone = async (projectId, index) => {
    try {
      const res = await axios.patch(`/projects/${projectId}/task/${index}`);
      setProjects(prev =>
        prev.map(p =>
          p._id === projectId ? { ...p, taskList: res.data.taskList } : p
        )
      );
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
    }
  };

  const handleDeleteSubtask = async (projectId, index) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/projects/${projectId}/task/${index}`);
      setProjects(prev =>
        prev.map(p =>
          p._id === projectId ? { ...p, taskList: res.data.taskList } : p
        )
      );
    } catch (err) {
      console.error('Failed to delete subtask:', err);
    }finally {
    setLoading(false);
  }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    

     const token = localStorage.getItem('token');
    if (!token){
      setauthPopUp(true);
    }
    else{
fetchProjects();
    }
    
  }, []);

  return (
    <div className='alltasks-container'>
      <div className="main-right">
        <h1>All Tasks</h1>
        <div className="task-section">
          <div className="task-header">
            <span>Start</span>
            <span>Project Name</span>
            <span>Time Worked</span>
            <span>Actions</span>
          </div>
          {projects.map((project) => (
            <React.Fragment key={project._id}>
              <div className="task-row">
                <button className="start-btn" onClick={() => navigate(`/start/${project._id}`)}>
                  <Play size={20} />
                </button>
                <span className="project-name" onClick={() => navigate(`/start/${project._id}`)}>
                  {project.projectName}
                </span>
                <span className="time-worked">
                  {formatTime(project.totalTimeWorkedSeconds)}
                </span>
                <div className="task-actions">
                  
                <button className="view-btn"onClick={() => navigate(`/project/${project._id}`)}
                >View</button>

                  <button className="delete-btn" onClick={() => handleDelete(project._id)}>Delete</button>
                  <button className="dropdown-btn" onClick={() => handleToggleExpand(project._id)}>▼</button>
                </div>
              </div>

              {expandedProjectId === project._id && (
                <div className="subtask-container">
                  <ul>
                    {project.taskList?.map((task, idx) => (
                      <li key={idx} className="subtask-item">
                        <input
                          className='checkbox'
                          type="checkbox"
                          checked={task.done}
                          onChange={() => handleToggleDone(project._id, idx)}
                        />
                        <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                          {task.title}
                        </span>
                        <button onClick={() => handleDeleteSubtask(project._id, idx)}>🗑️</button>
                      </li>
                    ))}
                  </ul>
                  <button className="add-subtask" onClick={() => {
                    setShowSubtaskDialog(true);
                    setActiveSubtaskProjectId(project._id);
                  }}>
                    Add Subtask
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <button className="add-task" onClick={() => setShowProjectDialog(true)}>
          <Plus size={50} />
        </button>

        {showProjectDialog && (
          <div className="dialog-backdrop">
            <div className="dialog">
              <h3>Enter Project Name</h3>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder='Project Name'
              />
              <div className="dialog-buttons">
                <button onClick={handleAddProject}>Add</button>
                <button onClick={() => setShowProjectDialog(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showSubtaskDialog && (
          <div className="dialog-backdrop">
            <div className="dialog">
              <h3>Enter Subtask</h3>
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="Subtask title"
              />
              <div className="dialog-buttons">
                <button onClick={handleAddSubtask}>Add</button>
                <button onClick={() => setShowSubtaskDialog(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      {authPopUp && (
  <div className="dialog-backdrop">
    <div className="dialog authdialog ">
      <h3>You are not logged in</h3>
      <p>Please login to continue</p>
      <div className="dialog-buttons">
        <button onClick={() => navigate('/authentication')}>Login</button>
        <button onClick={() => setauthPopUp(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}

{loading && (
  <div className="dialog-backdrop">
    <div className="dialog authdialog">
      <p>⏳ Please wait, saving to backend...</p>
    </div>
  </div>
)}


{allTaskloading && (
  <div className="dialog-backdrop">
    <div className="dialog authdialog">
      <p>⏳ Please wait, Your tasks are getting fetched...</p>
    </div>
  </div>
)}



    </div>
  );
}
