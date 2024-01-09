const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require("dotenv");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //* uploading the file on cloudinary
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    //* After the file is uploaded successfully
    console.log("Uploaded on cloudinary", res.url);
    fs.unlinkSync(localFilePath);
    return res.url;
  } catch (error) {
    fs.unlinkSync(localFilePath); //removing the locally saved file if the uploading process gets failed
    return null;
  }
};

module.exports = uploadOnCloudinary;
