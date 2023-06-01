const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // Set EJS as the template engine

app.get("/", function (req, res) {
  res.render("index", { data: null }); // Render the 'index' template with initial data as null
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = process.env.API_KEY;
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+apiKey;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL =
        "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("index", { data: { query, temp, weatherDescription, imageURL } }); // Render the 'index' template with weather data
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running @ port 3000");
});
