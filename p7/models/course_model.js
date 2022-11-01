const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    //講師
    type: mongoose.Schema.Types.ObjectId,
    //type這樣設定的原因是要把User資料儲存在這個instructor項目當中
    ref: "User",
    //ref:"User"是為了和"User"這個collection做連結!
  },
  students: {
    //課程學生紀錄
    type: [String],
    default: [],
  },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
