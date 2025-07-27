import { Route, Routes } from 'react-router'
import './App.css'
import FilesManagers from './components/FilesManagers'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<FilesManagers />} />
        <Route path="/folder/:folderId" element={<FilesManagers />} />
      </Routes>
    </>
  )
}

export default App
