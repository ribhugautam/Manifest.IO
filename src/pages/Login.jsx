import React from "react";
import { useState } from "react";
import { account } from "../appwrite/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedin = props.setIsLoggedin;
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const login = async () => {
    toast.loading("Logging in...",{className:"dark:bg-[#070F2B] dark:text-white"});
    try {
      const user = await account.createEmailSession(email, password);
      toast.success("Logged in successfully",{className:"dark:bg-[#070F2B] dark:text-white"});
      setIsLoggedin(true);
      navigate("/Dashboard");
    } catch (error) {
      toast.error("Invalid email or password",{className:"dark:bg-[#070F2B] dark:text-white"});
      console.log(error);
    }
    toast.dismiss();
  };

  return (
    <div className="flex flex-col items-center p-8 justify-center h-full dark:bg-[#070F2B] dark:text-white bg-gray-100">

      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-white/5 shadow-md rounded-lg p-8"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-white font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
              className="appearance-none dark:bg-transparent ring-blue-500 ring rounded-lg w-full py-1 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-8">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-white font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
              className="appearance-none dark:bg-transparent ring-blue-500 ring rounded-lg w-full py-1 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-2 shadow-md rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
            <a
              href="#"
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default Login;
