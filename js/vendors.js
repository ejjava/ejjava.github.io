/* E简JAVA 厂商索引渲染器
   把 data/archive.js 的条目按发行商归并，点厂商名展开该厂商的全部条目。
   只读本地数据，不请求任何外部资源。
*/
(function () {
    'use strict';

    var box = document.getElementById('vendors');
    var overview = document.getElementById('v-overview');
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
        if (overview) { overview.textContent = ''; }
        return;
    }

    var groups = {};
    var names = [];

    for (var i = 0; i < data.length; i++) {
        var it = data[i];
        if (!it || !it.name) { continue; }
        var v = String(it.vendor == null ? '' : it.vendor).trim() || '发行商待考';
        if (!groups[v]) { groups[v] = []; names.push(v); }
        groups[v].push(it);
    }

    names.sort(function (a, b) {
        var d = groups[b].length - groups[a].length;
        if (d) { return d; }
        return String(a).localeCompare(String(b), 'zh');
    });

    function span(list) {
        var ys = [];
        for (var k = 0; k < list.length; k++) {
            var y = String(list[k].year == null ? '' : list[k].year).trim();
            if (/^\d{4}$/.test(y)) { ys.push(parseInt(y, 10)); }
        }
        if (!ys.length) { return ''; }
        ys.sort(function (a, b) { return a - b; });
        if (ys[0] === ys[ys.length - 1]) { return String(ys[0]); }
        return ys[0] + '–' + ys[ys.length - 1];
    }

    var html = '';
    var total = 0;

    for (var n = 0; n < names.length; n++) {
        var name = names[n];
        var list = groups[name].slice().sort(function (a, b) {
            var av = /^\d{4}$/.test(String(a.year == null ? '' : a.year)) ? String(a.year) : '9999';
            var bv = /^\d{4}$/.test(String(b.year == null ? '' : b.year)) ? String(b.year) : '9999';
            if (av !== bv) { return av < bv ? -1 : 1; }
            return String(a.name).localeCompare(String(b.name), 'zh');
        });
        total += list.length;

        var meta = list.length + ' 条' + (span(list) ? ' · ' + span(list) : '');

        html += '<section class="v-box">' +
                '<button class="v-head" type="button" aria-expanded="false">' +
                '<span class="v-name">' + esc(name) + '</span>' +
                '<span class="v-meta">' + esc(meta) + '</span>' +
                '<span class="v-arrow" aria-hidden="true">＋</span>' +
                '</button>' +
                '<ul class="rel-list v-list" hidden>';

        for (var m = 0; m < list.length; m++) {
            var e = list[m];
            var tail = [e.year, e.kind].filter(Boolean).join(' · ');
            html += '<li><a href="./detail.html?' + (e.id ? 'g=' + encodeURIComponent(e.id) : 'n=' + encodeURIComponent(e.name)) + '">' +
                    esc(e.name) + '</a>' +
                    (tail ? '<span class="rel-meta">' + esc(tail) + '</span>' : '') + '</li>';
        }

        html += '</ul></section>';
    }

    box.innerHTML = html;

    if (overview) {
        overview.textContent = names.length + ' 家发行商，共 ' + total + ' 条。点厂商名展开这一家的全部条目。';
    }

    box.addEventListener('click', function (ev) {
        var btn = ev.target.closest ? ev.target.closest('.v-head') : null;
        if (!btn) { return; }
        var panel = btn.parentNode.querySelector('.v-list');
        if (!panel) { return; }
        var open = panel.hidden;
        panel.hidden = !open;
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        var arrow = btn.querySelector('.v-arrow');
        if (arrow) { arrow.textContent = open ? '－' : '＋'; }
    });
})();
