const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route")
require("./config/passport");

dotenv.config();

//set middleware
app.set("view engine", "ejs");
//express裡面也包含body-parser，所以可以直接使用.json() 還有.urlencoded()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//server 收到的request都會經過middleware, 
//下面這行會去檢查user送過來的route 裡面包不包含"/auth"
//如果有, 使用者就會進入我們設定的authRoute當中並且開始檢查使用者是要怎樣login
app.use("/auth",authRoute);
app.use("/profile",profileRoute);

//連接到mongo Atlas
mongoose
  .connect(//把連結跟密碼放在.env藏起來
   process.env.AtlasDBConnect, 
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080.");
});
