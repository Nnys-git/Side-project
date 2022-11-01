//先處理form-button的部分
//先找到button【document的querySelector method】
let section = document.querySelector("section");
let addTaskButton = document.querySelector("form button");
// console.log(addTaskButton);//<button type="submit">
//為這個button增加事件
addTaskButton.addEventListener("click", (e) => {
  //prevent from ba submitted
  e.preventDefault();
  //原本的button type = submit會把資料傳出去
  //但我們這邊不希望資料傳出去，而是將資料新增在下方
  //所以我們使用preventDefault先行將預設動作刪除

  //get the user input value
  //console.log(e.target); // 顯示事件被觸發的那個DOM元素
  //console.log(e.target.parentElement);//<form>這個tag
  console.log(e.target.parentElement.children); //回傳一個HTMLCollecton
  let form_tag = e.target.parentElement;
  let todoText = form_tag.children[0].value;
  //要得到使用者輸入的文字，要使用input中的value property
  let todoMonth = form_tag.children[1].value;
  let todoDay = form_tag.children[2].value;
  // console.log(todoText,todoMonth,todoDay)

  // 在section中新增TodoList的表格
  // 先從todo 使用者輸入的資料開始
  let todo = document.createElement("div"); //創造一個div tag
  todo.classList.add("todo"); //在這個div tag加上class = todo
  let text = document.createElement("p");
  // console.log(typeof text);//object
  text.classList.add("todo_text");
  text.innerText = todoText; //讓創造出來的p tag顯示使用者輸入的文字
  let time = document.createElement("p");
  time.classList.add("todo_time");
  time.innerText = todoMonth + "/" + todoDay; //讓創造出來的p tag顯示使用者輸入的日期
  //蒐集完使用者輸入的資料以及要顯示的資料之後
  //我們把在剛剛create的div以及p 元素加入內容(子元素)
  todo.appendChild(text);
  todo.appendChild(time);

  // create green check & red trash can
  let checkButton = document.createElement("button");
  checkButton.classList.add("check_btn");
  checkButton.innerHTML = '<i class="fa-solid fa-check"></i>';
  //注意: 這邊新增的是innerHTML 所以你輸入的TAG會被瀏覽器看懂
  //這時候就可以放入FONT-AWSOME的I TAG連結進去  【注意，裡面已經有雙引號，外面就不能再用，請改用單引號包覆】

  //設定checked的動作
  checkButton.addEventListener("click",(e)=>{
    //注意: button跟icon(i tag)的範圍是不一樣的，有時候會有誤觸的情況發生
    //而我們要觸發的是button這個tag
    //所以我們可以在i tag上讓他的點選事件取消【透過CSS -> pointer-event:none】
    let todoItem = e.target.parentElement;
    console.log(todoItem);
    todoItem.classList.toggle("done");
    // 使用toggle可以將點選跟非點選來做切換
  })



  let trashButton = document.createElement("button");
  trashButton.classList.add("trash_btn");
  trashButton.innerHTML = '<i class="fa-solid fa-trash">';

  trashButton.addEventListener("click", (e) =>{
    console.log(e.target.parentElement);//我們可以知道要刪掉的是button的父元素
    let exist_todoItem = e.target.parentElement;
    // 你讓exist_todoItem.remove跟style.animation共存是不可能的
    // 原因是remove() 是即刻執行，animation還要0.3s
    // 為了要讓remove在結束animation之後再執行
    // 我們要透過.addEventListener的"animationend"事件來處理
    exist_todoItem.addEventListener("animationend",()=>{
        exist_todoItem.remove();
    })
    // exist_todoItem.remove();
    exist_todoItem.style.animation="scaleDown 0.3s forwards"//用scale(0)也可以達成類似remove效果
  })




  todo.appendChild(checkButton);
  todo.appendChild(trashButton);

  todo.style.animation = "scaleUp 0.3s forwards"

  form_tag.children[0].value = ""; //click之後 clear the input
  // 最後再把整個todo放進section裡面
  section.appendChild(todo);
});
