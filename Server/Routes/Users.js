const express = require("express");
const {
  searchUsers,
  uploadProfile,
  getProfileImage,
} = require("../Controllers/Users");
const { upload } = require("../Middlewares/Multer");
const router = express.Router();

router.get("/users/:name", searchUsers);

router.post("/api/upload/:userId", upload.single("ImgInput"), uploadProfile);

router.get("/getprofile/:userId", getProfileImage);

module.exports = router;
