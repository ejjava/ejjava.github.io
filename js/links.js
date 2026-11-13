/* 下载站页：把 data/search-sites.js 里的站点渲染成卡片 */
(function () {
    'use strict';

    var box = document.getElementById('site-list');
    if (!box || !window.SEARCH_SITES || !window.SEARCH_SITES.length) { return; }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    var out = '';
    for (var i = 0; i < window.SEARCH_SITES.length; i++) {
        var s = window.SEARCH_SITES[i];
        out += '<a class="link-item" href="' + esc(s.url) + '" target="_blank" rel="noopener nofollow">' +
            '<span class="link-name">' + esc(s.name) +
            '<span class="link-tag">' + esc(s.tag || '其他') + '</span></span>' +
            '<span class="link-desc">' + esc(s.desc || '') + '</span>' +
            '<span class="link-host">' + esc(s.host || '') + '</span>' +
            '</a>';
    }
    box.innerHTML = out;
})();
