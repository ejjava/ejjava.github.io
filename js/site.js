/* E简JAVA · 通用站点脚本（无第三方依赖） */
(function () {
    'use strict';

    /* ---------- 老手机自动转到纯文字版 ---------- */
    var ua = navigator.userAgent || '';
    var legacy = /Nokia|Symbian|Series40|Series60|MIDP|CLDC|Opera Mini|Opera Mobi|BlackBerry|MAUI|NetFront|UP\.Browser|IEMobile|Windows CE|Dolphin|Minimo/i.test(ua);
    var here = (location.pathname.split('/').pop() || 'index.html');
    if (legacy && here !== 'lite.html') {
        location.replace('./lite.html');
        return;
    }

    /* ---------- 通知面板：关闭后在本地记住 ---------- */
    var notice = document.getElementById('notice');
    if (notice) {
        var key = 'ejjava.notice.' + (notice.getAttribute('data-id') || 'v1');
        var hide = function () { notice.style.display = 'none'; };
        try {
            if (localStorage.getItem(key) === 'closed') { hide(); }
        } catch (e) { /* 隐私模式下忽略 */ }
        var x = notice.querySelector('.notice-x');
        if (x) {
            x.addEventListener('click', function () {
                hide();
                try { localStorage.setItem(key, 'closed'); } catch (e) {}
            });
        }
    }

    /* ---------- 移动端导航自动滚到当前项 ---------- */
    var on = document.querySelector('.nav a.on');
    if (on && on.scrollIntoView) {
        try { on.scrollIntoView({ block: 'nearest', inline: 'center' }); } catch (e) {}
    }

    /* ---------- 看板娘：只在桌面端加载，避免挡住手机上的正文 ---------- */
    if (window.innerWidth > 900) {
        var l2d = document.createElement('script');
        l2d.src = './kbn/autoload.js';
        document.body.appendChild(l2d);
    }
})();
