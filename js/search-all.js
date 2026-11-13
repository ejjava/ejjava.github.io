/* 全网搜索：读 data/search-sites.js，把关键词同时套进各站的搜索地址。
   本站不抓取、不缓存任何结果，点开只是把关键词带到对方站点。 */
(function () {
    var input = document.getElementById('q');
    var form = document.getElementById('q-form');
    var list = document.getElementById('all-results');
    var tip = document.getElementById('all-tip');
    if (!form || !input || !list) return;

    function render() {
        var q = (input.value || '').trim();
        list.innerHTML = '';
        if (!q) {
            if (tip) tip.hidden = false;
            return;
        }
        if (tip) tip.hidden = true;

        var sites = window.SEARCH_SITES || [];
        sites.forEach(function (s) {
            var li = document.createElement('li');
            var a = document.createElement('a');
            a.className = 'site-link';
            a.target = '_blank';
            a.rel = 'noopener nofollow';
            if (s.search) {
                a.href = s.search.replace('{q}', encodeURIComponent(q));
                a.textContent = '在 ' + s.name + ' 搜索「' + q + '」→';
            } else {
                a.href = s.url;
                a.textContent = '打开 ' + s.name + '（站内自己搜）→';
            }
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        render();
    });
    input.addEventListener('input', render);

    location.search.replace(/^\?/, '').split('&').forEach(function (kv) {
        var p = kv.split('=');
        if (p[0] === 'q' && p[1]) {
            input.value = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
    });
    if (input.value) render();
})();
