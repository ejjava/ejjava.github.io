/* E简JAVA 条目详情页渲染器
   从 data/archive.js 的 window.ARCHIVE_DATA 里按名称取出条目，
   渲染名称、类型、发行商、年份、版本、分辨率、说明。
   若条目将来带上 pic 字段（图片地址），会渲染截图区。
*/
(function () {
    'use strict';

    var el = {
        entry: document.getElementById('entry'),
        name: document.getElementById('entry-name'),
        sub: document.getElementById('entry-sub'),
        spec: document.getElementById('entry-spec'),
        desc: document.getElementById('entry-desc'),
        sites: document.getElementById('site-list'),
        empty: document.getElementById('entry-empty')
    };
    if (!el.entry) { return; }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* 系列名：取名称里第一个冒号或空格之前的部分
       「狂野飙车 3：街头狂飙」→ 狂野飙车；「真实足球 2008」→ 真实足球 */
    function seriesKey(name) {
        var s = String(name == null ? '' : name).trim();
        s = s.split('：')[0].split(':')[0];
        s = s.trim().split(' ')[0];
        return s.replace(/\s+/g, '');
    }

    function param(k) {
        var q = location.search.replace(/^\?/, '').split('&');
        for (var i = 0; i < q.length; i++) {
            if (!q[i]) { continue; }
            var p = q[i].split('=');
            if (decodeURIComponent(p[0]) === k) {
                return decodeURIComponent((p[1] || '').replace(/\+/g, ' '));
            }
        }
        return '';
    }

    /* 详情页地址：有稳定编号就优先用编号，改名也不会断；
       没有编号的旧数据退回用名称，保证老链接还能开 */
    function entryHref(it) {
        if (!it) { return './detail.html'; }
        return './detail.html?' + (it.id
            ? 'g=' + encodeURIComponent(it.id)
            : 'n=' + encodeURIComponent(it.name || ''));
    }

    function showEmpty() {
        if (el.empty) { el.empty.hidden = false; }
        if (el.entry) { el.entry.hidden = true; }
    }

    var data = window.ARCHIVE_DATA;
    if (!Array.isArray(data) || !data.length) {
        showEmpty();
        return;
    }

    /* 先按稳定编号找，再退回按名称找（兼容以前发出去的 ?n= 链接） */
    var gid = param('g');
    var key = param('n');
    var item = null;
    for (var i = 0; i < data.length; i++) {
        if (gid && data[i] && data[i].id === gid) { item = data[i]; break; }
    }
    if (!item && key) {
        for (var k = 0; k < data.length; k++) {
            if (data[k] && data[k].name === key) { item = data[k]; break; }
        }
    }
    if (!item) { showEmpty(); return; }

    document.title = item.name + ' · E简JAVA';

    var fLink = document.getElementById('feishu-link');
    if (fLink && window.RECORD_LINKS && window.RECORD_LINKS[item.name]) {
        fLink.href = window.RECORD_LINKS[item.name];
    }

    el.name.textContent = item.name;
    el.sub.textContent = [item.kind, item.vendor, item.year].filter(Boolean).join(' · ');

    /* 收录状态：飞书里标的核验进度直接显示出来，不藏着 */
    var stEl = document.getElementById('entry-status');
    if (stEl) {
        var stv = String(item.status == null ? '' : item.status).trim();
        if (stv === '已核对') {
            stEl.className = 'stamp ok';
            stEl.textContent = '已核对';
            stEl.hidden = false;
        } else if (stv) {
            stEl.className = 'stamp pending';
            stEl.textContent = stv;
            stEl.hidden = false;
        }
    }

    var TODO = '<span class="todo">待考</span>';

    var rows = [];
    if (item.vendor) { rows.push(['发行商', item.vendor]); }
    if (item.year) { rows.push(['年份', item.year]); }
    if (item.kind) { rows.push(['类型', item.kind]); }
    if (item.ver) { rows.push(['版本', item.ver]); }
    else { rows.push(['版本', TODO, true]); }
    if (item.res) { rows.push(['适配分辨率', item.res]); }
    else { rows.push(['适配分辨率', TODO, true]); }
    if (item.lang) { rows.push(['语言', item.lang]); }
    if (item.size) { rows.push(['容量', item.size]); }
    if (item.source) {
        var src = String(item.source);
        var cell = /^https?:\/\//i.test(src)
            ? '<a href="' + esc(src) + '" target="_blank" rel="noopener nofollow">在 MobyGames 检索这个作品 ↗</a>'
            : esc(src);
        rows.push(['资料来源', cell, true]);
    } else {
        rows.push(['资料来源', TODO, true]);
    }
    el.spec.innerHTML = rows.map(function (r) {
        var v = r[2] ? r[1] : esc(r[1]);
        return '<dt>' + esc(r[0]) + '</dt><dd>' + v + '</dd>';
    }).join('');

    el.desc.innerHTML = item.desc ? '<p>' + esc(item.desc) + '</p>' : '';

    /* 引用这一条：给一段能直接粘走的文字，方便别人写文章或发帖时引用 */
    var citeEl = document.getElementById('cite-text');
    var citeHint = document.getElementById('cite-hint');
    var citeBtn = document.getElementById('cite-copy');

    var bits = ['《' + item.name + '》'];
    if (item.vendor) { bits.push(item.vendor); }
    if (item.year) { bits.push(item.year + ' 年'); }
    if (item.kind) { bits.push(item.kind); }
    var citeLine = bits.join('，') + '。E简JAVA 档案';
    if (item.id) { citeLine += '，条目编号 ' + item.id; }
    if (item.source) {
        var srcTxt = String(item.source);
        citeLine += '，资料来源：' + (/^https?:\/\//i.test(srcTxt) ? 'MobyGames' : srcTxt);
    }
    citeLine += '。';
    if (citeEl) { citeEl.textContent = citeLine; }

    function fallbackCopy(txt, done) {
        var ta = document.createElement('textarea');
        ta.value = txt;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        done(ok);
    }

    if (citeBtn) {
        citeBtn.addEventListener('click', function () {
            var txt = citeEl ? citeEl.textContent : '';
            function done(ok) {
                if (!citeHint) { return; }
                citeHint.textContent = ok ? '已复制' : '复制失败，请手动选中上面的文字';
                setTimeout(function () { citeHint.textContent = ''; }, 2600);
            }
            /* 本地 file:// 打开时浏览器常禁用剪贴板接口，退回老办法 */
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(txt).then(function () { done(true); },
                    function () { fallbackCopy(txt, done); });
            } else {
                fallbackCopy(txt, done);
            }
        });
    }

    /* 第三方站点检索：只生成跳转地址，不抓取、不预览、不转存对方内容 */
    var sites = window.SEARCH_SITES || [];
    if (el.sites) {
        var q = encodeURIComponent(item.name);
        var links = [];
        for (var s = 0; s < sites.length; s++) {
            var site = sites[s];
            if (!site || !site.name) { continue; }
            var hasSearch = !!site.search;
            var direct = hasSearch && site.search.indexOf('{q}') !== -1;
            /* 带 {q} 的站点直接把关键词塞进地址；
               只给了搜索页、但站点不支持地址传参的，就打开那个搜索页让用户自己输 */
            var href = direct ? site.search.replace(/\{q\}/g, q)
                              : (hasSearch ? site.search : (site.url || ''));
            if (!href) { continue; }
            var label = direct
                ? '在 ' + site.name + ' 搜索「' + item.name + '」'
                : (hasSearch ? '打开 ' + site.name + ' 的搜索页' : '打开 ' + site.name);
            links.push('<li><a class="site-link" href="' + esc(href) + '" target="_blank" rel="noopener nofollow">' +
                       esc(label) + ' <span class="site-arrow">↗</span></a></li>');
        }
        el.sites.innerHTML = links.length
            ? links.join('')
            : '<li class="quiet">检索站点清单还是空的，可以在 data/search-sites.js 里添加。</li>';
    }

    /* 同一系列：按名称推断系列名，把同系列各代按年份排开，标出当前这一条 */
    var seriesBox = document.getElementById('series');
    var seriesList = document.getElementById('series-list');
    if (seriesBox && seriesList) {
        var sk = seriesKey(item.name);
        var group = [];
        for (var q = 0; q < data.length; q++) {
            var sib = data[q];
            if (!sib || !sib.name) { continue; }
            if (seriesKey(sib.name) === sk) { group.push(sib); }
        }
        if (group.length >= 2) {
            group.sort(function (a, b) {
                var av = /^\d{4}$/.test(String(a.year == null ? '' : a.year)) ? String(a.year) : '9999';
                var bv = /^\d{4}$/.test(String(b.year == null ? '' : b.year)) ? String(b.year) : '9999';
                if (av !== bv) { return av < bv ? -1 : 1; }
                return String(a.name).localeCompare(String(b.name), 'zh');
            });
            seriesList.innerHTML = group.map(function (o) {
                var tail = [o.year, o.vendor, o.kind].filter(Boolean).join(' · ');
                if (o.name === item.name) {
                    return '<li class="cur">' + esc(o.name) +
                           '<span class="rel-meta">' + esc(tail) + ' · 当前</span></li>';
                }
                return '<li><a href="' + entryHref(o) + '">' +
                       esc(o.name) + '</a><span class="rel-meta">' + esc(tail) + '</span></li>';
            }).join('');
            seriesBox.hidden = false;
        }
    }

    /* 同类档案：同类型或同发行商的其他条目，纯从本地数据里挑，不额外查证 */
    var relBox = document.getElementById('related');
    var relList = document.getElementById('rel-list');
    if (relBox && relList) {
        var sameKind = [];
        var sameVendor = [];
        for (var m = 0; m < data.length; m++) {
            var other = data[m];
            if (!other || other.name === item.name) { continue; }
            if (item.kind && other.kind === item.kind) { sameKind.push(other); }
            else if (item.vendor && other.vendor === item.vendor) { sameVendor.push(other); }
        }
        var picked = sameKind.slice(0, 6).concat(sameVendor.slice(0, 3));
        if (picked.length) {
            relList.innerHTML = picked.map(function (o) {
                var tail = [o.kind, o.vendor, o.year].filter(Boolean).join(' · ');
                return '<li><a href="' + entryHref(o) + '">' +
                       esc(o.name) + '</a><span class="rel-meta">' + esc(tail) + '</span></li>';
            }).join('');
            relBox.hidden = false;
        }
    }

    el.entry.hidden = false;
})();
