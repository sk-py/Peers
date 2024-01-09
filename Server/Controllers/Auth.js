const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const users = require("../Models/Users");

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({
        message: "All the fields are required \n please fill all of them.",
      });
    } else {
      const alreadyExist = await users.findOne({ email });
      if (alreadyExist) {
        res.status(400).json({
          message: "Email Already Exists..! Login If You Have An Account",
        });
      } else {
        try {
          const user = new users({
            fullName,
            email,
            profileUrl: "",
          });
          bcrypt.hash(password, 10, (error, result) => {
            user.set("password", result);
            user.save();
            res.status(201).json("User Created Successfully");
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    }
  } catch (error) {
    console.log("Error in register script ", error.message);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Please Fill All The Fields: i.e., Email and Password",
      });
    } else {
      const userExists = await users.findOne({ email: email });

      if (!userExists) {
        res.status(400).json({ message: "Email Not Registered" });
      } else {
        const validated = await bcrypt.compare(password, userExists.password);

        if (!validated) {
          res.status(400).json({ message: "Invalid Email OR Password" });
        } else {
          const payload = {
            userId: userExists._id,
            email: userExists.email,
          };

          const JWT_SECRET_KEY =
            "THIS_IS_JWT_SECRET_KEY" || process.env.JWT_SECRET_KEY;

          // Generate JWT token

          const token = await jwt.sign(payload, JWT_SECRET_KEY, {
            expiresIn: "12h",
          });
          userExists.token = token;
          userExists.save();
          res.json({
            user: {
              email: userExists.email,
              name: userExists.fullName,
              id: userExists._id,
              profileUrl: userExists.profileUrl,
            },
            token: { token: userExists.token },
          });
        }
      }
    }
  } catch (error) {
    console.error("Error from login script : ", error.message);
    res.status(500).json("Internal Server Error");
  }
};

module.exports = { registerUser, loginUser };
