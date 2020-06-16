var express = require("express"),
  mysql = require("mysql"),
  moment = require("moment");
flash = require("connect-flash");
db = require("../db");

var router = express.Router();

router.use(flash());

router.get("/", (req, res) => {
  let sql = "select*from freezer_data order by freezer_name";
  db.query(sql, (err, result) => {
    if (err) {
      req.flash("error", "Error While Loading freezer Name");
      console.log(err);
    }
    let sql2 =
      "SELECT * FROM freezer_monitoring.live_records WHERE    id in (SELECT MAX(id) FROM freezer_monitoring.live_records  GROUP BY freezer_id); ";
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



router.get("/index_freezer",(req,res)=>
{
  let freezerArr=[];
  let sql = "select*from freezer_data order by freezer_name";
  db.query(sql, (err, result) => 
  {
    if (err) 
    {
      req.flash("error", "Error While Loading freezer Name");
      console.log(err);
      req.redirect("back")
    }
    
    let sql2 = "SELECT * FROM freezer_monitoring.live_records WHERE   id in (SELECT MAX(id) FROM freezer_monitoring.live_records  GROUP BY freezer_id); ";
    db.query(sql2, (err, liveResult) =>
     {
       if (err)
       {
         console.log(err);
         req.flash("error", "Error while Loading Live Temperature");
         req.redirect("back")
       }
     
       for(var i=0 ; i<result.length ; i++) 
        {
          freezerArr.push({ name:result[i].freezer_name, id:result[i].freezer_id,temperature:""})

          liveResult.forEach((livedata)=>
          {   
             if(result[i].freezer_id==livedata.freezer_id)
               freezerArr[i].temperature=livedata.temperature 
          })
        }
     
       res.send(freezerArr);
     })
  })
})

module.exports = router;
