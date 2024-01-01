import { IconEditCircle, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import PP from "../assets/Logo.png";
import { IconEdit } from "@tabler/icons-react";
const Profilepage = ({ SetProfileSec }) => {
  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("user:Info"))
  );
  useEffect(() => {
    const blockDiv = document.getElementById("blockDiv");
    blockDiv.classList.contains("flex") &&
      blockDiv.classList.replace("flex", "hidden");
  }, []);

  // const profileUpload = async () => {
  //     e.preventdefault();
  //     try {
  //         const res = await fetch('http://localhost:5000/api/upload', {
  //             method: 'POST',
  //             headers: {
  //                 "Content-Type": "multipart-formData",

  //             }
  //         })
  //     } catch (error) {

  //     }
  // }

  return (
    <div className="w-screen h-screen absolute bg-slate-800 bg-opacity-70 z-50 flex items-center justify-center">
      <div className="flex flex-col bg-white p-2 w-[50%] mb-10 -mt-10 rounded-md">
        <span
          onClick={() => {
            SetProfileSec(false);
          }}
          className="z-50 cursor-pointer w-full flex items-center justify-end float-right"
        >
          <p>
            <IconX />
          </p>
        </span>
        <div className="w-full">
          <form className="flex flex-col w-full">
            <span className="w-full flex items-center justify-center">
              <label htmlFor="ImgInput" className="relative">
                <img
                  className="cursor-pointer rounded-xl"
                  src={PP}
                  alt="Profile Image"
                />
                <IconEdit className="absolute -top-1 left-52 cursor-pointer" />
              </label>
              <input
                type="file"
                name="ImgInput"
                id="ImgInput"
                className="hidden"
              />
            </span>
            <span className=" flex flex-row w-full items-center justify-center gap-8 py-6">
              <p className="text-lg font-roboto border-b-2 cursor-not-allowed ">
                {user.name}
              </p>
              <p className="text-lg font-roboto border-b-2 cursor-not-allowed">
                {user.email}
              </p>
            </span>
            <span className="w-full text-center p-2">
              <button
                // onClick={() => profileUpload}
                className="bg-indigo-600 w-fit p-1 px-3 rounded-md text-white"
              >
                Save
              </button>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
