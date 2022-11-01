const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth; //require("./routes") <=抓資料夾等同抓資料中的index.js
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport); //直接用passport作為參數帶入

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongoDB Atlas Successfully");
  })
  .catch((err) => {
    console.log(`Connect to mongoDB failed! error message: ${err} `);
  });

//middleware with using express body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoute); //這邊設定middleware是/api/是為了之後react使用方便!
app.use("./api", passport.authenticate("jwt", { session: false }), courseRoute);

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
