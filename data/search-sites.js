/* 第三方检索站点清单（2026-11 更新）
   -----------------------------------------------------------
   要加站点，就照下面的格式加一行：
   { name: "站点名", url: "主页地址", search: "搜索地址模板" }

   search 是搜索页的地址模板，用 {q} 代表游戏名。
   填了 search，详情页会直接跳到该站点的搜索页；
   留空（""）的话只跳到站点首页，由用户自己在站内搜。

   本清单里的 search 都是各站自己页面上那个搜索框实际用的地址，
   逐个用真实关键词试过，能出结果才写进来。

   注意：这里只放跳转地址，不写抓取规则。
   本站不抓取、不预览、不转存第三方站点的任何资源或链接。
   ----------------------------------------------------------- */
window.SEARCH_SITES = [

    /* 搜索框 action="/search.jsp"，参数 keyword，实测返回「共127条记录」 */
    { name: "J2MECloud 游软下载", url: "http://j2mecloud.ddns.net:3092/",
      search: "http://j2mecloud.ddns.net:3092/search.jsp?keyword={q}" },

    /* 搜索框 action="index.php#results"，参数 nkey，提交键 qiqi 必须带上 */
    { name: "52模拟器", url: "http://java.52emu.cn/",
      search: "http://java.52emu.cn/index.php?nkey={q}&qiqi=%E6%90%9C%E7%B4%A2%E6%B8%B8%E6%88%AF" },

    /* WordPress 站，搜索参数是 s，实测返回「包含关键字 xx 的文章」 */
    { name: "Java游戏小站", url: "https://java.owoemu.com/",
      search: "https://java.owoemu.com/?s={q}" },

    /* 单页应用，搜索是一个独立页面，关键词要在页内再输一次 */
    { name: "JVGME", url: "https://www.jvgme.com/",
      search: "https://www.jvgme.com/search" },

    /* 纯列表式资料库，没有站内搜索，只能进首页翻 */
    { name: "JAVA游戏资料库", url: "http://jvgm.cc/", search: "" },

    { name: "小众网", url: "https://iniche.cn/", search: "" }
];
