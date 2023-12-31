const mongoose = require("mongoose");

// const url =
//   "mongodb+srv://peers_admin:admin123@cluster0.kkvhsnv.mongodb.net/peers?retryWrites=true&w=majority";

// try {
//   mongoose
//     .connect(url)
//     .then(() => console.log("Connection Established With Database!"))
//     .catch((e) => console.log(`Error: ${e.message}`));
// } catch (error) {
//   console.log(error);
// }

// const mongoose = require("mongoose");
const requestModel = require("./Models/Requests");
const url =
  "mongodb+srv://peers_admin:admin123@cluster0.kkvhsnv.mongodb.net/peers?retryWrites=true&w=majority";
mongoose.connect(url).then(() => {
  console.log("Connection Established With Database!");
});
