import { Route, Routes } from 'react-router'
import './App.css'
import Employee from './Employee/Employee'
import EmployeeCard from './EmployeeCard/EmployeeCard'
import EmployeeCreate from './EmployeeCreate/EmployeeCreate'
import { createContext, useState } from 'react'
import { useRef } from 'react'

export const MyContext = createContext();

function App() {
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const timeout = useRef();

  const snackbar = text => {
    setSnackbarText(text);
    setIsSnackbar(true);
    // הסתר ההודעה לאחר 3 שניות
    timeout.current = setTimeout(() => setIsSnackbar(false), 3 * 1000);
  }

  const closeSnackbar = () => {
    clearTimeout(timeout.current);
    setIsSnackbar(false);
  }

  return (
    <>
      <MyContext.Provider value={{ snackbar, setIsLoader }}>
        <Routes>
          <Route path="/" element={<Employee />} />
          <Route path="/employee/create" element={<EmployeeCreate />} />
          <Route path="/employee/edit/:employeeId" element={<EmployeeCreate />} />
          <Route path="/employee/:id" element={<EmployeeCard />} />
        </Routes>
      </MyContext.Provider>

      {isLoader && <div className="loaderFrame"><div className="loader"></div></div>}
      {isSnackbar && <div className="snackbar" onClick={closeSnackbar}>{snackbarText}</div>}
    </>
  )
}

export default App
