const header = document.querySelector("header");
const anker = document.querySelector("header nav ul li a");

window.addEventListener("scroll", (e) => {
  if (window.pageYOffset != 0) {
    header.style.backgroundColor = "rgba(71,81,182,0.7)";
  } else {
    header.style = "";
  }
});
