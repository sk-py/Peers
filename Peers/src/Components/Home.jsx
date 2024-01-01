import React, { useEffect, useState } from "react";
import Inbox from "./Inbox";
import Chat from "./Chat";
import Profiles from "./Profiles";
import Toggle from "./Toggle";
import { io } from "socket.io-client";
import { Toaster } from "sonner";
import bgimg from "../assets/bgimg.png";
const Home = () => {
  // const loggedInUser = JSON.parse(localStorage.getItem("user:Info"));
  const [messagesData, setmessagesData] = useState([null]);
  const [userData, setUserData] = useState("");
  console.log("messagesData", messagesData);
  // const [socket, setSocket] = useState(null);
  // const [UserArray, setUserArray] = useState([]);

  // useEffect(() => {
  //   setSocket(io("http://localhost:8080"));
  // }, []);

  // useEffect(() => {
  //   socket?.emit("addUser", loggedInUser.id);
  //   socket?.on("availableUsers", (usersArray) => {
  //     console.log("usersArray", usersArray);
  //     setUserArray(usersArray);
  //   });
  // }, [socket]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWindowSize = () => {
      setIsMobile(window.innerWidth <= 1150);
    };

    checkWindowSize();

    window.addEventListener("resize", checkWindowSize);

    return () => {
      window.removeEventListener("resize", checkWindowSize);
    };
  }, []);

  return (
    <>
      <Toaster richColors position="top-center" />
      {isMobile ? (
        <span className="h-[90vh] w-full flex items-center justify-center text-center relative">
          <p className="z-10 w-[90%] font-poppins font-medium  text-xl bg-white dark:bg-indigo-950 dark:text-white p-2 py-4 shadow-xl shadow-slate-300 dark:shadow-slate-500 rounded-lg">
            Dear mobile users, our web app is currently on a desktop-only
            vacation due to a time inconsistency situation. Your screens deserve
            a holiday too! Stay tuned, and we might bring the sun to your mobile
            shores in the future. 🌞💻
          </p>
          <img
            src={bgimg}
            alt="Background Image"
            className="absolute -z-1 top-1 blur-[6px] h-screen"
          />
        </span>
      ) : (
        <div className="w-screen m-auto flex items-center justify-center dark:bg-cyan-950 dark:text-white">
          <Inbox
            setmessagesData={setmessagesData}
            setUserData={setUserData}
            // UserArray={UserArray}
          />
          <Chat
            setmessagesData={setmessagesData}
            messagesData={messagesData}
            userData={userData}
          />
          <Profiles />
        </div>
      )}
    </>
  );
};

export default Home;
