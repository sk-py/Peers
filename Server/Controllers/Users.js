const users = require("../Models/Users");
const uploadOnCloudinary = require("../Utils/Cloudinary");

const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.params.name;
    const regex = new RegExp(searchQuery, "i");
    // console.log(regex);
    const UsersList = await users.find({ fullName: { $regex: regex } });
    const Users = await UsersList.map((user) => {
      return {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profileUrl: user.profileUrl,
          //Profile Pic And Other Details Will Come Here While Searching Except Password
        },
      };
    });
    res.json(Users);
  } catch (error) {
    console.log("Error from search script /users/:name :", error.message);
  }
};

const uploadProfile = async (req, res) => {
  const userId = req.params.userId;
  const fileName = req.file.filename;
  const localFilePath = `./uploads/${fileName}`;
  console.log("local file path = ", localFilePath);
  console.log("fileName", fileName, "UserID :" + userId);
  try {
    const cloudUrl = await uploadOnCloudinary(localFilePath);
    console.log("cloudurl :", cloudUrl);
    try {
      const uploaded = await users.findOneAndUpdate(
        { _id: userId },
        { profileUrl: cloudUrl },
        { new: true }
      );
      console.log("upload", uploaded);
      const profileUrl = uploaded.profileUrl;
      res.status(200).json(profileUrl);
    } catch (error) {
      console.log("Error from /api/upload : ", error.message);
    }
  } catch (error) {
    console.log("Error from uploadOnCloudinary", error.message);
  }
};

const getProfileImage = async (req, res) => {
  const userId = req.params.userId;
  try {
    const image = await users.findOne({ _id: userId });
    const { password, token, ...restDetails } = image;
    res.status(200).json(restDetails);
  } catch (error) {
    console.log("Error from /getprofile/:userId: ", error.message);
  }
};

module.exports = { searchUsers, uploadProfile, getProfileImage };
