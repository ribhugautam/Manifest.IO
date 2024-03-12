import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NavBar from './components/NavBar'
import { useState } from 'react'
import Privateroute from './components/Privateroute'

function App() {

  const [isLoggedin, setIsLoggedin] = useState(false);

  return (
    <div className='flex flex-col h-screen ' >
    <NavBar isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
    <Routes>
      
      <Route path='/' element={<Login/>} />
      <Route path='/Register' element={<Register/>} />
      <Route path='/Login' element={<Login isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} /> } />
      <Route path='/Dashboard' element={
        <Privateroute isLoggedin={isLoggedin} >
          <Dashboard/>
        </Privateroute>
      } />
      <Route path='*' element = {<Login/>}/>

    </Routes>
      
    </div>
  )
}

export default App
