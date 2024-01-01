import React, { useEffect, useState } from "react";
import PP from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import {
  IconBellRinging,
  IconMinus,
  IconActivityHeartbeat,
  IconMessage2Bolt,
  IconDotsVertical,
  IconLogout,
  IconLogout2,

  // IconMessageCircleBolt,
} from "@tabler/icons-react";
import { toast } from "sonner";
import AddBtn from "./AddBtn";
import Toggle from "./Toggle";
import { IconUserCircle } from "@tabler/icons-react";
import Profilepage from "./Profilepage";
const Inbox = ({ setmessagesData, setUserData }) => {
  // console.log("Users Array from inbox", UserArray);
  const [RequestDiv, setRequestDiv] = useState(false);
  const [ProfileSec, SetProfileSec] = useState(false);
  const [FriendRequests, setFriendRequests] = useState([]);
  const [Refresh, setRefresh] = useState(false);
  const [user, setuser] = useState(
    JSON.parse(localStorage.getItem("user:Info"))
  );
  const [chats, setchats] = useState([]);
  const navigate = useNavigate();

  // console.log(FriendRequests);
  const fetchChats = async () => {
    const response = await fetch(`http://localhost:5000/chats/${user?.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resData = await response.json();
    setchats(resData);
    // console.log("chats", chats);
  };

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/request/display/${user?.id}`
      );
      const requests = await res.json();
      setFriendRequests(requests);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchRequests();
    fetchChats();
  }, [, Refresh]);

  // const [messages, setmessages] = useState([]);
  const fetchMessages = async (convoID, SpecificUserData) => {
    const MsgRes = await fetch(`http://localhost:5000/messages/${convoID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const MessagesData = await MsgRes.json();
    console.log("MessagesData", MessagesData);
    setmessagesData(MessagesData);
    setUserData(SpecificUserData);
    // console.log("SpecificUserData", SpecificUserData);

    // console.log("MessagesData", MessagesData);
    // console.log(messages);
  };
  console.log("Friend req", FriendRequests);
  const handleFriendRequest = async (e, senderId, requestId) => {
    const action = e.target.value;
    // console.log(action);
    try {
      const response = await fetch("http://localhost:5000/newchat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: senderId,
          action,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data);
        setFriendRequests(
          FriendRequests.filter((request) => {
            return request._id !== requestId;
          })
        );
      }

      // console.log(response.json());
    } catch (error) {
      console.log("Error : ", error.message);
    }
  };

  // console.log(RequestDiv);

  return (
    <div
      id="inbox"
      className="lg:w-[30%] h-screen bg-violet-50 dark:bg-gray-900 lg:flex flex-col font-roboto w-[100%] rounded overflow-hidden  "
    >
      <div className="flex items-center relative justify-between gap-2 bg-violet-200 dark:bg-gray-700 p-2 rounded">
        <div
          className="flex items-center px-4 gap-2 cursor-pointer"
          onClick={() => {
            SetProfileSec(!ProfileSec);
          }}
        >
          <img
            src={PP}
            alt="Profile Picture"
            className="lg:w-14 lg:h-14 w-10 h-10 object-cover rounded-[50%]"
          />
          <h1>
            {user?.name}
            <br />
            {user?.email}
          </h1>
        </div>
        <span className="relative w-fit flex flex-row-reverse">
          <span className="relative">
            <IconDotsVertical
              className="cursor-pointer"
              onClick={() => {
                const blockDiv = document.getElementById("blockDiv");
                blockDiv.classList.contains("hidden")
                  ? blockDiv.classList.replace("hidden", "flex")
                  : blockDiv.classList.replace("flex", "hidden");
              }}
            />
            <div
              id="blockDiv"
              className="absolute top-6 right-4 hidden dark:bg-gray-800 dark:text-white z-10 dark:divide-cyan-800 divide-y  bg-white flex-col  w-40 items-center justify-center rounded"
            >
              <span
                onClick={() => {
                  SetProfileSec(!ProfileSec);
                }}
                className="flex flex-row gap-x-2 cursor-pointer dark:text-white p-2 items-center dark:hover:bg-gray-600 hover:bg-slate-200 w-full justify-center text-black"
              >
                <IconUserCircle /> Profile
              </span>
              <span className="flex flex-row gap-x-2 cursor-pointer dark:text-white p-2 items-center dark:hover:bg-gray-600 hover:bg-slate-200 w-full justify-center text-black">
                <Toggle />
              </span>
              <span
                className="flex flex-row gap-x-2 items-center cursor-pointer dark:text-white p-2 hover:bg-slate-200 dark:hover:bg-gray-600 w-full justify-center text-black"
                onClick={() => {
                  localStorage.removeItem("userToken");
                  navigate("/SignIn");
                }}
              >
                <IconLogout className="my-1" />
                Logout
              </span>
            </div>
          </span>
          {RequestDiv ? (
            <IconMessage2Bolt
              onClick={() => {
                setRequestDiv(!RequestDiv);
                setRefresh(!Refresh);
              }}
              className="cursor-pointer  dark:text-indigo-200  text-indigo-800 mr-4"
            />
          ) : (
            <IconBellRinging
              onClick={() => {
                setRequestDiv(!RequestDiv);
                setRefresh(!Refresh);
              }}
              className="cursor-pointer  dark:text-indigo-200  text-indigo-800 mr-4"
            />
          )}
          {FriendRequests.length !== 0 && (
            <span
              className={`${
                !RequestDiv ? "flex" : "hidden"
              } absolute -top-2 right-2 items-center justify-center h-4 w-4 dark:bg-blue-600 bg-blue-800 rounded-full text-xs text-white `}
            >
              {FriendRequests.length}
            </span>
          )}
        </span>
      </div>
      <h1 className="flex flex-row ml-2 gap-1 items-center p-2 font-semibold text-purple-700 dark:text-slate-300">
        {RequestDiv ? "New requests" : "Inbox"}
        {/* <IconMessageCircleBolt className="w-[20px]" /> */}
      </h1>
      {ProfileSec && <Profilepage SetProfileSec={SetProfileSec} />}
      {!RequestDiv ? (
        <div className="flex p-2 h-full flex-col overflow-y-scroll relative scrollbar cursor-pointer border-r-2 dark:border-gray-500">
          {chats.length < 1 ? (
            <div className="h-[80%] flex items-center justify-center cursor-auto">
              Start a new conversation by adding a friend.
            </div>
          ) : (
            chats.map((chat, index) => {
              const convoId = chat.conversationId;
              console.log("chat", chat);
              const SpecificUserData = { user: { chat, convoId } };
              let user_Id = user.id;
              // let isPresent = UserArray.find((user) => user.userId === user_Id);
              return (
                <span
                  onClick={() => {
                    fetchMessages(convoId, SpecificUserData);
                  }}
                  key={chat._id}
                  className="w-full flex flex-row items-center justify-between border-gray-200 border-b-[1px] dark:border-gray-800 p-2 hover:bg-violet-100 dark:hover:bg-slate-800"
                >
                  <span className="h-full flex items-center">
                    <img
                      src={PP}
                      alt="Profile Picture"
                      className="lg:w-16 lg:h-16 w-10 h-10 object-cover rounded-[50%]"
                    />
                  </span>
                  <span className="w-[85%] flex items-center justify-between">
                    <span className="flex flex-col">
                      <p>{chat.user.fullName}</p>
                      <p className="text-gray-500">{chat.user.email}</p>
                    </span>
                  </span>
                </span>
              );
            })
          )}
          <AddBtn />
        </div>
      ) : (
        <div className="h-full ">
          {/* Actual profile card */}
          {RequestDiv &&
            FriendRequests.map((req) => {
              return (
                <span
                  key={req._id}
                  className="w-full flex flex-row items-center justify-between p-2"
                >
                  <span className="h-full flex items-center">
                    <img
                      src={PP}
                      alt="Profile Picture"
                      className="lg:w-16 lg:h-16 w-10 h-10 object-cover rounded-[50%]"
                    />
                  </span>
                  <span className="w-[85%] flex items-center justify-between">
                    <span className="flex flex-col">
                      <p>{req.senderName}</p>
                      <p className="text-gray-500 text-sm">
                        Sent you a friend request
                      </p>
                    </span>
                    <span className="flex flex-col lg:flex-row gap-x-4 gap-y-1">
                      <button
                        onClick={(e) =>
                          handleFriendRequest(e, req.senderId, req._id)
                        }
                        value={"Dismiss"}
                        className="dark:bg-white bg-slate-300  font-medium text-black p-1 px-2 rounded text-sm"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={(e) =>
                          handleFriendRequest(e, req.senderId, req._id)
                        }
                        value={"Accept"}
                        className="bg-blue-600 font-medium text-white p-1 px-2 rounded text-sm"
                      >
                        Accept
                      </button>
                    </span>
                  </span>
                </span>
              );
            })}
          {FriendRequests.length === 0 && (
            <span className="h-[70%] text-center w-full flex items-center justify-center">
              No new requests
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Inbox;
