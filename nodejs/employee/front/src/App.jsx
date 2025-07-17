import { Route, Routes } from 'react-router'
import './App.css'
import Employee from './Employee/Employee'
import EmployeeCard from './EmployeeCard/EmployeeCard'
import EmployeeCreate from './EmployeeCreate/EmployeeCreate'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Employee />} />
        <Route path="/employee/create" element={<EmployeeCreate />} />
        <Route path="/employee/:id" element={<EmployeeCard />} />
      </Routes>
    </>
  )
}

export default App
