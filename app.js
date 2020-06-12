var express = require("express"),
  mysql = require("mysql"),
  bodyParser = require("body-parser"),
  moment = require("moment");
(info_route = require("./routes/info_route")),
  (index_route = require("./routes/index_route")),
  (config_route = require("./routes/config_route")),
  (db = require("./db")),
  (expressSession = require("express-session"));
flash = require("connect-flash");
var app = express();

db.connect((err) => {
  if (err) throw err;

  console.log("database connected");
});

app.use(
  expressSession({
    secret:
      "this is a secret encryption code for cookie encryption hope you like website",
    resve: false,
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
