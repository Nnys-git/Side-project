let header = document.querySelector("header");
// console.log(header); //確認你有抓到這個header
let anker = document.querySelectorAll("header nav ul li a");
//console.log(anker);
window.addEventListener("scroll",(e)=>{
// console.log(e);// return scroll物件
// console.log(window.pageYOffset); //return scroll offset value
if(window.pageYOffset !=0){
    header.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    //光這樣設定的話，滾動之後顏色會改不回來
    //因為STYLE已經被STYLE設定下去，一定要用STYLE設定回來
    header.style.color = "white";
    //title文字變顏色了但是anker tag卻沒有? 因為你只選到header
    //雖然anker有繼承到color:white; 但是優先度來說繼承小於CSS設定 【繼承的優先級最小】
    //通常來說優先度inline styling【直接寫在標籤內OR object property: style】>id>class>element selector>inheritance
    //所以這邊我們還要特定選到anker tag才行
    //【錯誤示範!!】anker.style.color="white";
    //注意:你不能直接用style.color去設定，因為anker是一個NodeList
    //對於一個有複數物件的集合，你必須要迭代使用(for迴圈, forEach)
    anker.forEach((a)=>{
        a.style.color = "white";
    })
    //記得CSS端要新增  transition: all 0.2s ease; 不然會閃換wwww
} else{
    header.style="";
    anker.forEach((a)=>{
        a.style.color = " rgb(127, 150, 255)";
    })
}
})