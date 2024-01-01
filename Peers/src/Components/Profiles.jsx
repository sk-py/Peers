import React, { useState, useEffect } from "react";
import PP from "../assets/Logo.png";
import { IconMessage2Plus, IconSearch } from "@tabler/icons-react";
import { IconX } from "@tabler/icons-react";
import { Toaster, toast } from "sonner";
const Profiles = () => {
  const UserData = JSON.parse(localStorage.getItem("user:Info"));

  const [SearchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  const [usersList, setusserList] = useState([]);
  const [searchCount, setSearchCount] = useState(0);
  const FetchUsers = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/users/${SearchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await response.json();
    setusserList(res);
    setSearchCount(searchCount + 1);
  };
  useEffect(() => {
    const FetchUsers = async () => {
      // e.preventDefault();
      const response = await fetch(
        `http://localhost:5000/users/${SearchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const res = await response.json();
      setusserList(res);
      setSearchCount(searchCount + 1);
    };
    SearchQuery.length !== 0 && FetchUsers();
  }, [SearchQuery]);

  // const addFriend = async (receiverId) => {

  // };

  const sendRequest = async (receiverId, receiverName) => {
    const senderId = UserData.id;
    const senderName = UserData.name;
    console.log(
      "senderId",
      senderId,
      senderName + "And" + receiverId,
      receiverName
    );
    try {
      const res = await fetch("http://localhost:5000/api/request/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId,
          senderName,
          receiverId,
          receiverName,
        }),
      });
      if (res.status === 400) {
        toast.info("Already present or requested");
      }
      if (res.ok) {
        // console.log("Request sent successfully");
        toast.success("Request sent");
      }
    } catch (error) {
      console.log("Error : ", error.message);
    }
  };

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
      setSearchCount(0);
      setusserList([]);
      setSearchQuery("");
    }
  };
  // console.log("SearchCount", searchCount);
  // console.log("SearchQuery", SearchQuery.length);
  // console.log("UserList", usersList.length);
  return (
    <div
      id="ProfileSection"
      className="h-screen transform -translate-x-full bg-violet-50 dark:text-white dark:bg-gray-900 lg:flex flex-col font-roboto transition-all duration-200"
    >
      <div className=" dark:bg-slate-700 bg-violet-100 flex items-center p-2 gap-1">
        <form
          className="flex w-full bg-white rounded-xl overflow-hidden flex-row items-center h-max  dark:bg-[#2a3942]  dark:caret-white"
          onSubmit={FetchUsers}
        >
          <IconSearch className="ml-4" />
          <input
            type="search"
            required={true}
            value={SearchQuery}
            placeholder="Search By Name"
            className="indent-2 p-2  w-full bg-white  dark:caret-white dark:border-gray-500 outline-none dark:text-white dark:bg-[#2a3942]"
            onChange={handleSearch}
          />
        </form>
        <IconX onClick={ProfileToggle} className="cursor-pointer" />
      </div>
      <div className="text-black dark:text-white flex  flex-col">
        {usersList.length !== 0 && SearchQuery.length > 0 ? (
          usersList.map((users) => {
            const receiverId = users.user.id;
            const receiverName = users.user.fullName;
            return (
              <div
                key={users.user.id}
                className="flex items-center gap-2 border-gray-200 border-b-[1px] text-black dark:text-white dark:border-gray-800 p-1  hover:bg-violet-100 dark:hover:bg-slate-800"
              >
                <div className="lg:w-[15%] h-[80px] object-cover flex items-center">
                  <img
                    src={PP}
                    alt="Profile Picture"
                    className=" w-full h-[90%] rounded-[50%] object-cover"
                  />
                </div>
                <div className="w-[65%]">
                  <h1>{users.user.fullName}</h1>
                  {/* {true ? (
                  <IconActivityHeartbeat className="text-green-500" />
                ) : (
                  <IconMinus className="text-gray-800 dark:text-gray-400" />
                )} */}
                </div>
                <div className="w-[20%] text-center pr-4">
                  {UserData.id !== receiverId && (
                    <IconMessage2Plus
                      className="cursor-pointer text-violet-700 hover:scale-110 dark:hover:text-violet-100 "
                      onClick={() => sendRequest(receiverId, receiverName)}
                    />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-40 flex items-center justify-center cursor-auto text-black dark:text-white">
            {SearchQuery.length !== 0 ||
            (SearchQuery.length === 0 &&
              searchCount !== 0 &&
              usersList.length === 0)
              ? "No results matched your search"
              : ""}
          </div>
        )}
      </div>
    </div>
  );
};
export default Profiles;
