import React, { useState } from "react";
import Linkify from "react-linkify";
// import PP from "../assets/IMG_20220910_001309-removebg-preview.png";
const Message = ({ messageTxt, sendersId, messageId }) => {
  let from = null;
  const [senderId, setsenderId] = useState(
    JSON.parse(localStorage.getItem("user:Info"))
  );
  sendersId == senderId.id ? (from = true) : (from = false);
  // const containsLink = (messageTxt) => {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g;
  //   return urlRegex.test(messageTxt);
  // };

  return (
    <div className="w-full flex">
      <div
        className={`flex relative lg:max-w-[55%] max-w-[80%] items-end gap-2 m-1 mb-2 ${
          from ? "ml-auto" : ""
        }`}
      >
        {/* <label htmlFor="select">&darr;</label> */}

        {/* <img
          src={PP}
          alt="Profile Picture"
          className={`${
            from ? "order-1" : "order 2"
          } lg:w-10 lg:h-10 w-8 h-8 rounded-full `}
        /> */}
        <Linkify>
          <div
            className={`rounded-xl text-sm ${
              from
                ? "rounded-br-none bg-blue-600 text-white custom-linkStyles2"
                : "rounded-bl-none bg-slate-200 dark:bg-slate-600 custom-linkStyles"
            } p-2  `}
          >
            {messageTxt}
          </div>
        </Linkify>
      </div>
    </div>
  );
};

export default Message;
