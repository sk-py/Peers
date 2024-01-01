import React, { useEffect, useRef, useState } from "react";
import PP from "../assets/Logo.png";
import EmojiComp from "./EmojiPicker";
import {
  IconPhone,
  IconVideoPlus,
  IconPointFilled,
  IconSend,
  IconPaperclip,
  IconMoodSmile,
} from "@tabler/icons-react";
import Message from "./Message";
// import InputBar from "./InputBar";
import { io } from "socket.io-client";

const Chat = ({ messagesData, setmessagesData, userData }) => {
  const loggedInUser = JSON.parse(localStorage.getItem("user:Info"));
  const [socketMessages, setsocketMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [UserArray, setUserArray] = useState([]);
  const [message, setmessage] = useState("");

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);
  // console.log("socket from chat", socket);
  useEffect(() => {
    socket?.emit("addUser", loggedInUser.id);
    socket?.on("getUsers", (usersArray) => {
      console.log("usersArray from chats", usersArray[0]);
      setUserArray(usersArray);
    });
    socket?.on(
      "getMessage",
      async ({ message: message2, senderId, fullName, email }) => {
        console.log(message2, senderId, fullName);
        const newMessage = {
          message: message2,
          user: {
            id: senderId,
            fullName: fullName,
            email: email,
          },
        };

        setmessagesData((prev) => [...prev, newMessage]);
      }
    );
  }, [socket]);
  // console.log("usersArray from chats 2nd one", UserArray);

  const scrollDiv = useRef(null);
  useEffect(() => {
    scrollDiv.current?.scrollIntoView();
    console.log("messagesdata :", messagesData);
  }, [messagesData]);

  const ProfileToggle = () => {
    const profileSec = document.getElementById("ProfileSection");
    if (profileSec.classList.contains("-translate-x-full")) {
      profileSec.classList.remove("opacity-0");
      profileSec.classList.remove("-translate-x-full");
      profileSec.classList.add("w-[30%]");
    } else {
      profileSec.classList.add("-translate-x-full");
      profileSec.classList.add("opacity-0");
      profileSec.classList.remove("w-[30%]");
    }
  };
  // console.log("UserData from Chats :", userData);
  // console.log("messagesData", messagesData);

  let convoId = "";
  userData ? (convoId = userData.user.convoId) : (convoId = "");

  //* Input bar functionality code
  const storeMessage = (e) => {
    setmessage(e.target.value);
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    socket?.emit("sendMessage", {
      conversationId: convoId,
      senderId: loggedInUser.id,
      fullName: loggedInUser.name,
      email: loggedInUser.email,
      message,
    });
    if (message.length > 0) {
      const response = await fetch("http://localhost:5000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: convoId,
          senderId: loggedInUser.id,
          message,
        }),
      });
      setmessage("");
      console.log(await response.json());
    }
  };

  const ShowEmojiComp = () => {
    let emojiComp = document.getElementById("emojiComp");
    emojiComp.classList.contains("hidden")
      ? emojiComp.classList.remove("hidden")
      : emojiComp.classList.add("hidden");
  };

  //*

  return (
    <div className="lg:w-[56%] w-screen h-screen bg-purple-50 dark:bg-[#111b21] overflow-hidden z-10">
      <div
        className={`w-full h-[9%] flex justify-center relative ${
          messagesData[0] === null ? "hidden" : ""
        }`}
      >
        <div className="w-[90%] bg-violet-200 dark:bg-gray-700 rounded-full p-3 flex items-center justify-between mt-3 absolute">
          <div className="flex items-center">
            <img
              src={PP}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full object-cover"
            />{" "}
            <div className="ml-2">
              <h1>{userData && userData.user.chat.user.fullName}</h1>

              {true ? (
                <div className="flex">
                  Online
                  <IconPointFilled className="text-green-500" />
                </div>
              ) : (
                <div className="flex">
                  <IconPointFilled className="text-gray-500" />
                  Offline
                </div>
              )}
            </div>
          </div>
          <div className="p-2 flex items-center justify-between gap-x-5 mr-3">
            <IconPhone className="cursor-pointer" />
            <IconVideoPlus className="cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="px-2 w-full h-[85vh] overflow-scroll relative scrollbar-thin">
        {/* <Message from={true} />
        <Message from={false} /> */}
        {
          /* <Message from={true} />
        <Message from={false} />
        <Message from={true} /> */

          messagesData !== 0 ? (
            messagesData[0] !== null ? (
              messagesData.map((message, index) => {
                return (
                  <Message
                    key={index}
                    messageTxt={message.message}
                    sendersId={message.user.id}
                    messageId={message.messageId}
                  />
                );
              })
            ) : (
              <div className="text-center flex items-center h-full justify-center">
                Select a chat or
                <span
                  className="text-blue-600 px-1 cursor-pointer"
                  onClick={ProfileToggle}
                >
                  {" "}
                  Add new friends{" "}
                </span>{" "}
                to start messaging
              </div>
            )
          ) : (
            <div className="text-center flex items-center h-full justify-center">
              No chats yet. Start a new conversation!
            </div>
          )
        }
        <div ref={scrollDiv} />
      </div>
      {/* <InputBar
        messagesData={messagesData}
        userData={userData}
        socket={socket}
      /> */}
      <>
        <EmojiComp setmessage={setmessage} message={message} />
        <form onSubmit={submitMessage} className="relative">
          <div
            className={`${
              messagesData[0] === null ? "hidden" : ""
            } w-full dark:bg-slate-700 bg-violet-100 p-[0.7%] flex items-center justify-between sticky bottom-0`}
          >
            <div className="text-indigo-500 dark:text-indigo-400 flex flex-row items-center justify-around lg:w-[8%] w-[8%]">
              {/* <EmojiComp className="absolute top-[-20%]" /> */}
              <IconMoodSmile
                className="w-8 h-8 cursor-pointer"
                onClick={ShowEmojiComp}
              />
            </div>
            <input
              type="text"
              placeholder="Type a message..."
              onChange={storeMessage}
              value={message}
              className="lg:w-[100%] w-[80%] p-2 rounded-lg border-2 focus:border-blue-600 dark:focus:border-blue-700 dark:caret-white dark:border-gray-500 outline-none dark:text-white dark:bg-[#2a3942]"
            />
            <div className="text-indigo-500 dark:text-indigo-400 flex flex-row items-center justify-around lg:w-[15%] w-[20%]">
              <IconSend className="cursor-pointer" onClick={submitMessage} />
              <IconPaperclip className="cursor-pointer" />
              {/* <IconCirclePlus className="cursor-pointer" /> */}
            </div>
          </div>
        </form>
      </>
    </div>
  );
};

export default Chat;
