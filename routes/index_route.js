var express = require("express"),
  mysql = require("mysql"),
  moment = require("moment");
flash = require("connect-flash");
db = require("../db");

var router = express.Router();

router.use(flash());

router.get("/", (req, res) => {
  let sql = "select*from freezer_data";
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Error While Loading freezer Name");
      console.log(err);
    }
    let sql2 =
      "SELECT * FROM freezer_monitoring.live_records WHERE id IN (SELECT MAX(id) FROM freezer_monitoring.live_records GROUP BY freezer_id) ";
    db.query(sql2, (err, liveResult) => {
      if (err) {
        console.log(err);
        req.flash("error", "Error while Loading Live Temperature");
      }

      res.render("freezer.ejs", {
        allFreezer: result,
        allLiveFreezer: liveResult,
        success: req.flash("success"),
        error: req.flash("error"),
      });
    });
  });
});

router.post("/freezer/add", (req, res) => {
  let newFreezer = {
    freezer_id: req.body.freezerId,
    freezer_name: req.body.freezerName,
    client_id:""
  };

  let sql = "INSERT INTO freezer_data SET?";

  db.query(sql, newFreezer, (err, result) => {
    if (err) {
      console.log(err);
      req.flash("error", "please select unique freezer id");
      res.redirect("/");
    } else {
      req.flash("success", "Freezer is saved");
      res.redirect("/");
    }
  });
});

module.exports = router;
