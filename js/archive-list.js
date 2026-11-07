/* E简JAVA 档案目录渲染器
   展示书目信息、按关键词检索。不含任何文件下载地址。
   数据来源优先级：window.ARCHIVE_DATA（data/archive.js，本地直接双击打开也能用）
                → window.ARCHIVE_DATA_URL → ./data/archive.json
   （飞书多维表格同步后，data/archive.js 与 data/archive.json 同时生成）
*/
(function () {
    'use strict';

    var PER_PAGE = 20;
    var DATA_URL = window.ARCHIVE_DATA_URL || './data/archive.json';

    var el = {
        list: document.getElementById('list'),
        count: document.getElementById('count'),
        empty: document.getElementById('empty'),
        pager: document.getElementById('pager'),
        search: document.getElementById('q')
    };
    if (!el.list) { return; }

    var all = [];
    var view = [];
    var query = '';
    var page = 1;
    var timer = null;

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function match(item, q) {
        if (!q) { return true; }
        var hay = [item.name, item.kind, item.ver, item.res, item.vendor, item.year, item.desc].join(' ');
        return hay.toLowerCase().indexOf(q) !== -1;
    }

    function renderPager(pages) {
        if (pages <= 1) {
            el.pager.hidden = true;
            el.pager.innerHTML = '';
            return;
        }
        el.pager.hidden = false;
        el.pager.innerHTML =
            '<button class="btn" type="button" data-go="' + (page - 1) + '"' + (page <= 1 ? ' disabled' : '') + '>上一页</button>' +
            '<span>' + page + ' / ' + pages + '</span>' +
            '<button class="btn" type="button" data-go="' + (page + 1) + '"' + (page >= pages ? ' disabled' : '') + '>下一页</button>';
    }

    function render() {
        var total = view.length;
        var pages = Math.max(1, Math.ceil(total / PER_PAGE));
        if (page > pages) { page = pages; }
        if (page < 1) { page = 1; }

        var start = (page - 1) * PER_PAGE;
        var slice = view.slice(start, start + PER_PAGE);
        var html = '';

        for (var i = 0; i < slice.length; i++) {
            var it = slice[i];
            var tags = '';
            if (it.kind) { tags += '<span class="tag bare">' + esc(it.kind) + '</span>'; }
            if (it.vendor) { tags += '<span class="tag bare">' + esc(it.vendor) + '</span>'; }
            if (it.year) { tags += '<span class="tag bare">' + esc(it.year) + '</span>'; }
            if (it.ver) { tags += '<span class="tag">' + esc(it.ver) + '</span>'; }
            if (it.res) { tags += '<span class="tag res">' + esc(it.res) + '</span>'; }
            /* 未核对完的条目明确标出来，不混在已核对里 */
            if (it.status && it.status !== '已核对') { tags += '<span class="tag pending">' + esc(it.status) + '</span>'; }
            html += '<li class="rec">' +
                    '<span class="no">' + (start + i + 1) + '</span>' +
                    '<span class="nm"><a href="./detail.html?' + (it.id ? 'g=' + encodeURIComponent(it.id) : 'n=' + encodeURIComponent(it.name || '')) + '">' + esc(it.name || '（未命名）') + '</a></span>' +
                    '<span class="meta">' + tags + '</span>' +
                    (it.desc ? '<p class="desc">' + esc(it.desc) + '</p>' : '') +
                    '</li>';
        }
        el.list.innerHTML = html;

        el.count.textContent = total
            ? '共 ' + total + ' 条 · 第 ' + page + ' / ' + pages + ' 页'
            : '共 0 条';

        if (!total) {
            el.empty.hidden = false;
            el.empty.innerHTML = all.length
                ? '没有匹配的条目。'
                : '目录正在重建中，还没有录入条目。<br>新条目先从表格整理，再同步到这里。';
        } else {
            el.empty.hidden = true;
        }

        renderPager(pages);
    }

    function applyQuery(q) {
        query = String(q || '').trim().toLowerCase();
        view = all.filter(function (it) { return match(it, query); });
        page = 1;
        render();
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); }
    }

    function boot(data) {
        all = Array.isArray(data) ? data : (data && data.items) || [];
        all = all.filter(function (it) { return it && it.name; });
        view = all.slice();
        render();
    }

    function explainFallback() {
        if (!el.empty) { return; }
        el.empty.hidden = false;
        el.empty.innerHTML = '数据没有加载出来。<br>' +
            '如果是直接双击打开本地文件，浏览器会拦截读取 data 目录，请改用本地服务访问，' +
            '或确认 data/archive.js 已经生成。';
    }

    function load() {
        /* 内联数据优先：data/archive.js 定义 window.ARCHIVE_DATA，
           用 <script> 引入不受 file:// 的跨域限制 */
        if (typeof window.ARCHIVE_DATA !== 'undefined' && Array.isArray(window.ARCHIVE_DATA) && window.ARCHIVE_DATA.length) {
            boot(window.ARCHIVE_DATA);
            return;
        }
        if (typeof fetch !== 'function') {
            boot([]);
            explainFallback();
            return;
        }
        fetch(DATA_URL, { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : []; })
            .then(function (data) { boot(data); })
            .catch(function () { boot([]); explainFallback(); });
    }

    /* 搜索：200ms 防抖 */
    if (el.search) {
        el.search.addEventListener('input', function () {
            clearTimeout(timer);
            var v = el.search.value;
            timer = setTimeout(function () { applyQuery(v); }, 200);
        });
    }

    /* 分页 */
    if (el.pager) {
        el.pager.addEventListener('click', function (e) {
            var t = e.target;
            if (!t || !t.getAttribute) { return; }
            var go = t.getAttribute('data-go');
            if (!go) { return; }
            page = parseInt(go, 10) || 1;
            render();
            try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
        });
    }

    load();
})();
