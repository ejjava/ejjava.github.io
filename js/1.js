function myFunction() {
  // 声明变量
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('myInput');
  filter = input.value.toUpperCase();
  ul = document.getElementById("myUL");
  li = ul.getElementsByTagName('li');
 
  // 循环遍历所有列表项，并隐藏那些与搜索查询不匹配的项
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
// 加密算法
function encrypt(code) {
  var encryptedCode = '';
  for (var i = 0; i < code.length; i++) {
    var charCode = code.charCodeAt(i);
    encryptedCode += String.fromCharCode(charCode + 1);
  }
  return encryptedCode;
}

// 解密算法
function decrypt(encryptedCode) {
  var decryptedCode = '';
  for (var i = 0; i < encryptedCode.length; i++) {
    var charCode = encryptedCode.charCodeAt(i);
    decryptedCode += String.fromCharCode(charCode - 1);
  }
  return decryptedCode;
}

// 检查本地存储中的激活码
function checkActivationCode() {
  var encryptedCode = localStorage.getItem('activationCode');
  if (encryptedCode) {
    // 如果已保存激活码，则解密并验证
    var savedCode = decrypt(encryptedCode);
    verifyActivationCode(savedCode);
  } else {
    showInputBox();
  }
}

// 弹出输入框进行验证
function showInputBox() {
  var userInput = prompt('请输入激活码(Q群901594028获取)');
  verifyActivationCode(userInput);
}

// 验证激活码
function verifyActivationCode(code) {
  var encryptedInput = encrypt(code);
  var encryptedValidCode = encrypt('42daba5b9860d18a29ef7c2f8144b29c');
  if (encryptedInput === encryptedValidCode) {
    var encryptedCode = encrypt(code);
    localStorage.setItem('activationCode', encryptedCode);
     
  } else {
    showInputBox();
  }
}

// 每六秒检查一次激活码
setInterval(checkActivationCode, 2000);