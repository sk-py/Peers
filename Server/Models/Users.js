const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileUrl: {
      type: String,
    },
    status: {
      type: String,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const users = mongoose.model("users", userSchema);

module.exports = users;
