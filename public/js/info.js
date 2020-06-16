var id = $("#dropdownMenuButton").attr("data-freezerid");
var change_check = { live_result: "", alert: "" };
var time =[10,10,10]
var chart=[]
var label=[];
var test1="",tempTest="",currentTest="",tvcTest="";

   

var dateButton =[document.querySelectorAll(".current_drop .dropdown-item"),
                 document.querySelectorAll(".temp_drop .dropdown-item"),
                 document.querySelectorAll(".tempVScur_drop .dropdown-item")]


dateButton.forEach((buttonGroup)=>
{
   buttonGroup.forEach((button)=>
   {
     button.addEventListener("click",()=>
     {
       document.querySelector(`.${button.getAttribute("data-type")}`).innerHTML=button.innerHTML;
      
       if(button.getAttribute("data-type")=='temperature')
       { 
         time[0]=button.getAttribute("data-time");
         charts('temperature',time[0],id)
                         
        
       } 
       if(button.getAttribute("data-type")=='current')
       {
         time[1]=button.getAttribute("data-time");
         charts('current',time[1],id);
                         
       } 
       if(button.getAttribute("data-type")=='temp-cur')
       {
         time[2]=button.getAttribute("data-time");
         charts('temp_cur',time[2],id);
       } 

     })
   })
})

liveFreezerTC(id)
charts('temperature',time[0],id)
charts('current',time[1],id);
charts('temp_cur',time[2],id);


var donutChartCanvas1 = $("#donutChart1").get(0).getContext("2d");
        



var donutData1 = 
{
  labels: ["temperature", ""],
  datasets: [
    {
    data                  : [0,0], //dough nut chart value
    backgroundColor       : ["#FF0000", "#DDDDDD"],
    hoverBackgroundColor  : ["#FF0000", "#DDDDDD"],
    hoverBorderColor      : ["#FF0000", "#ffffff"],
    }],
}
 var donutOptions1 = 
 {
   responsive       : true,
   legend           : { display: false },
   cutoutPercentage : 55,
   rotation         : (2 / 3)*Math.PI /** This is where you need to work out where 89% is */,
   circumference    : (5 / 3) * Math.PI,

   tooltips:
  {
    filter: function (item, data) 
    {
    var label = data.labels[item.index];
    if (label) return item;
    }
  }
 }

//   Current Doughnut Chart

var donutChart1 = new Chart(donutChartCanvas1,
{
type    : "doughnut",
data    : donutData1,
options : donutOptions1,
});




var donutChartCanvas2 = $("#donutChart2").get(0).getContext("2d");
var donutData2 = 
{
 labels: ["current", ""],
 datasets: [
  {
    data                 : [0,0],
    backgroundColor      : ["#00FFFF", "#DDDDDD"],
    hoverBackgroundColor : ["#00FFFF", "#DDDDDD"],
    hoverBorderColor     : ["#00FFFF", "#ffffff"],
  }],
};

 var donutOptions2 = 
 {
   responsive       : true,
   rotation         :  (2 / 3)*Math.PI /** This is where you need to work out where 89% is */,
   circumference    :  (5 / 3) * Math.PI,
   legend           :  { display: false },
   cutoutPercentage :  55,
   tooltips         :
    {
     filter  : function (item, data) 
       {
        var label = data.labels[item.index];
        if (label) return item;
       }
     }
   }
   console.log(   donutChart1.data.datasets.data)

 var donutChart2 = new Chart(donutChartCanvas2, 
 {
  type    : "doughnut",
  data    : donutData2,
  options : donutOptions2,
 });




  
    var areaChartCanvas1 = $('#areaChart1').get(0).getContext('2d')

    var areaChartData1 =
    {
      labels: label[1], //time data in current chart
      datasets: [
        {
  
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointRadius: true,
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data: chart[1],  //current at particular time
          fill: false
        },
  
      ]
    }
  
    var areaChartOptions1 = {
      maintainAspectRatio: false,
      responsive: true,
     
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
  
            min: Math.min.apply(0),
            max: Math.max.apply(100)
          }
  
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
  
            callback: function (value, index, values) {
              return value + ' A';
            }
          }
        }]
      }
    }
  
    // This will get the first returned node in the jQuery collection.
    var areaChart1 = new Chart(areaChartCanvas1, {
      type: 'line',
      data: areaChartData1,
      options: areaChartOptions1
    })
    var areaChartCanvas2 = $('#areaChart2').get(0).getContext('2d')
  
    var areaChartData2 = {
      labels: label[0], // temperature time axis
      datasets: [
        {
  
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointRadius: true,
          pointColor: '#FF6347',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data: chart[0],  // temperature value at perticular time
          fill: false
        },
  
      ]
    }
  
    
    var areaChartOptions2 = {
      maintainAspectRatio: false,
      responsive: true,
    
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
            min: Math.min.apply(0),
            max: Math.max.apply(100)
          }
  
        }],
        yAxes: [{
          gridLines: {
            display: false,
          },
          ticks: {
  
  
            beginAtZero: true,
  
  
            callback: function (value, index, values) {
              return value + ' C';
            }
          }
        }]
      }
    }
  
    // This will get the first returned node in the jQuery collection.
    var areaChart2 = new Chart(areaChartCanvas2, {
      type: 'line',
      data: areaChartData2,
      options: areaChartOptions2
    })
  
    var stackedBarChartCanvas = $('#stackedBarChart').get(0).getContext('2d')
    var stackedBarChartData = {
      labels: label[2],  // temp vs current graph time axis
      datasets: [
        {
          label: 'Avg.current',
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointRadius: false,
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data:chart[2],   //current bar value blue color
        },
        {
          label: 'Temperature',
          backgroundColor: '#FF0000',
          borderColor: 'rgba(210, 214, 222, 1)',
          pointRadius: false,
          pointColor: 'rgba(210, 214, 222, 1)',
          pointStrokeColor: '#c1c7d1',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data:chart[2],   // temp current value  red color
        }
      ]
    }

    var stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
  
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  
    var stackedBarChart = new Chart(stackedBarChartCanvas, {
      type: 'bar',
      data: stackedBarChartData,
      options: stackedBarChartOptions
    })




   


