import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import logImage from "../assets/image.png";
import { Link, useNavigate } from "react-router-dom";

import { GoogleLogin } from "@react-oauth/google";
// import Cookies from "js-cookie";

const Auth = ({ isSignInPage }) => {
  const initialVal = {
    ...(!isSignInPage && { fullName: "" }),
    email: "",
    password: "",
  };
  const [data, setData] = useState(initialVal);

  const handleData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `http://localhost:5000/${!isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const resData = await response.json();
    response.status === 201 && navigate("/Signin");
    if (response.status === 400) {
      setErrorMessage(resData.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
    const authToken = resData.token;
    if (authToken) {
      localStorage.setItem("userToken", null);
      localStorage.setItem("user:Info", JSON.stringify(resData.user));
      navigate("/");
    }
    setData(initialVal);
  };

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <div className="bg-[#ffffff] dark:bg-slate-800 dark:text-slate-200 h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className=" w-[550px] h-[750px] rounded-lg flex justify-center items-center flex-col gap-5 mb-10 shadow-2xl dark:shadow-none"
      >
        <div className="w-full text-center dark:text-white">
          <p className="text-xl font-semibold">
            Welcome!{!isSignInPage && " Back "} To
          </p>
        </div>
        <div className="flex items-end gap-2">
          <img src={logImage} alt="" className="w-14 h-14 object-contain" />

          <h1 className="text-5xl font-poppins font-extrabold text-teal-900 dark:text-slate-100 ">
            Peers
          </h1>
        </div>
        <p className="mb-2">
          Sign {!isSignInPage ? "In" : "Up"} To Get Started
        </p>
        <div className="w-full flex items-center justify-center flex-col gap-5">
          {isSignInPage && (
            <input
              type="text"
              placeholder="Full Name"
              name="fullName"
              id="fullName"
              required={true}
              value={data.fullName || ""}
              className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:border-none block w-8/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleData}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            required={true}
            value={data.email}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-8/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={handleData}
          />
          <input
            type="Password"
            placeholder="Password"
            name="password"
            id="password"
            required={true}
            value={data.password}
            onChange={handleData}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-8/12 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-200 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <div className="w-full flex items-center justify-center flex-col gap-1">
            <span className="text-red-600">{errorMessage}</span>
            <button
              className="bg-blue-600 text-white p-2 rounded-lg w-1/4 "
              type="submit"
            >
              Sign {!isSignInPage ? "In" : "Up"}
            </button>
            <h1 className="text-lg font-semibold">OR</h1>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const UserData = jwtDecode(credentialResponse.credential);
                UserData.email_verified == true
                  ? (window.location.href = "/")
                  : console.log("UnVerified");
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>
        </div>

        {!isSignInPage ? (
          <span>
            Not Registered Yet?&nbsp;
            <Link className="text-blue-600" to="/Auth">
              Sign Up
            </Link>
          </span>
        ) : (
          <span>
            Already Have An Account?&nbsp;
            <Link className="text-blue-700" to="/">
              Sign In
            </Link>
          </span>
        )}
      </form>
    </div>
  );
};

export default Auth;
