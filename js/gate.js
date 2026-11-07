/* E简JAVA 访问口令
   首次打开页面需要输入口令，通过后记在本机（localStorage），之后不再弹。

   注意：这是纯前端门槛，口令写在源码里，懂行的人看代码或改 localStorage 就能绕过，
   只挡得住路过的人、随手转发的链接和一般爬虫，不能当作真正的保密措施。
   换口令或让大家重新输入：把 CODE 改成新值即可（老访客会被要求重新输入一次）。
*/
(function () {
    'use strict';

    var KEY = 'ej_gate_v';
    var CODE = 'ejjava520';

    /* 本机存的不是"已通过"这个标记，而是当前口令的指纹。
       口令不变，输一次就一直记得；口令改了，指纹对不上，所有人重新输一次。 */
    function fp(s) {
        var h = 0, i;
        for (i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) | 0; }
        return String(h);
    }
    var WANT = fp(CODE);

    function passed() {
        try { return window.localStorage.getItem(KEY) === WANT; } catch (e) { return false; }
    }
    function remember() {
        try { window.localStorage.setItem(KEY, WANT); } catch (e) {}
    }

    if (passed()) { return; }

    document.documentElement.setAttribute('data-gate', 'locked');

    var css = [
        '#gate-mask{position:fixed;top:0;right:0;bottom:0;left:0;z-index:99999;',
        'background:rgba(246,242,233,.55);',
        'display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-align:center;align-items:center;',
        '-webkit-box-pack:center;justify-content:center;padding:24px;',
        'font-family:-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;color:#2b2620}',
        '#gate-box{width:100%;max-width:320px;background:#fff;border:1px solid #ddd5c6;border-radius:6px;',
        'padding:26px 22px;text-align:center;box-shadow:0 6px 24px rgba(0,0,0,.06)}',
        '#gate-box h1{font-size:17px;margin:0 0 6px;font-weight:600;letter-spacing:.02em}',
        '#gate-box p{margin:0 0 16px;font-size:13px;color:#6b6355;line-height:1.6}',
        '#gate-box .gate-tip{display:block;margin-top:9px;font-size:12px;color:#8d8474;letter-spacing:.02em}',
        '#gate-input{width:100%;box-sizing:border-box;padding:10px 12px;font-size:15px;',
        'border:1px solid #cfc7b8;border-radius:4px;outline:none;text-align:center;background:#fbf9f4;color:#2b2620}',
        '#gate-input:focus{border-color:#8a7b5f}',
        '#gate-btn{margin-top:12px;width:100%;padding:10px 0;font-size:15px;border:0;border-radius:4px;',
        'background:#3d362b;color:#fff;cursor:pointer;letter-spacing:.06em}',
        '#gate-btn:hover{background:#2b2620}',
        '#gate-err{margin:10px 0 0;font-size:12px;color:#a4402f;min-height:16px}'
    ].join('');

    var head = document.head || document.getElementsByTagName('head')[0];
    if (head) {
        var st = document.createElement('style');
        st.type = 'text/css';
        st.appendChild(document.createTextNode(css));
        head.appendChild(st);
    }

    function build() {
        if (document.getElementById('gate-mask')) { return; }

        var mask = document.createElement('div');
        mask.id = 'gate-mask';
        mask.innerHTML =
            '<div id="gate-box">' +
            '<h1>E简JAVA</h1>' +
            '<p>这是一个存档中的游戏资料库。<br>请输入访问口令。<br>' +
            '<span class="gate-tip">口令获取：QQ 群 901594028</span></p>' +
            '<input id="gate-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">' +
            '<button id="gate-btn" type="button">进 入</button>' +
            '<p id="gate-err"></p>' +
            '</div>';
        document.body.appendChild(mask);

        var input = document.getElementById('gate-input');
        var btn = document.getElementById('gate-btn');
        var err = document.getElementById('gate-err');

        function tryPass() {
            var v = (input.value || '').replace(/\s+/g, '').toLowerCase();
            if (v === CODE) {
                remember();
                document.documentElement.removeAttribute('data-gate');
                if (mask.parentNode) { mask.parentNode.removeChild(mask); }
            } else {
                err.textContent = v ? '口令不对。' : '请先输入口令。';
                try { input.focus(); } catch (e) {}
            }
        }

        btn.onclick = tryPass;
        input.onkeydown = function (e) {
            var k = e.keyCode || e.which;
            if (k === 13) { tryPass(); }
        };
        try { input.focus(); } catch (e) {}
    }

    if (document.body) { build(); }
    else if (document.addEventListener) { document.addEventListener('DOMContentLoaded', build, false); }
    else { window.onload = build; }
})();
