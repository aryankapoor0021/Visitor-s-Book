var time;
var day;
module.exports= function showTime(){
    var date = new Date();
    var options={
    weekday:"long",
    day:"numeric",
    month:"long",
    }
    time=date.toLocaleTimeString();
    day=date.toLocaleDateString("en-IN",options);
    var today=date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear();
    setTimeout(showTime, 1000);

    var tom={
        time:time,
        day:day
    }
    return tom;
}; 