import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";
import Privateroute from "./components/Privateroute";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineNightlight } from "react-icons/md";

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [toggle, setToggle] = useState(null);
  const [newpost, setNewpost] = useState(null);

  useEffect(() => {
    setToggle(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark');
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
        <Route path="/" element={<Home isLoggedin={isLoggedin} />} />
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
        <Route path="*" element={<Home isLoggedin={isLoggedin} />} />
      </Routes>
      <button className="fixed bg-white hover:bg-[#0f1c4cda] text-blue-500 dark:hover:text-blue-500 font-semibold rounded-full p-2 dark:bg-white/10 shadow-md dark:hover:bg-white bottom-2 right-2" onClick={toggleTheme} >{toggle === 'light' ? (<MdOutlineLightMode size={20} />) : (<MdOutlineNightlight size={20} />)}</button>
    </div>
  );
}

export default App;
