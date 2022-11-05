const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const fs = require("fs");
const bodyParser = require("body-parser");
const Student = require("./models/student");
const Stu = require("./models/student");
const methodOverride = require("method-override");
//to use a put request

//define middle ware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//execute a methodoverride in middleware
app.set("view engine", "ejs");

//connect to localhost mongoDB
mongoose
  .connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongoDB successfully.");
  })
  .catch((err) => {
    console.log("Connection Failed.");
    console.log(err);
  });

//READ
app.get("/students", async (req, res) => {
  try {
    let AllStu = await Stu.find();
    //改成API的話就不用顯示在頁面，只要回傳整個Array like object回去即可
    res.send(AllStu); //送你整坨資料辣!
  } catch {
    res.send({ message: "Error with finding data." });
  }
});

app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let studata = await Stu.findOne({ id });
    if (studata !== null) {
      res.send(studata);
    } else {
      //當然也可以預設找到空值的狀況，我們可以送他吃404
      res.status(404);
      res.send({
        message: "Can't find this student, Please enter a valid id.",
      });
    }
    //這邊其實可以不用再預設找到的object=null的狀況
    //是null的話就給他送null回去就好啦!!
    //用postman測這個的話，如果是null下面會空空如也ww 因
  } catch (err) {
    //但這邊的catch還是不能忘記，還是有資料庫錯誤的狀況發生!
    res.send(" You're going to find Errror!");
    console.log(err);
  }
});
//CREATE
app.post("/students", (req, res) => {
  // console.log(req.body);//確認是否有抓到user回傳的資料
  let { id, name, age, merit, other } = req.body;
  let newStu = new Student({
    id,
    name,
    age,
    scholarship: { merit, other },
  });

  newStu
    .save()
    .then((data) => {
      res.send({ message: "Successfully post a new student data in to DB." });
    })
    .catch((err) => {
      res.status(404); //出錯時別忘了餵他吃404
      res.send(err);
    });
});

//UPDATE
app.put("/students/:id", async (req, res) => {
  let { id, name, age, merit, other } = req.body;
  try {
    let d = await Student.findOneAndUpdate(
      { id },
      {
        id: id,
        name: name,
        age: age,
        "scholarship.merit": merit,
        "scholarship.other": other,
      },
      { new: true, runValidators: true,
      overwrite:true } //overwrite:true 會整個資料都複寫掉! 
    );
    res.send("Successfully Update the data.");
    console.log(d);
  } catch (err) {
    res.status(404);
    res.send(err);
  }
});

class newData {
  //創一個空白物件
  constructor() {} //創一個空白物件
  setProperty(key, value) {
    //因為你在設定要update的物件時，裡面的更改值物件
    //key跟value要一樣
    console.log(`this in class= ${this},value in class= ${value}`);
    if (key !== "merit" && key !== "other") {
      this[key] = value; //這邊的this對應到下面的newObj!
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

app.patch("/students/:id", async (req, res) => {
  let { id } = req.params;
  let newObj = new newData(); //生成一個空白object，用來盛裝使用者要改的東西
  for (let property in req.body) {
    //注意，for in loop 你沒有特別設定的時候，被帶入的會是key的值!!
    // console.log(`property in for= ${property}`);//所以這邊會是印出使用者有要改變的key有哪些
    newObj.setProperty(property, req.body[property]); //在把使用者要改的key丟進newProperty()
    //property就會是key, req.body[property]就會是value
  } 
  try { //注意: findOneAndUpdate裡面，第二項的newObj不能再加上大括號，會update不能! 
    let d = await Student.findOneAndUpdate({ id }, newObj, {
      new: true,
      runValidators: true,
    });
    if (d !== null) {
      res.send("Successfully Update the data.");
      console.log(d);
    } else {
      res.send("Please input data completely");
    }
  } catch (err) {
    res.status(404);
    res.send(err);
  }
});

//DELETE
app.get("/students/delete/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let delstu = await Student.findOne({ id });
    if (delstu !== null) {
      // console.log(delstu);
      res.render("studentDelete.ejs", { delstu });
    } else {
      res.render("errorPage.ejs");
      console.log("Can't find this id!");
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/students/delete/:id", async (req, res) => {
  let { id } = req.params;
  let delete_res = await Student.findOneAndDelete({ id });
  if (delete_res !== null) {
    res.render("accept.ejs");
  } else {
    res.render("errorPage.ejs");
  }
});

//ERROR PAGE
//user key in nonsense router
app.get("/*", (req, res) => {
  res.status(404); //對 送他吃404!
  res.render("errorPage.ejs");
});

//set a port listener
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

/**
RESTful API 基本的CRUD要有
>Create  post
>Read   get
>Update  put/patch
>Delete  delete


你在做
put request
vs
patch request有何不同

put request是把整組資料都做複寫!
patch request是只有把送出的其中幾筆資料做修改

*> 如果你送出的put request 其中只包含片段資料會怎樣?
答案會是validator error，因為我們在update已經有設定USER要新增/修改資料時
一定要經過validator 而這邊如果有空的話就會跳錯誤!!
【postman 在側的時候直接用put request送出去，填參數一樣是從body>x-www-form-urlencoded】
x-www-form-urlencoded 填入參數時，如果是把前面的勾勾消掉，他還是會送東西過去，但Validator不會啟動
但如果是你有打勾，但不填寫值進去的話，validator就會正常運作
 * */
