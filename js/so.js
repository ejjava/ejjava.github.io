// script.js
document.addEventListener("DOMContentLoaded", function() {
    // 确保数据加载完成
    setTimeout(function() {
        if (!window.items) {
            console.error("Data not loaded. Check data.js file.");
            return;
        }

        // 获取无序列表的引用
        var list = document.getElementById('myList');
        var searchInput = document.getElementById('searchInput');

        // 遍历数组，为每个条目创建一个<li>元素，并添加到列表中
        window.items.forEach(function(item) {
            var listItem = document.createElement('li');
            listItem.textContent = item;
            list.appendChild(listItem);
        });

        // 搜索功能
        searchInput.addEventListener('input', function() {
            var searchTerm = searchInput.value.toLowerCase();
            var listItems = list.getElementsByTagName('li');
            for (var i = 0; i < listItems.length; i++) {
                var listItemText = listItems[i].textContent.toLowerCase();
                if (listItemText.includes(searchTerm)) {
                    listItems[i].style.display = '';
                } else {
                    listItems[i].style.display = 'none';
                }
            }
        });
    }, 1000); // 延迟1秒执行，确保数据加载完成
});

// 在页面加载完毕后执行
document.addEventListener("DOMContentLoaded", function() {
  // 延迟1秒将显示内容切换为隐藏内容
  setTimeout(function() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
  }, 3000);
});