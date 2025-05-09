import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Authentication from './pages/Authentication';
import TaskDetails from './components/TaskDetails';
import './App.css'
import StartWorking from './components/StartWorking';

function App() {


  return (
    <>
{/* < Authentication/> */}
 {/*  <Home/> */}
     { <Routes>
       {/*  <Route path='/' element={<Home/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/authentication' element={< Authentication/>} /> */}


        <Route path='/' element={<Home/>} />
        <Route path='/authentication' element={< Authentication/>} />
        <Route path='/dashboard' element={< Dashboard/>} />
        <Route path="/start/:projectId" element={<StartWorking />} />
        <Route path="/project/:projectId" element={<TaskDetails />} />
      </Routes>}
    </>
  )
}

export default App
