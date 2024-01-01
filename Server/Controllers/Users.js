const Users = require("../Models/Users");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

async function handleUserSignUp(req, res, next) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).send("All The Fields Are Required \n Please Fill Them.");
    } else {
      const AlreadyExists = await Users.findOne({ email });
      if (AlreadyExists) {
        res.status(400).send("User Already Exists");
      } else {
        const newUser = new Users({
          fullName,
          email,
        });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
      }
      return res.status(201).send("User Created");
    }
  } catch (error) {}
}

async function handleUserLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("All The Fields Are Required \n Please Fill Them.");
    } else {
      const validated = await bcryptjs.compare(password, Users.password);
      if (!validated) {
        res
          .status(400)
          .send("Wrong Email Or Password \n Please Enter Correct One's");
      } else {
        res.status(200).json({ status: "OK" });
        //   res.redirect("/Chat");
        next();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