window.setInterval(() =>{ liveFreezerTC(id); }, 1500);


window.setInterval(() =>{ charts('temperature',time[0],id)
                          charts('current',time[1],id);
                          charts('temp_cur',time[2],id); }, 1500);



async function liveFreezerTC(id)
{ 

    const xhr = new XMLHttpRequest();
    xhr.open("get", `/live_freezer_tc/${id}`, true);

   xhr.onload = function ()
    { 
       if ( this.status == 200) 
       {

        result = JSON.parse(this.responseText);

        if (!result.live_result[0]) 
        {
        result.live_result.push({ temperature: 0, current: 0, freezer_id: id });
        }
 
        if(JSON.stringify(result)!=test1)
        {
        test1=JSON.stringify(result);
        donutChart1.data.datasets[0].data= [result.live_result[0].temperature,100-result.live_result[0].temperature];
        donutChart1.update();

        donutChart2.data.datasets[0].data= [result.live_result[0].current,100-result.live_result[0].current];
        donutChart2.update();
        
        }
      //   Doughnut chart 1
  
        
         // update values below
         var douTemp    = 'NnN';
         var douCurrent = 'NnN';
         var test = JSON.parse(this.responseText);

         if (test.live_result[0]) 
         {
           douTemp    = result.live_result[0].temperature + "<span class='unit1'>&#8451;</span>";
           douCurrent = result.live_result[0].current + "<span class='unit1'>A<span>";
         }

         document.querySelector(".douTemp").innerHTML    = douTemp;
         document.querySelector(".douCurrent").innerHTML = douCurrent;



         //  Alert box

         var alert   = result.alert
         var alertHTML ="";
        
        for(var i=alert.length-1;i>=0;i--) 
         { 
           
           let date = new Date(alert[i].update_time)
           let time = date.getHours() + ":" + (date.getMinutes() + 1);

            if (date.getMinutes() < 10) 
            {
             time = date.getHours() + ":0" + (date.getMinutes() + 1);
            }

            alertHTML = alertHTML + 
              `<div class="list-item">
                 <div class="date">  ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} at ${time} hrs</div>
                 <div class="event">${alert[i].message}</div>
               </div>`;
          }
            document.querySelector(".alert_list").innerHTML = alertHTML;
 
        
      };
   }
  xhr.send();
 
  
}


  
   

  function charts(type,time,id)
  {
      
     var xhr =new XMLHttpRequest();
    
     xhr.open('get',`/live_chart/${type}/${id}/${time}`,true);
    
    xhr.onreadystatechange=function()
    { 
      if(this.readyState==4&&this.status==200)
      {
         
       
           
        
          if(type=="current"&&JSON.stringify(this.responseText)!==currentTest)
          {
            currentTest= JSON.stringify(this.responseText);
            areaChart1.data.datasets[0].data=JSON.parse(this.responseText).chart;
           areaChart1.data.labels =JSON.parse(this.responseText).label;
            areaChart1.update();
          }
          if(type=="temperature"&&JSON.stringify(this.responseText)!==tempTest)
          {
            tempTest= JSON.stringify(this.responseText);
            areaChart2.data.datasets[0].data=JSON.parse(this.responseText).chart;
            areaChart2.data.labels=JSON.parse(this.responseText).label;
            areaChart2.update();
          }
          if(type=="temp_cur"&&JSON.stringify(this.responseText)!==tvcTest)
          {
            tvcTest= JSON.stringify(this.responseText);
            stackedBarChart.data.datasets[0].data=JSON.parse(this.responseText).chart[0];
            stackedBarChart.data.datasets[1].data=JSON.parse(this.responseText).chart[1];
            stackedBarChart.data.labels=JSON.parse(this.responseText).label;
            stackedBarChart.update();
          }
        }
      
    } 
    xhr.send();
  }
   