import React from 'react'
import Home from './component/Home/Home'
import Course from './component/Course'
import { Routes, Route } from 'react-router-dom'
import Courses from './component/Courses.jsx/Courses'
import Signup from './component/Signup'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Course" element={<Courses />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App