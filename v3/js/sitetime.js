// 运行时间
function siteTime() {
  window.setTimeout("siteTime()", 1000);
  var seconds = 1000;
  var minutes = seconds * 60;
  var hours = minutes * 60;
  var days = hours * 24;
  var today = new Date();
  var todayYear = today.getFullYear();
  var todayMonth = today.getMonth() + 1;
  var todayDate = today.getDate();
  var todayHour = today.getHours();
  var todayMinute = today.getMinutes();
  var todaySecond = today.getSeconds();

  var t1 = Date.UTC(2021, 10, 15, 00, 00, 00); // 修改为指定的日期和时间，月份从0开始计数，11表示12月
  var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond);
  var diff = t2 - t1;
  var diffDays = Math.floor(diff / days); // 计算相差的天数
  var diffHours = Math.floor((diff % days) / hours); // 计算相差的小时数
  var diffMinutes = Math.floor((diff % hours) / minutes); // 计算相差的分钟数
  var diffSeconds = Math.floor((diff % minutes) / seconds); // 计算相差的秒数
  document.getElementById("sitetime").innerHTML = "已运行 " + diffDays + " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒";
}
siteTime();