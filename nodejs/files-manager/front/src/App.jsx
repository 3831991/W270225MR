import { Route, Routes } from 'react-router'
import './App.css'
import FilesManagers from './components/FilesManagers'
import { createContext, useRef, useState } from 'react';

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
    timeout.current = setTimeout(() => closeSnackbar(), 3 * 1000);
  }

  const closeSnackbar = () => {
    clearTimeout(timeout.current);
    setIsSnackbar(false);
  }
  
  const loader = isLoader => {
    setIsLoader(isLoader);
  }

  return (
    <>
      <MyContext.Provider value={{ snackbar, loader }}>
        <Routes>
          <Route path="/" element={<FilesManagers />} />
          <Route path="/folder/:folderId" element={<FilesManagers />} />
        </Routes>
      </MyContext.Provider>

      {isLoader && <div className="loader-container"><div className="loader"></div></div>}
      <div id="snackbar" className={isSnackbar ? 'show' : ''} onClick={closeSnackbar}>{snackbarText}</div>
    </>
  )
}

export default App
