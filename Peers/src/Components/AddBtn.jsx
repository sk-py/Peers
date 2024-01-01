import React from "react";
import { IconUsersPlus } from "@tabler/icons-react";
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

const AddBtn = () => {
  return (
    <div
      onClick={ProfileToggle}
      className="bg-indigo-500 text-white absolute bottom-20 right-2 h-max rounded-full"
    >
      <div className="p-5">
        <IconUsersPlus />
      </div>
    </div>
  );
};

export default AddBtn;
