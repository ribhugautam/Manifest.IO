import React from "react";
import { Link } from "react-router-dom";
import { account } from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";

function NavBar(props) {
  const isLoggedin = props.isLoggedin;
  const setIsLoggedin = props.setIsLoggedin;
  const navigate = useNavigate();

  const onLogout = () => {
    account.deleteSession("current");
    navigate("/Login");
    setIsLoggedin(false);
    toast.success("Logged out successfully",{className:"dark:bg-[#070F2B] dark:text-white"});
  };

  return (
    <div className="bg-blue-500 dark:bg-[#1B1A55] text-white p-4">
      <div className="flex justify-between items-center max-w-[1180px] mx-auto w-11/12">
        <Link to="/" className="ring ring-blue-500 rounded" >
        <div className="ring flex flex-row text-xl font-bold justify-center rounded items-center text-center ring-blue-500" >  
            <span className="text-blue-500 dark:bg-white/10 shadow-md bg-white rounded-l px-1 pl-2 ">
              MANIFEST
            </span>
            <span className="text-white shadow-md bg-blue-500 px-1 pr-2 rounded-r">
              .IO
            </span>
          </div>
        </Link>

        {/* <ul className='flex gap-8 items-center justify-center '>
        <Link to="/"><li className='font-semibold py-1 p-2 rounded filter  hover:brightness-120  transition-all duration-200 ' >Home</li></Link>
      </ul> */}

        <div className="flex gap-2">
          {!isLoggedin && (
            <Link to="/Login">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-500 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
              <CiLogin size={24} />
              </button>
            </Link>
          )}
          {!isLoggedin && (
            <Link to="/Register">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-500 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
                Sign up
              </button>
            </Link>
          )}

          {isLoggedin && (
            <Link to="/Login">
              <button
                className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-500 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 "
                onClick={onLogout}
              >
                <CiLogout size={24} />
              </button>
            </Link>
          )}
          {isLoggedin && (
            <Link to="/Dashboard">
              <button className="bg-white dark:bg-white/5 dark:hover:bg-white/10 text-blue-500 shadow-md font-semibold py-1 p-2 rounded hover:bg-white/90 transition-all duration-200 ">
              <CgProfile size={24} />
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
