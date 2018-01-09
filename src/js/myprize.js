var prize_list = JSON.parse(sessionStorage.getItem('prize_list') || '0') || [];
var timeNow = new Date();
template.defaults.imports.slice = function (str, num) {
  return str.slice(0, num);
}
console.log(prize_list)
prize_list.forEach( function (val, i) {
  var endTime = new Date(val.activityEnd);
  var remainTime = endTime.getTime() - Date.now();
  var timeNotice;
  if(remainTime <= 60 * 1000) {
    timeNotice = '已过期'
  } else {
    var remainDay = parseInt(remainTime/24/3600/1000);
    if(remainDay <= 7) {
      if(remainDay < 1) {
        var remainHours = parseInt(remainTime%(24*3600*1000)/3600/1000);
        var remainMinutes = parseInt(remainTime%(3600*1000)/60/1000);
        timeNotice = remainHours + '小时' + remainMinutes + '分钟后到期';
      } else {
        timeNotice = remainDay + '天后到期';
      }
    }
  }
  val.timeNotice = timeNotice;
})
if(!prize_list.length) {
  $('.empty-list-notice').show();
} else {
  $('#myprize-list').html(template('myprize-list-item',{list: prize_list}));
}
function dealDate(date) {

}
