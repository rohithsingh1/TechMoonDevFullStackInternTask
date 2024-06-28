"use client";

import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { setToken, setUser, clearAuth } from "@/redux/auth/auth.slice";
import useAuthSession from "../hooks/useAuthSession";
import { useAppDispatch } from "@/redux/store";
import axios from "axios";

const HomePage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const user = useAuthSession();

  const handleLogin = async () => {
    // Implement the logic to authenticate the user
    try {
      const loginData = {
        email: username,
        password: password,
      };
      const response = await axios.post(
        `http://localhost:5000/api/users/login`,
        loginData
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        dispatch(setUser({ username: response.data.data.email }));
        toast.success(response.data.message);
      } else {
        dispatch(clearAuth());
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log("error = ", error);
      dispatch(clearAuth());
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
    return regex.test(email) || email.length === 0;
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    console.log("regex.test(password)", regex.test(password));
    return regex.test(password) || password.length === 0;
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          {user ? (
            <div>
              <h2 className="text-xl font-bold">Welcome, {user.username}</h2>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-center">Login</h2>
              <input
                type="email"
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2 mt-4 border rounded-md"
                required
              />
              {!validateEmail(username) && (
                <p className="validate">Please Enter the valid Email Address</p>
              )}
              <input
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-2 mt-4 border rounded-md"
                required
              />
              {!validatePassword(password) && (
                <p className="validate">
                  Password should be minimum 8 characters long, should have
                  atleast one uppercase, one lowercase, one interger and one
                  special character
                </p>
              )}
              <button
                onClick={handleLogin}
                className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
              >
                Login
              </button>
            </div>
          )}
          <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
            <h3 className="text-lg font-semibold">
              The hook should be usable like this:{" "}
            </h3>
            <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
              <code>
                {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
