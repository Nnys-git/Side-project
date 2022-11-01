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

//handle get request
app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Welcome to homepage");
});

//READ
app.get("/students", async (req, res) => {
  try {
    let AllStu = await Stu.find();
    //  ***這邊從資料庫query為什麼要異步??
    //  因為你難以確保每次資料庫find()都會順利，有可能找不到
    //  更有可能是讀取時間太少造成資料庫還來不及塞資料進去，你就去找
    res.render("studentsList.ejs", { AllStu: AllStu });
  } catch (err) {
    console.log(
      "Error: something occured that can't get student data from database!"
    );
    console.log(err);
  }
});

//CREATE
app.get("/students/insert", (req, res) => {
  res.render("studentInsert.ejs");
});

app.post("/students/insert", (req, res) => {
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
      console.log(data);
      console.log("Student's data save into DB successfully!");
      res.render("accept.ejs");
    })
    .catch((err) => {
      console.log("Error! data is not saving!");
      console.log(err);
      res.render("reject.ejs");
    });

  // res.render("Thanks for posting");//上面save()動作就有一次(不管成功失敗)res.render()
  // 這邊再做一次res.render的話就會跳下面的錯誤
  // Error [err_http_headers_sent]: cannot set headers after they are sent to the client
  // 主要就是告訴你，你有重複把東西sent給user的動作，檢查程式碼當中有沒有重複的東西吧!!

  //save()也是可以使用 try catch來寫
  // try{
  //   newStu.save();
  //   console.log("Student's data save into DB successfully!");
  //   res.render("accept.ejs");
  // } catch(e){
  //   console.log("Error! data is not saving!");
  //   res.render("reject.ejs");
  //   console.log(e);
  // }
});

//UPDATE
app.get("/students/edit/:id", async (req, res) => {
  let { id } = req.params; //update前，一樣要先找到欲修改學生的id
  try {
    let editstudata = await Stu.findOne({ id });
    if (editstudata !== null) {
      res.render("studentEdit.ejs", { editstudata: editstudata });
    } else {
      res.send("Can't find this student id! please insert valid id!");
    }
  } catch (err) {
    res.send("Error!");
    console.log(err);
  }
  //redirect 到另一個資料修改頁面，介面與新增頁面相同
  //但不一樣的是這邊會先秀出原本對應id學生的資料在表格上
});

app.put("/students/edit/:id", async (req, res) => {
  // console.log(req.body);
  //因為ejs裡form的method原則還是post，要抓資料一樣使用req.body
  //確認有收到user那邊put requset來的資料後(req.body)就可以著手修改
  let { id, name, age, merit, other } = req.body;
  try {
    await Student.findOneAndUpdate(
      { id },
      {
        id: id,
        name: name,
        age: age,
        "scholarship.merit": merit,
        "scholarship.other": other,
      },
      { new: true, runValidators: true }
    );
    res.redirect(`/students/${id}`);
  } catch (err) {
    res.render("reject.ejs");
  }
});

app.get("/students/:id", async (req, res) => {
  let { id } = req.params;
    try {
          let studata = await Stu.findOne({ id });
          if (studata !== null) {
            res.render("studentPersonalPage.ejs", { studata });
          } else {
            //預想資料庫回傳空值
            res.send("Can't find this student, Please enter a valid id.");
          }
          //注意: 這邊的try catch 負責抓的是Stu這個Model使用findOne()這個函數是否成功
          //但這邊假定資料庫連結正常，資料庫只會提供兩種答案: 1 學生的id 2 null空值
          //但這兩種答案都代表著findOne()這個函數運作正常，所以如果使用者亂打id(DB裡沒有的)
          //，catch不會跳錯誤!
          //所以我們這邊用if()去捕捉studata回傳null的狀況
    } catch (err) {
      //但這邊的catch還是不能忘記，還是有資料庫錯誤的狀況發生!
      res.send(" You're going to find Errror!");
      console.log(err);
    }
});

//DELETE
app.get("/students/delete/:id",async (req,res)=>{
  try{
  let{id}=req.params;
  let delstu = await Student.findOne({id});
  if(delstu!==null){
    // console.log(delstu);
    res.render("studentDelete.ejs",{delstu});
  } else{
    res.render("errorPage.ejs")
    console.log("Can't find this id!")
  }} catch(err){
    console.log(err);
  }
}); 

app.delete("/students/delete/:id",async (req,res)=>{
  let{id}=req.params;
  let delete_res = await Student.findOneAndDelete({id});
  if(delete_res!==null){
    res.render("accept.ejs");
  } else {
    res.render("errorPage.ejs")
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
 * http request:
 * 你要從別人那拿東西來用使用GET Request
 * GET  >對應到Read >Model.find(); > 【/students】
 * 你要送東西過去別人那邊使用POST Request
 * POST  >對應到Create >Model.insertOne(); >【/students/insert】
 * 你要送修改的東西過去別人那邊使用PUT/PATCH
 * PUT/PATCH  >對應到Update >Model.findOneAndUpdate(); 【/studemts/:id】
 * 你要修改你的資料使用DELETE
 * DELETE >對應到Delete >Model.delete(); 【students/delete】
 *
 * route list
 * /students (list and show all students)
 * /students/insert
 * get => show HTML form to user
 * post => let user-inserted data save into MongoDB
 *
 * /students/:id
 * get=>student personal page
 *
 * /students/edit/:id
 * get => show HTML form
 * put => update data => redirect /students
 *
 * /students/delete/:id
 *
 *
 * */
