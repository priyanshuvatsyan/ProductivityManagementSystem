import { useEffect, useState } from 'react';
import axios from '../api/axios';

const Subtasks = ({ taskList, fetchTasks,projectId }) => {
  const [showSubtaskDialog, setshowSubtaskDialog] = useState(false);
  const [newSubtaskTitle, setnewSubtaskTitle] = useState('');
  

  const toggleTask = async (index) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/projects/${projectId}/task/${index}`, {}, {

        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks(); // Refresh tasks after toggling
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };
  const handleDeleteSubtask = async (index)=>{
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/projects/${projectId}/task/${index}`,{
            headers: { Authorization: `Bearer ${token}` }
        })
        fetchTasks();
    } catch (err) {
        console.error('Error deleting task:', err);
    }
  }

  const handleAddSubtask = async () => {
    try {
        const token = localStorage.getItem('token');
        await axios.post(`/projects/${projectId}/task`, {
            taskName: newSubtaskTitle
        },{
        headers: {Authorization: `Bearer ${token}`
        }}
    );
    setnewSubtaskTitle('');
    setshowSubtaskDialog(false);
    fetchTasks();
    } catch (err) {
        console.error('Error adding subtask:', err);
    }
  }

  return (
    <div className="subtask-container subtask-container-subtasks" >
      <h2>Subtasks</h2>
      <ul>
        {taskList.map((task, index) => (
          <li key={index}  className="subtask-item subtask-item-subtasks" >
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(index)}
            />
             <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
                          {task.title}
                        </span>
            <button onClick={() => handleDeleteSubtask(index)}>🗑️</button>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '1rem' }}>
        <button  className="add-subtask add-subtask-subtasks"  onClick={() => setshowSubtaskDialog(true)}> Add Subtask</button>
      </div>


      {
        showSubtaskDialog && (
            <div  className="dialog-backdrop">
              <div className="dialog">
                <input type="text"
                value={newSubtaskTitle}
                placeholder='Enter subtask'
                onChange={(e)=> setnewSubtaskTitle(e.target.value)}
                />
                <div className="dialog-buttons">
                 <button onClick={handleAddSubtask}>Add</button>
                 <button onClick={() => setshowSubtaskDialog(false)}>Cancel</button>
              </div>
            </div> 
          </div>
        )
      }
    </div>
  );
};

export default Subtasks;


