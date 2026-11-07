/* E简JAVA 年份线渲染器
   把 data/archive.js 里的条目按发行年份分组，从近到远排开。
   只读本地数据，不请求任何外部资源。
*/
(function () {
    'use strict';

    var box = document.getElementById('tl');
    if (!box) { return; }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var data = window.ARCHIVE_DATA;
    if (!Array.isArray(data) || !data.length) {
        box.innerHTML = '<p class="quiet">档案数据还没有生成，请先跑一次同步。</p>';
        return;
    }

    /* 年份字段可能是 "2008"，也可能是 "2000 年代" 这类模糊值 */
    function yearOf(it) {
        var y = String(it.year == null ? '' : it.year).trim();
        return /^\d{4}$/.test(y) ? parseInt(y, 10) : null;
    }

    var groups = {};
    var order = [];
    var unknown = [];

    for (var i = 0; i < data.length; i++) {
        var it = data[i];
        if (!it || !it.name) { continue; }
        var y = yearOf(it);
        if (y === null) { unknown.push(it); continue; }
        if (!groups[y]) { groups[y] = []; order.push(y); }
        groups[y].push(it);
    }

    order.sort(function (a, b) { return b - a; });

    function itemHtml(it) {
        var tail = [it.vendor, it.kind].filter(Boolean).join(' · ');
        return '<li><a href="./detail.html?' + (it.id ? 'g=' + encodeURIComponent(it.id) : 'n=' + encodeURIComponent(it.name)) + '">' +
               esc(it.name) + '</a>' +
               (tail ? '<span class="rel-meta">' + esc(tail) + '</span>' : '') + '</li>';
    }

    function sectionHtml(title, list) {
        var sorted = list.slice().sort(function (a, b) {
            return String(a.name).localeCompare(String(b.name), 'zh');
        });
        var out = '<section class="tl-year"><h2>' + esc(title) +
                  '<span class="tl-count">' + sorted.length + ' 条</span></h2><ul class="rel-list">';
        for (var k = 0; k < sorted.length; k++) { out += itemHtml(sorted[k]); }
        out += '</ul></section>';
        return out;
    }

    var html = '';
    var counted = data.length - unknown.length - 0;

    if (order.length) {
        var oldest = order[order.length - 1];
        var newest = order[0];
        html += '<p class="quiet">' + oldest + ' — ' + newest + ' 年，跨 ' +
                order.length + ' 个年份，' + counted + ' 条有明确年份' +
                (unknown.length ? '，另有 ' + unknown.length + ' 条年份待定' : '') + '。</p>';
    }

    for (var j = 0; j < order.length; j++) {
        html += sectionHtml(order[j] + ' 年', groups[order[j]]);
    }
    if (unknown.length) {
        html += sectionHtml('年份待定', unknown);
    }

    box.innerHTML = html;
})();
