//這個js用來處理所有跟認證有關的route!
//先require express下面的.Router()
//require passport
const router = require("express").Router();
//Router 物件可以想像成小型的 express app，專門處理 route 和執行 middleware
//減少記憶體有太多重複的express再執行
//
const passport = require("passport");

//login by local
router.get("/login", (req, res) => {
  //handle "/login"
  res.render("login.ejs");
});

// //login by google
// router.get("/google",(req,res)=>{
//     //use passport.authenticate() method
//     //first parameter goes OAuth service name ex:"google"
//     //second parameter goes a object, contains it's scope
//     //scope 指的是你想從使用者在google裡填的哪種資料
//     //ex: ["profile"]個人資料、["email"]電子信箱...
//     passport.authenticate("google",{
//         scope:["profile"],
//     });
// });
// 這邊get()前面放的是route ，後面的是middleware，只要使用者傳這個route的get request過來就會執行passport.authenticate()
// index.js那邊是串/auth =>   app.use("/auth",authRoute);  => 簡單說如果router長的是 /auth/google就會被導到這裡執行passport.authenticate()
router.get("/google", passport.authenticate("google", {scope: ["profile"],}));

//這邊是google OAuth通過之後會把使用者導到/auth/google/redirect這個route 
//所以這邊針對已經登入成功的User重新導向redirect到 /profile這個route
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/profile");
});

//我們可以為express.router()設定一些handler、middleware
//向上面就是讓router能夠handle "/login"、"/google"、"/google/redirect" 這3個route來的get request
module.exports = router;
