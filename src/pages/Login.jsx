import React from "react";
import { useState } from "react";
import { account } from "../appwrite/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedin = props.setIsLoggedin;

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  const login = async () => {
    try {
      const user = await account.createEmailPasswordSession(email, password);
      toast.success("Logged in successfully");
      setIsLoggedin(true);
      navigate("/Dashboard");
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex flex-col items-center px-8 justify-center h-full bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-8"
        >
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
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
              className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
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
              className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
