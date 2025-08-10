import { Route, Routes } from 'react-router'
import './App.css'
import Employee from './Employee/Employee'
import EmployeeCard from './EmployeeCard/EmployeeCard'
import EmployeeCreate from './EmployeeCreate/EmployeeCreate'
import { createContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import { jwtDecode } from 'jwt-decode';
import Signup from './Signup/Signup'
import Login from './Login/Login'

export const MyContext = createContext();

function App() {
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState();
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

  useEffect(() => {
    // בדיקת מצב החיבור
    getLoginStatus();
    // רענון לטוקן כל עשר דקות
    // (היות והטוקן תקף ל-15 דקות)
    const tenMinutes = 10 * 60 * 1000;
    setInterval(refreshToken, tenMinutes);
    // כשחוזרים לדף הוא בודק שוב
    addEventListener('focus', getLoginStatus);
  }, []);

  // בדיקה בטעינה הראשונית, האם היוזר מחובר
  const getLoginStatus = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = jwtDecode(token);

      const exp = user.exp * 1000;
      const current = Date.now();

      if (current > exp) {
        setUser(null);
      } else {
        // בהפעלה ראשונית, אם הטוקן תקין - אנחנו מבצעים לו הארכה
        refreshToken();
        setUser(user);
      }
    } else {
      setUser(null);
    }
  }

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  }

  // הארכת תוקף לטוקן פעיל
  const refreshToken = async () => {
    const token = localStorage.getItem("token");

    // רק אם יש טוקן
    if (token) {
      // הנתונים מהטוקן
      const user = jwtDecode(token);

      // זמן התפוגה של הטוקן (milliseconds)
      const exp = user.exp * 1000;
      // הזמן הנוכחי (milliseconds)
      const current = Date.now();

      // אם הטוקן עדיין בתוקף
      if (current < exp) {
        // פנייה לשרת לחדש את התוקף
        const res = await fetch(`http://localhost:4000/token`, {
          credentials: 'include',
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });

        if (res.ok) {
          const token = await res.text();
          localStorage.setItem('token', token);
        }
      }
    } else {
      setUser(null);
    }
  }

  return (
    <>
      <MyContext.Provider value={{ snackbar, setIsLoader, setUser, user }}>
        {user && <header>ברוך הבא {user.fullName} <button className='logout' onClick={logout}>התנתק</button></header>}
        {
          user === null &&
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Login />} />
          </Routes>
        }
        {
          user &&
          <Routes>
            <Route path="/" element={<Employee />} />
            <Route path="/employee/create" element={<EmployeeCreate />} />
            <Route path="/employee/edit/:employeeId" element={<EmployeeCreate />} />
            <Route path="/employee/:id" element={<EmployeeCard />} />
          </Routes>
        }
      </MyContext.Provider>

      {isLoader && <div className="loaderFrame"><div className="loader"></div></div>}
      {isSnackbar && <div className="snackbar" onClick={closeSnackbar}>{snackbarText}</div>}
    </>
  )
}

export default App
