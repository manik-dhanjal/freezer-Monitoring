const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const moment = require("moment");
const expressSession = require("express-session");
const flash = require("connect-flash");

const db = require("./config/db");

const info_route = require("./routes/info_route");
const index_route = require("./routes/index_route");
const config_route = require("./routes/config_route");

const app = express();

db.connect((err) => {
  if (err) throw err;

  console.log("database connected");
});

app.use(
  expressSession({
    secret:process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());
app.use(index_route);
app.use(info_route);
app.use(config_route);

var PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("server is started on PORT:" + PORT);
});
