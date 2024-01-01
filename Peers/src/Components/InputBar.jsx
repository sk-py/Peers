// import React, { useEffect, useState } from "react";
// import { IconSend, IconPaperclip, IconMoodSmile } from "@tabler/icons-react";
// import EmojiComp from "./EmojiPicker";
// import { io } from "socket.io-client";

// const InputBar = ({ messagesData, userData, socket }) => {
//   // useEffect(() => {
//   //   setSocket(io("http://localhost:8080"));
//   // }, []);
//   socket && console.log("socket from input", socket._callbacks);
//   const [message, setmessage] = useState("");
//   console.log("message from input", message);

//   const SenderData = JSON.parse(localStorage.getItem("user:Info"));
//   let convoId = "";
//   userData ? (convoId = userData.user.convoId) : (convoId = "");

//   const storeMessage = (e) => {
//     setmessage(e.target.value);
//   };
// //
//   const submitMessage = async (e) => {
//     e.preventDefault();
//     console.log("first", message.length);
//     if (message.length !== 0) {
//       console.log(SenderData.fullName, SenderData.email);
//       socket?.emit("sendMessage", {
//         conversationId: convoId,
//         senderId: SenderData.id,
//         fullName: SenderData.name,
//         email: SenderData.email,
//         message,
//       });
//       const response = await fetch("http://localhost:5000/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           conversationId: convoId,
//           senderId: SenderData.id,
//           message,
//         }),
//       });
//       setmessage("");
//       console.log(await response.json());
//     }
//   };
//   // console.log("Messagedata from input", messagesData);
//   const ShowEmojiComp = () => {
//     let emojiComp = document.getElementById("emojiComp");
//     emojiComp.classList.contains("hidden")
//       ? emojiComp.classList.remove("hidden")
//       : emojiComp.classList.add("hidden");
//   };

//   return (
//     <>
//       <EmojiComp setmessage={setmessage} message={message} />
//       <form onSubmit={submitMessage} className="relative">
//         <div
//           className={`${
//             messagesData[0] === null ? "hidden" : ""
//           } w-full dark:bg-slate-700 bg-violet-100 p-[0.7%] flex items-center justify-between sticky bottom-0`}
//         >
//           <div className="text-indigo-500 dark:text-indigo-400 flex flex-row items-center justify-around lg:w-[8%] w-[8%]">
//             {/* <EmojiComp className="absolute top-[-20%]" /> */}
//             <IconMoodSmile
//               className="w-[40%] h-[40%] cursor-pointer"
//               onClick={ShowEmojiComp}
//             />
//           </div>
//           <input
//             type="text"
//             placeholder="Type a message..."
//             onChange={storeMessage}
//             value={message}
//             className="lg:w-[100%] w-[80%] p-2 rounded-lg border-2 focus:border-blue-600 dark:focus:border-blue-700 dark:caret-white dark:border-gray-500 outline-none dark:text-white dark:bg-[#2a3942]"
//           />
//           <div className="text-indigo-500 dark:text-indigo-400 flex flex-row items-center justify-around lg:w-[15%] w-[20%]">
//             <IconSend className="cursor-pointer" onClick={submitMessage} />
//             <IconPaperclip className="cursor-pointer" />
//             {/* <IconCirclePlus className="cursor-pointer" /> */}
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default InputBar;
