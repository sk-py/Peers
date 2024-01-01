import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const Toggle = () => {
  const [DarkMode, setDarkMode] = useState("");
  const toggle = (e) => {
    var rootComp = document.getElementById("Switch");

    if (rootComp.classList.contains("dark")) {
      rootComp.classList.remove("dark");
      setDarkMode(false);
    } else {
      rootComp.classList.add("dark");
      setDarkMode(true);
    }
  };
  const navigate = useNavigate();
  return (
    <>
      <span className="-ml-2 px-2 rounded-r-2xl ">
        {!DarkMode ? "Light" : "Dark"}
      </span>
      <label
        title={`${DarkMode ? "Light Mode" : "Dark Mode"}`}
        className="my-1 inline-flex items-center z-50 cursor-pointer transform  "
      >
        <input
          type="checkbox"
          defaultValue=""
          className="sr-only peer "
          onChange={toggle}
        />
        <div className="w-11 h-6 bg-indigo-600 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
      </label>
    </>
  );
};

export default Toggle;
