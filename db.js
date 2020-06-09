var express = require("express"),
  mysql = require("mysql");

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Manik@7060",
  database: "freezer_monitoring",
});

module.exports = db;
