/* ============================================================
   站点总表：下载站页、全网搜索页、条目详情页的「在某站搜索」
   全部读这一份。加一个新站，只改这里，三处同时生效。

   字段说明：
     name    站名
     url     主页地址
     search  搜索地址模板，{q} 代表关键词。
             填了就直接跳到对方的搜索结果页；
             留空 "" 就只跳首页，让人自己在站内搜。
     tag     标签。「友链」= 对方站上确实放了本站的链接；否则写「其他」
     desc    一句话说明，显示在下载站页
     host    显示的域名，一般就是 url 去掉 https://

   加站步骤：照最后一条抄一段，改名字、地址、说明，行末逗号别丢。
   ============================================================ */
window.SEARCH_SITES = [

    /* 实测对方友链页里链到 ejjava.github.io */
    { name: "J2MECloud 游软下载", url: "http://j2mecloud.ddns.net:3092/",
      search: "http://j2mecloud.ddns.net:3092/search.jsp?keyword={q}",
      tag: "友链", desc: "收录 J2ME 游戏与软件资源，条目带截图与详情页，支持关键词检索。",
      host: "j2mecloud.ddns.net:3092" },

    { name: "52模拟器", url: "http://java.52emu.cn/",
      search: "http://java.52emu.cn/index.php?nkey={q}&qiqi=%E6%90%9C%E7%B4%A2%E6%B8%B8%E6%88%8F",
      tag: "其他", desc: "Java 游戏按类型分栏陈列，站上还有几个跨站搜索入口。",
      host: "java.52emu.cn" },

    { name: "Java游戏小站", url: "https://java.owoemu.com/",
      search: "https://java.owoemu.com/search/{q}/",
      tag: "其他", desc: "近六百条游戏的个人站，附 Java 模拟器与塞班模拟器资料。",
      host: "java.owoemu.com" },

    { name: "JVGME", url: "https://www.jvgme.com/",
      search: "https://www.jvgme.com/search",
      tag: "友链", desc: "带社区功能的 Java 游戏站，分类较细，浏览需要浏览器开启 JavaScript。",
      host: "www.jvgme.com" },

    /* 实测友链区里链到 ejjava.github.io */
    { name: "JAVA游戏资料库", url: "http://jvgm.cc/",
      search: "https://jvgm.cc/search?key={q}",
      tag: "友链", desc: "纯列表式的资料库，逐条编号可点，站内可以按关键词搜。",
      host: "jvgm.cc" },

    { name: "Joyin 的塞班 Java 小站", url: "https://joyin-lidayes.github.io/",
      search: "",
      tag: "友链", desc: "专注塞班与诺基亚时代 J2ME 游戏的个人站，带在线试玩。",
      host: "joyin-lidayes.github.io" },

    { name: "幻蓝小站", url: "https://magicblue.cn/",
      search: "",
      tag: "其他", desc: "多平台应用与老手机游戏资料库，网页与 App 共用，可按原名检索。",
      host: "magicblue.cn" },

    { name: "小众网", url: "https://iniche.cn/",
      search: "",
      tag: "其他", desc: "面向小众机型与软件的综合站，不专做 Java 游戏。",
      host: "iniche.cn" }

];
