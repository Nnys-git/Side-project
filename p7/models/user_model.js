const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 100,
  },
  password: {
    type: String,
    require: true,
    minlength: 6,
    maxlength: 1024, //為了讓 hash function過的密碼也能放進去，所以設這麼大
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    require: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  //注意: 這裡的.methods是instanse function 必須要使用function daclaration ，否則this會不一樣!
  //這邊是為userSchema這個大OBJECT中的methods property新增他的值
  //而這邊將這個值設定為一個function declaration
  return this.role == "student";
  //注意  這裡的this指的就是userSchema這個大object
};

userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

//mongoose schema muddleware
userSchema.pre("save", async function (next) {
  //parameter放next用意為何?
  if (this.isModified("password") || this.isNew) {
    //build-in method .isModified()/ .isNew()是什麼?
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next(); // 這邊的next()是給後面的error handler去接嗎?
  } else {
    return next(); // else這邊為什麼要加return?
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    //前面的password指的是使用者輸入的、後面的是資料庫中儲存的
    if (err) {
      return cb(err, isMatch);
    } else {
      cb(null, isMatch);
    }
  });
};

const newUser = mongoose.model("User", userSchema);
module.exports = newUser;
