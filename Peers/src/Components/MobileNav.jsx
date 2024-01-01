import React from "react";
import {
  IconMessageDots,
  IconUserBolt,
  IconUserSearch,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const MobileNav = () => {
  return (
    <div className="w-screen lg:hidden h-max z-20 sticky bottom-0 bg-slate-50 flex gap-2 justify-around p-1 text-purple-900">
      {/* <Link to={"/Auth"}> */}
      <div className="flex flex-col justify-center items-center">
        <IconUserBolt />
        Inbox
      </div>
      {/* </Link> */}
      <div className="flex flex-col justify-center items-center">
        <IconMessageDots />
        Chat
      </div>
      <div className="flex flex-col justify-center items-center">
        <IconUserSearch />
        Users
      </div>
    </div>
  );
};

export default MobileNav;
