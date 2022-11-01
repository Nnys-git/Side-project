const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("A req is coming into auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "Test API is working",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check the validation of data
  //之前都是express().post() 現在多了一個express.Router().post()為什麼也行??
  // console.log("Register!");
  const { error } = registerValidation(req.body); //注意: 這邊是object destruction
  // console.log(error); //找到error
  // console.log(error.details); //error下面的details有詳細說明問題
  if (error) {
    return res.status(400).send(error.details[0].message);
    //如果真的發生錯誤，送User吃400，告訴他哪裡錯
  }

  //check if the user exists
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email has already been registered!");
  }

  //register the User
  const newUser = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "success",
      savedObject: savedUser,
    });
  } catch (e) {
    res.status(400).send("Not save!");
  }
});

router.post("/login", (req, res) => {
  //check validation of data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(400).send(err);
    }
    if (!user) {
      res.status(401).send("User not found");
    } else {
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (err) return res.status(400).send(err);
        if (isMatch) {
          const tokenObject = { _id: user._id, email: user.email };
          const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
          res.send({ success: true, token: "JWT" + token, user });
        } else {
          res.status(401).send("Wrong password");
        }
      });
    }
  });
});

module.exports = router;
