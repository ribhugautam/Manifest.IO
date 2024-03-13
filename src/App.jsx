import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import Privateroute from "./components/Privateroute";

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [toggle, setToggle] = useState(null);

  useEffect(() => {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches){
      setToggle('dark');
    }
    else{
      setToggle('light');
    }
  },[])


  useEffect(() => {

    if (toggle === 'light') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
  },[toggle])

  const toggleTheme = () => {
    setToggle(toggle === 'dark' ? 'light' : 'dark');
  }

  return (
    <div className="flex flex-col h-screen ">
      <NavBar isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/Login"
          element={
            <Login isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />
          }
        />
        <Route
          path="/Dashboard"
          element={
            <Privateroute isLoggedin={isLoggedin}>
              <Dashboard />
            </Privateroute>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
      <button className="fixed bg-white hover:bg-[#070F2B] text-blue-500 hover:text-white dark:hover:text-blue-500 font-semibold rounded px-2 py-1 dark:bg-white/10 shadow-md dark:hover:bg-white bottom-2 right-2" onClick={toggleTheme} >{toggle === 'light' ? 'Light' : 'Dark'}</button>
    </div>
  );
}

export default App;
