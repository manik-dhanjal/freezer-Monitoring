
liveUpdate();
window.setInterval(liveUpdate,1000);
var test ="";

function liveUpdate()
{

const xhr = new XMLHttpRequest();

xhr.open("get","/index_freezer",true);

xhr.onload= function(){
    var freezer; 
    var freezerHTML="";
    if(xhr.status==200 && JSON.stringify(this.responseText)!=test)
    {
        
       test=JSON.stringify(this.responseText);
         (JSON.parse(this.responseText)).forEach( result =>
        {

            freezerHTML=freezerHTML+`
            <div class="outer-card">  
            <div class="card c1">
              <div class="card-body">
                <a href="/freezeinfo/${result.id}">
                <div class="row">
                <h5 class="card-title1" >${result.name}</h5>
                <i class="fa fa-3x fa-snowflake-o" aria-hidden="true"></i>   
                </div>
                <div class="row"> 
                                <p class="title2">Temperature</p>
                                <i class="fa fa-1x fa-thermometer-half" aria-hidden="true"></i>
                                <h2 class="body2">
                                ${result.temperature}
                                </h2>
                </div>
                 </a>
              </div>
            </div>
          </div> `

         });
       
         document.querySelector(".row-card").innerHTML=freezerHTML
    }

}

xhr.send()
}
