/* E简JAVA 类型索引渲染器
   把 data/archive.js 的条目按玩法类型归并，点类型名展开该类型的全部条目。
   只读本地数据，不请求任何外部资源。
*/
(function () {
    'use strict';

    var box = document.getElementById('cats');
    var overview = document.getElementById('c-overview');
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
        var k = String(it.kind == null ? '' : it.kind).trim() || '类型待考';
        if (!groups[k]) { groups[k] = []; names.push(k); }
        groups[k].push(it);
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

    /* 每种类型里出现的厂商，用来在标题行上给一句横切面判断 */
    function vendorsOf(list) {
        var m = {};
        var seq = [];
        for (var i = 0; i < list.length; i++) {
            var v = String(list[i].vendor == null ? '' : list[i].vendor).trim();
            if (!v) { continue; }
            if (!m[v]) { m[v] = 0; seq.push(v); }
            m[v] += 1;
        }
        seq.sort(function (a, b) { return m[b] - m[a]; });
        return seq.slice(0, 3);
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

        var vv = vendorsOf(list);
        var meta = list.length + ' 条' + (span(list) ? ' · ' + span(list) : '') +
                   (vv.length ? ' · 主要厂商 ' + vv.join(' / ') : '');

        html += '<section class="v-box">' +
                '<button class="v-head" type="button" aria-expanded="false">' +
                '<span class="v-name">' + esc(name) + '</span>' +
                '<span class="v-meta">' + esc(meta) + '</span>' +
                '<span class="v-arrow" aria-hidden="true">＋</span>' +
                '</button>' +
                '<ul class="rel-list v-list" hidden>';

        for (var m = 0; m < list.length; m++) {
            var e = list[m];
            var tail = [e.year, e.vendor].filter(Boolean).join(' · ');
            html += '<li><a href="./detail.html?' + (e.id ? 'g=' + encodeURIComponent(e.id) : 'n=' + encodeURIComponent(e.name)) + '">' +
                    esc(e.name) + '</a>' +
                    (tail ? '<span class="rel-meta">' + esc(tail) + '</span>' : '') + '</li>';
        }

        html += '</ul></section>';
    }

    box.innerHTML = html;

    if (overview) {
        overview.textContent = names.length + ' 个类型，共 ' + total + ' 条。点类型名展开这一类下的全部条目。';
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
