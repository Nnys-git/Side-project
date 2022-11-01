require("dotenv").config();
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");
const session = require("express-session");
const bodyParser = require("body-parser");
const { stringify } = require("querystring");
const User = require("./models/user"); //記得是要放路徑，最後副檔名不需要!
const bcrypt = require("bcrypt");
const saltRounds = 10; //2^10=1024次去做hash function

//set middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

//用niddle確認是否已經登入!
const requireLogin = (req,res,next)=>{
  if(!req.session.isVarified==true){ //如果沒登入
    res.redirect("login"); //重導向login頁面
  } else {
    next();
  }
};


//connect to localhost mongoDB
mongoose
  .connect("mongodb://localhost:27017/exampleDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongoDB.");
  })
  .catch((err) => {
    console.log("Connection Failed.");
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to homepage");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let foundUser = await User.findOne({ username }); //記得這邊用findOne，用find回傳整個array麻煩
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, (err, result) => {
        if (result === true) { //找到資料庫有這個人，密碼比對也相同
          req.session.isVarified=true;//確認登入後就在session存入isVarified property = true;
          res.redirect("secret");//這邊的redirect代表導向另一個route!
        } else {
          res.send("Password or Username not correct!");
        };

        if (err) {
          next(err);
        };
      });
    } else {
      res.send("Password or Username not correct!");
    }
  } catch (err) {
    next(err);
  }
});

//所以我們還要針對secret這個route做handle
app.get("/secret",requireLogin,(req,res)=>{ //最後在登入後頁面加上middleware, 確保進到這個網站的人都是有登入過的!
  res.render("secret");
})


app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res, next) => {
  //catch的err要透過next送出去! 記得塞next parameter
  console.log(req.body);
  let { username, password } = req.body;
  //排除同樣名稱被重複進入資料庫的狀況
  try {//先檢查DB內有沒有一樣的NAME(只檢查NAME的原因在於，資料庫有同樣的密碼其實沒關係，但同樣名稱就不行了)
    let foundUser = await User.findOne({ username });
    if (foundUser) {
      res.send("Username has been saved.");
    } else {
      //進行加密
      bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
          next(err);
        }
        console.log(salt); //$2b$10$6mjxrjl0FNdlwUU7JAfR3e
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            next(err);
          }
          console.log(hash); //$2b$10$6mjxrjl0FNdlwUU7JAfR3eYQ7v8gCHeuOPZpnL68YTqjSdCC/kJTi
          let newUser = new User({ username: username, password: hash });
          try {
            newUser
              .save()
              .then((data) => {
                res.send("Data has saved into DB!");
                console.log(data);
              })
              .catch((dberr) => {
                res.send("Error! Data has not saved!");
                // console.log(dberr);
              });
          } catch (err) {
            next(err); //別忘記把try catch這邊的錯誤交給error handler
          }
        });
      });
    }
  } catch (e) {
    next(e);
  }
});

app.get("/*", (req, res) => {
  res.status(404).send("404 NOT FOUND!");
});

//error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something goes wrong. We'll fix it soon!");
});

//define Schema
const Schema = new mongoose.Schema({});

//define model

//set a port listener
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
