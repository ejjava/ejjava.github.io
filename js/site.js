/* E简JAVA · 通用站点脚本（无第三方依赖） */
(function () {
    'use strict';

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /* ---------- 老手机自动转到文字版 ---------- */
    var ua = navigator.userAgent || '';
    var legacy = /Nokia|Symbian|Series40|Series60|MIDP|CLDC|Opera Mini|Opera Mobi|BlackBerry|MAUI|NetFront|UP\.Browser|IEMobile|Windows CE|Dolphin|Minimo/i.test(ua);
    var here = (location.pathname.split('/').pop() || 'index.html');
    if (legacy && here !== 'lite.html') {
        location.replace('./lite.html');
        return;
    }

    /* ---------- 站点公告：内容来自 data/notice.js ----------
       换掉 SITE_NOTICE.id 就等于发了一条新公告，
       之前关掉的人会重新看到；没换 id 就一直保持关闭。 */
    var notice = document.getElementById('notice');
    if (notice) {
        var N = window.SITE_NOTICE;
        if (!N || !N.id || !N.text) {
            notice.hidden = true;
        } else {
            var storeKey = 'ejjava.notice.seen';
            var seen = '';
            try { seen = localStorage.getItem(storeKey) || ''; } catch (e) {}
            if (seen === N.id) {
                notice.hidden = true;
            } else {
                var html = '<button class="notice-x" type="button" aria-label="关闭">×</button>' +
                    '<p><strong>' + esc(N.title || '') + '</strong>' + esc(N.text) + '</p>';
                if (N.link) {
                    html += '<p class="note"><a href="' + esc(N.link) + '">' + esc(N.linkText || '详情') + ' →</a></p>';
                }
                notice.innerHTML = html;
                notice.hidden = false;
                var x = notice.querySelector('.notice-x');
                if (x) {
                    x.addEventListener('click', function () {
                        notice.hidden = true;
                        try { localStorage.setItem(storeKey, N.id); } catch (e) {}
                    });
                }
            }
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
