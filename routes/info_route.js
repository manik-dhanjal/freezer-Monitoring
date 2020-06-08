var express = require("express"),
  mysql = require("mysql"),
  moment = require("moment");
db = require("../db");

var router = express.Router();

router.get("/freezeinfo/:id/:temp/:current/:t_vs_c", async (req, res) => {
  var temp = req.params.temp;
  var current = req.params.current;
  var tvsc = req.params.t_vs_c;
  var id = req.params.id;

  var liveAbout = [temp, current, tvsc];
  var label = [];
  var chartData = [];

  let sql1 = `select * from freezer_monitoring.live_records where freezer_id='${id}' && insert_datetime >= date_sub(now(),interval ${liveAbout[0]} minute) `;

  await db.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
      req.flash(
        "error",
        "Error while accessing temprature Chart from Database !!!"
      );
    }

    var trash = [];
    var diff = liveAbout[0] / 6;
    for (var i = 5; i >= 0; i--) {
      var sum = 0;
      var count = 0;
      result.forEach((freezer) => {
        if (
          moment(freezer.insert_datetime).isBetween(
            moment().subtract((i + 1) * diff, "minutes"),
            moment().subtract(i * diff, "minutes")
          )
        ) {
          sum = sum + parseInt(freezer.temperature);
          count++;
        }
      });
      if (count > 0) var avg = Math.round(sum / count);
      else avg = 0;
      trash.push(avg);
    }

    chartData.push(trash);
  });

  sql1 = `select * from freezer_monitoring.live_records where freezer_id='${id}' && insert_datetime >= date_sub(now(),interval ${liveAbout[1]} minute) `;

  await db.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
      req.flash(
        "error",
        "Error while accessing Current Chart from Database !!!"
      );
    }

    var trash = [];
    var diff = liveAbout[1] / 6;
    for (var i = 5; i >= 0; i--) {
      var sum = 0;
      var count = 0;
      result.forEach((freezer) => {
        if (
          moment(freezer.insert_datetime).isBetween(
            moment().subtract((i + 1) * diff, "minutes"),
            moment().subtract(i * diff, "minutes")
          )
        ) {
          sum = sum + parseInt(freezer.current);
          count++;
        }
      });
      if (count > 0) var avg = Math.round(sum / count);
      else avg = 0;
      trash.push(avg);
    }

    chartData.push(trash);
  });

  sql1 = `select * from freezer_monitoring.live_records where freezer_id='${id}' && insert_datetime >= date_sub(now(),interval ${liveAbout[2]} minute) `;

  await db.query(sql1, async (err, result) => {
    if (err) {
      console.log(err);
      req.flash(
        "error",
        "Error while Current V/S Temperature Chart from Database !!!"
      );
    }
    var trash = [];
    var diff = liveAbout[2] / 6;
    for (var i = 5; i >= 0; i--) {
      var sum = 0;
      var count = 0;
      result.forEach((freezer) => {
        if (
          moment(freezer.insert_datetime).isBetween(
            moment().subtract((i + 1) * diff, "minutes"),
            moment().subtract(i * diff, "minutes")
          )
        ) {
          sum = sum + parseInt(freezer.temperature);
          count++;
        }
      });
      if (count > 0) var avg = Math.round(sum / count);
      else avg = 0;
      trash.push(avg);
    }

    chartData.push(trash);

    trash = [];
    var diff = liveAbout[2] / 6;
    for (var i = 5; i >= 0; i--) {
      var sum = 0;
      var count = 0;
      result.forEach((freezer) => {
        if (
          moment(freezer.insert_datetime).isBetween(
            moment().subtract((i + 1) * diff, "minutes"),
            moment().subtract(i * diff, "minutes")
          )
        ) {
          sum = sum + parseInt(freezer.current);
          count++;
        }
      });
      if (count > 0) var avg = Math.round(sum / count);
      else avg = 0;
      trash.push(avg);
    }

    chartData.push(trash);
    await chartData.push(trash);
  });

  createLabel(liveAbout);
  async function createLabel(liveAbout) {
    var d = new Date();

    liveAbout.forEach((singleAbout) => {
      var hours = d.getHours();
      var minute = d.getMinutes();

      var trash = [];

      if (singleAbout <= 60) {
        if (minute < 10) {
          trash[0] = hours + ":0" + minute;
        } else {
          trash[0] = hours + ":" + minute;
        }

        var diff = Math.round(singleAbout / 6);
        for (var i = 1; i < 6; i++) {
          if (minute >= diff) {
            minute = minute - diff;
          } else {
            if (hours > 0) {
              hours--;
              minute = 60 - (diff - minute);
            } else {
              hours = 24;
              minute = 60 - (diff - minute);
            }
          }
          if (minute < 10) {
            trash[i] = hours + ":0" + minute;
          } else {
            trash[i] = hours + ":" + minute;
          }
        }
      } else {
        trash[0] = String(hours) + ":00";
        for (var i = 1; i < 6; i++) {
          if (hours >= singleAbout / 360) {
            hours = hours - singleAbout / 360;
          } else {
            hours = 24 - (singleAbout / 360 - hours);
          }

          trash[i] = (hours + ":00").toString(2);
        }
      }

      label.push(trash);
    });
  }

  let sql2 = `SELECT * FROM freezer_monitoring.live_records WHERE  id IN (SELECT MAX(id) FROM freezer_monitoring.live_records GROUP BY freezer_id) `;
  db.query(sql2, (err, result_live) => {
    if (err) {
      console.log(err);
      req.flash(
        "error",
        "Error while accessing live Temprature and Current from Database !!!"
      );
    }

    var arr;
    result_live.forEach((freezer) => {
      if (freezer.freezer_id == id) {
        arr = freezer;
      }
    });

    var d2 = result_live[1].insert_datetime;

    var d1 = new Date();

    let sql3 = `select *from freezer_monitoring.alert_info where freezer_id='${id}' &&  update_time >= date_sub(now(),interval  48 hour)  `;
    db.query(sql3, (err, alert) => {
      if (err) {
        console.log(err);
        req.flash(
          "error",
          "Error while accessing Freezer Alerts from Database !!!"
        );
      }

      let sql4 = "select*from freezer_data";
      db.query(sql4, (err, result_data) => {
        if (err) {
          console.log(err);
          req.flash("error", "Error while Freezer's name from Database !!!");
        }

        res.render("frezinfo.ejs", {
          freezer: arr,
          allFreezer: result_data,
          label: label,
          chartData1: chartData,
          link: liveAbout,
          alert: alert,
          error: req.flash("error"),
        });
      });
    });
  });
});

module.exports = router;
