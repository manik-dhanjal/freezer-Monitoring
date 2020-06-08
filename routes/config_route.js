var express     = require("express"),
    mysql       = require("mysql"),
    bodyParser  = require("body-parser"),
    moment      = require("moment"),
    db          = require("../db"),
    flash       = require("connect-flash"),
    bodyParser  = require("body-parser");
    

    var router = express.Router();
    router.use(bodyParser.urlencoded({extended:true}))
    router.use(flash());


   router.get("/config",(req,res)=>
   {
    
    let sql="SELECT * FROM freezer_data;"
    db.query(sql,(err,freezertable)=>
    {    
        if(err)
        {
            console.log(err);
            req.flash("Error while Loading Freezer Data from Database !!")
            console.log(err)
        }
       
        let sql2="Select a.freezer_name,b.alert_temperature, b.email_to from freezer_monitoring.freezer_data as a right join freezer_monitoring.alert_config as b on   b.freezer_id=a.freezer_id ;"

        db.query(sql2,(err,tempAlert)=>{
          
            if(err)
            {
                console.log(err);
                req.flash("Error while Loading Freezer Alerts from Database !!")
                console.log(err)
            }

            res.render("config.ejs",{freezeData:freezertable,tempAlert:tempAlert,error:req.flash("error"),success:req.flash("success")});
        })
       
    })
    
   })


   router.post("/config/email/add",(req,res)=>
   {
       var from=req.body.from;
       var to =req.body.to;
       var message= req.body.message;
       let sql=`insert into email_config (email_from,email_to,email_cc,client_id,message) values ('${from}','${to}','${to}','C01','${message}');`


       db.query(sql,(err,result)=>
       {
           if(err)
           {
           console.log(err);
           req.flash("error","Error while saving mail in Database")
           res.redirect("back");
           }
           else
           {
            req.flash("success","Email is Succesfully saved in database")
            res.redirect("back");
           }
       })
   

   })



   router.post("/freezer_name/update/:id",(req,res)=>
   {   console.log("in route")
        var id =req.params.id;
        var name= req.body.freezer_name;
      let sql=`update freezer_data set freezer_name='${name}' where freezer_id='${id}' `

      db.query(sql,(err,request)=>
      {
         if(err) 
         {
            console.log(err);
            req.flash("error","Error While updating Name !!!!")
            res.redirect("back");
         }
        else
        {
         req.flash("success","Freezer Name is Successfully updated")
         res.redirect("back")
        }
      })
   })



    router.post("/config/alert/:id",(req,res)=>
    {
       var id=req.params.id;
       var temp=req.body.temp;
       var emailto=req.body.emailTo;

     let sql = `insert into alert_config (freezer_id,alert_temperature,client_id,email_to) values ('${id}','${temp}','C01','${emailto}')`;

     db.query(sql,(err,result)=>{
     if(err) 
     { 
         console.log(err)
         req.flash("error","Error while setting Alarm")
     }
     else
     {
     req.flash("success",`Alarm is Successfully Set for ${temp} C`)
     res.redirect("back");
     }
     })

    })


    

    module.exports=router;