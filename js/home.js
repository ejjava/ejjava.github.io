/* E简JAVA 首页：最近收录 + 随便翻一条
   数据来自 data/archive.js 的 window.ARCHIVE_DATA。
   「最近收录」按表格里的录入顺序取末尾几条，不是按发行年份——
   所以一条 1997 年的游戏如果今天才补录，它也会出现在这里。
*/
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var data = window.ARCHIVE_DATA;
    if (!Array.isArray(data) || !data.length) {
        var note = document.getElementById('home-note');
        if (note) { note.textContent = '档案库还是空的，同步一次之后这里会列出新收的条目。'; }
        return;
    }

    var box = document.getElementById('home-recent');
    if (box) {
        var recent = data.slice(-6).reverse();
        box.innerHTML = recent.map(function (it) {
            var tail = [it.vendor, it.year, it.kind].filter(Boolean).join(' · ');
            return '<li><a href="./detail.html?' + (it.id ? 'g=' + encodeURIComponent(it.id) : 'n=' + encodeURIComponent(it.name)) + '">' +
                   esc(it.name) + '</a>' +
                   (tail ? '<span class="rel-meta">' + esc(tail) + '</span>' : '') + '</li>';
        }).join('');
    }

    var note2 = document.getElementById('home-note');
    if (note2) {
        note2.textContent = '共 ' + data.length + ' 条，这里是最近录入的 6 条（按录入顺序，不是按发行年份）。';
    }

    var btn = document.getElementById('random-entry');
    if (btn) {
        btn.addEventListener('click', function () {
            var pick = data[Math.floor(Math.random() * data.length)];
            if (pick && pick.name) {
                location.href = './detail.html?' + (pick.id ? 'g=' + encodeURIComponent(pick.id) : 'n=' + encodeURIComponent(pick.name));
            }
        });
    }
})();
