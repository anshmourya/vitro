import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrap
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home'
import Signin from './Components/Signin';
import Dashboard from './Pages/Dashboard';
import TeacherDashboard from './Pages/TeacherDashboard';
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/Signin' element={<Signin />} />
          <Route path='/dashboard/student/:id' element={<Dashboard />} />
          <Route path='/dashboard/teacher/:id' element={<TeacherDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;