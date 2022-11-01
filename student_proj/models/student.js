const mongoose = require("mongoose");
//define a Schema
const studentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please insert your name."],
  },
  age: {
    type: Number,
    required: [true, "Please insert your age."],
    defalut: 18,
    max: [80, "Too old to this school."],
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "Too much merit scholarship"],
    },
    other:{
    type: Number,
    min: 0,
    },
  },
});
//define a model
const Stu = mongoose.model("Student",studentSchema);
//注意: 這邊的model起頭小寫，裡面的parameter不是object, 只要逗號分隔
//前面放單數型的collection名稱, 後面放剛剛設定的Schema

module.exports = Stu; 
//module就是很多個js集合在一起，這邊把Stu exports出去可以讓其他的JS引用