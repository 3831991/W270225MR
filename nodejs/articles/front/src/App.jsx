import { createContext, useState } from 'react';
import { Route, Routes } from 'react-router';
import './App.css'
import Login from './components/Login'
import { useEffect } from 'react';
import Articles from './components/Articles';
import ArticleAdd from './components/ArticleAdd';
import RecycleBin from './components/RecycleBin';
import Signup from './components/Signup';
import { jwtDecode } from 'jwt-decode';

export const MyContext = createContext();

function App() {
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState();

  const snackbar = text => {
    setSnackbarText(text);
    setIsSnackbar(true);
    // הסתר ההודעה לאחר 2 שניות
    setTimeout(() => setIsSnackbar(false), 2 * 1000);
  }

  useEffect(() => {
    getLoginStatus();
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

  return (
    <MyContext.Provider value={{ snackbar, setIsLoader, setUser }}>
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
          <Route path="/" element={<Articles />} />
          <Route path="/add" element={<ArticleAdd />} />
          <Route path="/article/:articleId" element={<ArticleAdd />} />
          <Route path="/recycle-bin" element={<RecycleBin />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      }

      {isLoader && <div className="loaderFrame"><div className="loader"></div></div>}
      {isSnackbar && <div className="snackbar">{snackbarText}</div>}
    </MyContext.Provider>
  )
}

export default App
