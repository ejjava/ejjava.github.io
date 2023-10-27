function myFunction() {
 var input = document.getElementById('myInput');
 var filter = input.value.toUpperCase();
 var ul = document.getElementById("myUL");
 var li = ul.getElementsByTagName('li');
 
 for (var i = 0; i < li.length; i++) {
 var a = li[i].getElementsByTagName("p")[0];
 var txtValue = a.textContent || a.innerText;
 if (txtValue.toUpperCase().indexOf(filter) > -1) {
 li[i].style.display = "";
 } else {
 li[i].style.display = "none";
 }
 }
}
window.onload = function() {
 var urlParams = new URLSearchParams(window.location.search);
 var keyword = urlParams.get('q');
 if (keyword) {
 myFunction(keyword);  // 调用搜索函数并传入关键词作为参数
 }
}