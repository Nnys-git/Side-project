const express = require("express");
const app = express();
const ejs = require("ejs");
const fetch = require("node-fetch");
require("dotenv").config();

//middle ware
app.use(express.static("public"));
app.set("view engine", "ejs");

//handle get request
app.get("/", (req, res) => {
  res.render("index.ejs");
  console.log("Welcome to homepage");
});

//k to c
function ktc(k) {
  return (k - 273.15).toFixed(2); //小數點後取2位的意思(四捨五入)
}

app.get("/:city", async (req, res) => {
  let { city } = req.params; //handle get request 用req.params
  const openweatherApiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}`;
  try {
    let d = await fetch(openweatherApiEndpoint);
    let djs = await d.json();
    let { temp } = djs.main;
    let tempC = ktc(temp);
    res.render("weather.ejs", { djs: djs, tempC: tempC });
  } catch (err) {
    console.log("ERROR:Can't get API response data!");
    console.log(err);
  }
});

//set a port listener
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
