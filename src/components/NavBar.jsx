import React from "react";
import { Link } from "react-router-dom";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function NavBar(props) {
  const isLoggedin = props.isLoggedin;
  const setIsLoggedin = props.setIsLoggedin;
  const navigate = useNavigate();

  const onLogout = () => {
    account.deleteSession("current");
    navigate("/Login");
    setIsLoggedin(false);
    toast.success("Logged out successfully",{className:"dark:bg-white/5 dark:text-white"});
  };

  return (
    <div className="bg-blue-500 dark:bg-[#1B1A55] text-white p-4">
      <div className="flex justify-between items-center max-w-[1180px] mx-auto w-11/12">
        <Link to="/">
          <span className="text-blue-500 text-2xl font-bold shadow-md bg-white dark:bg-white/5 rounded-l px-1 pl-2 ">
            MANIFEST
          </span>
          <span className="text-white bg-blue-500 px-1 pr-2 rounded-r  text-2xl shadow-md font-bold ">
            .IO
          </span>
        </Link>

        {/* <ul className='flex gap-8 items-center justify-center '>
        <Link to="/"><li className='font-semibold py-1 p-2 rounded filter  hover:brightness-120  transition-all duration-200 ' >Home</li></Link>
      </ul> */}

        <div className="flex gap-2">
          {!isLoggedin && (
            <Link to="/Login">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-700 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
                LogIn
              </button>
            </Link>
          )}
          {!isLoggedin && (
            <Link to="/Register">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-700 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
                Register
              </button>
            </Link>
          )}

          {isLoggedin && (
            <Link to="/Login">
              <button
                className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-700 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 "
                onClick={onLogout}
              >
                LogOut
              </button>
            </Link>
          )}
          {isLoggedin && (
            <Link to="/Dashboard">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-700 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
                DashBoard
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
