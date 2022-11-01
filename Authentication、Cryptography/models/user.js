const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
//不要忘記跟資料庫連結的是mongoose Schema是從mongoose開始
//Schema不會變動，都用const設
    username:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true,
    }
  });
// 別忘了，model裡面的parameter 前面是放collection單數名稱，後面擺進Schema
// 這邊的model記得要小寫!! 別忘了model也是mongoose的method!!!!!
const User = mongoose.model("User",userSchema);
// 別忘了，要把這個exports出去!!
module.exports = User;