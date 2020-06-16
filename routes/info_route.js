var express = require("express"),
  mysql = require("mysql"),
  moment = require("moment");
db = require("../db");

var router = express.Router();

router.get("/freezeinfo/:id", async (req, res) => {

  var id = req.params.id;
  var freezer;

      let sql4 = "select*from freezer_data order by freezer_name";
      db.query(sql4, (err, result_data) => {
        if (err) {
          console.log(err);
          req.flash("error", "Error while Freezer's name from Database !!!");
        }

        result_data.forEach((body)=>{
          if(body.freezer_id==id) freezer=body
          })

     
          res.render("frezinfo.ejs", {
            allFreezer: result_data,
            currentFreezer:freezer,
            error: req.flash("error"),
          });
       
      
    });

});




router.get("/live_freezer_tc/:id", (req, res) => {
  let id = req.params.id;

  let sql1 = `SELECT * FROM freezer_monitoring.live_records WHERE id in (SELECT MAX(id) FROM freezer_monitoring.live_records where freezer_id='${id}') &&  insert_datetime >= date_sub(now(),interval 5 minute)  ;`;
  db.query(sql1, (err, result_live) => {
    if (err) {
      console.log(err);
      req.flash(
        "error",
        "Error while accessing live Temprature and Current from Database !!!"
      );
    }

    let sql2 = `select *from freezer_monitoring.alert_info where freezer_id='${id}' &&  update_time >= date_sub(now(),interval  48 hour)  `;
    db.query(sql2, (err, alert) => {
      if (err) {
        console.log(err);
        req.flash(
          "error",
          "Error while accessing Freezer Alerts from Database !!!"
        );
      }

      res.send({ live_result: result_live, alert: alert });
    });
  });
});




router.get("/live_chart/:type/:id/:time", (req, res) => 
{
 var id        = req.params.id;
 var time      = req.params.time;
 var type      = req.params.type;
 var chartData ={} ;
 
    let sql1      = `select * from freezer_monitoring.live_records where freezer_id='${id}' && insert_datetime >= date_sub(now(),interval ${time} minute) `;

   db.query(sql1, (err, result) => 
   {
     if (err) 
     {
     console.log(err);
     req.flash("error","Error while accessing temprature Chart from Database !!!");
     }  
     var trash2= []
     var trash= [];
     var diff  = time / 6;

     for (var i = 5; i >= 0; i--)
     {
      var sum1  = 0 
      var sum2  = 0;
      var count = 0;

       result.forEach((freezer) =>
       {
         if (moment(freezer.insert_datetime).isBetween( moment().subtract((i + 1) * diff, "minutes"), moment().subtract(i * diff, "minutes") ))
         {

         if(type=="current")
         {
           sum1 = sum1 + parseInt(freezer.current);
         }
         if(type=="temperature")
         { 
           sum1 = sum1 + parseInt(freezer.temperature);
         }
         if(type=="temp_cur")
         {
           sum1 = sum1 + parseInt(freezer.current);
           sum2 = sum2 + parseInt(freezer.temperature);
         }  
           count++;
         }
       });


      if (count > 0) var avg = Math.round(sum1 / count);
      else avg = 0;

      trash.push(avg);
     

      if(type=="temp_cur")
      {
        if (count > 0) var avg = Math.round(sum2 / count);
        else avg = 0;
        trash2.push(avg);
      }
    
     }
     if(type=="temp_cur")
     {
       chartData.chart=[]
       chartData.chart.push(trash);
       chartData.chart.push(trash2)
     }
     else
     {
      chartData.chart=trash;
     }    

      createLabel(time).then(gotData).catch(err => console.log(err))
 
      function gotData(label)
      {
      chartData.label=label
      res.send(chartData);
      }

 
    });
});




// ======================================
// label function
// ======================================

async function createLabel(time) {
  var d = new Date();

    var hours  = d.getHours();
    var minute = d.getMinutes();
    var label  = [];
    var trash  = [];

    if (time <= 60) {
      if (minute < 10) {
        trash[0] =(hours<10 ? "0"+hours : hours) + ":0" + minute;
      } else {
        trash[0] =(hours<10 ? "0"+hours : hours)+ ":" + minute;
      }

      var diff = Math.round(time / 6);
      for (var i = 1; i < 6; i++) 
      {
        if (minute >= diff) 
        {
          minute = minute - diff;
        } else
         {
          if (hours > 0) 
          {
            hours--;
            minute = 60 - (diff - minute);
          } else 
           {
            hours = 24;
            minute = 60 - (diff - minute);
           }
         }
        if (minute < 10) 
        {
          trash[i] =(hours<10 ? "0"+hours : hours) + ":0" + minute;
        } else
         {
          trash[i] = (hours<10 ? "0"+hours : hours)+ ":" + minute;
         }
      }
    } else
     {
      trash[0] =(hours<10 ? "0"+hours : hours) + ":00";
      for (var i = 1; i < 6; i++)
       {
        if (hours >= time/ 360)
        {
          hours = hours - time / 360;
        } else
         {
          hours = 24 - (time/ 360 - hours);
         }

        trash[i] = ((hours<10 ? "0"+hours : hours)+ ":00").toString(2);
      }
    }
     for(var i=0;i<6;i++)
     {
       label[5-i]=trash[i];
     }

   
    return label;
   

}

module.exports = router;
