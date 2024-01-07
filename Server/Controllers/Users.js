const users = require("../Models/Users");

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

  console.log("fileName", fileName, "UserID :" + userId);
  try {
    const uploaded = await users.findOneAndUpdate(
      { _id: userId },
      { profileUrl: fileName },
      { new: true }
    );
    console.log("upload", fileName);
    res.status(200).json(fileName);
  } catch (error) {
    console.log("Error from /api/upload : ", error.message);
  }
};

const getProfileImage = async (req, res) => {
  const userId = req.params.userId;
  try {
    const image = await users.findOne({ _id: userId });
    res.status(200).json(image);
  } catch (error) {
    console.log("Error from /api/upload : ", error.message);
  }
};

module.exports = { searchUsers, uploadProfile, getProfileImage };
