var express = require("express"),
  mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "**********",
  database: "freezer_monitoring",
});

module.exports = db;
