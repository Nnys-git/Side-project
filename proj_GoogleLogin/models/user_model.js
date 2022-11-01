const mongoose = require("mongoose");
//我們透過PASSPORT 從Google那邊取回來的資料
//要透過Schema建立
const userSchema = mongoose.Schema({
  //google login
    name: {
    //使用者名稱
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  googleID: {
    //使用者google ID
    type: String,
  },
  date: {
    //使用者資料建立到express server日期
    type: Date,
    default: Date.now,
  },
  thumbnail: {
    //使用者縮圖
    type: String,
  },
  //local login
  email:{
    type: String,
  },
  password:{
    type: String,
    maxlength:1024,
  }
});
//把這個Model exports出去
module.exports = mongoose.model("User",userSchema);
