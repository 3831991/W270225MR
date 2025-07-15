import { Route, Routes } from 'react-router'
import './App.css'
import Employee from './Employee/Employee'

function App() {
  return (
    <>
      <h1>ניהול עובדים</h1>

      <Routes>
        <Route path="/" element={<Employee />} />
      </Routes>
    </>
  )
}

export default App
