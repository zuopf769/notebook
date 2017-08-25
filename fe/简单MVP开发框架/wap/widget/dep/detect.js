/**
 * @file detect.js
 */


var $ = Zepto;

/**
 * @name $.browser
 * @desc 扩展zepto中对browser的检测
 *
 * **可用属性**
 * - ***qq*** 检测qq浏览器
 * - ***uc*** 检测uc浏览器, 有些老版本的uc浏览器，不带userAgent和appVersion标记，无法检测出来
 * - ***baidu*** 检测baidu浏览器
 * - ***version*** 浏览器版本
 *
 * @example
 * if ($.browser.qq) {      //在qq浏览器上打出此log
 *     console.log('this is qq browser');
 * }
 */
var ua = navigator.userAgent;
var br = $.browser;
var detects = {
    qq: /MQQBrowser\/([\d.]+)/i,
    uc: /UCBrowser\/([\d.]+)/i,
    baidu: /baidubrowser\/.*?([\d.]+)/i,
    wechat: /MicroMessenger\/([\d.]+)/i
};
var ret;

$.each(detects, function (i, re) {

    if ((ret = ua.match(re))) {
        br[i] = true;
        br.version = ret[1];
        // 使用septo原生的方法判断浏览器的时候，会把国产浏览器都判断成safari，所以在这里如果遇到国产浏览器，统一把safari设置成false
        br.safari = false;

        // 终端循环
        return false;
    }
});

// uc还有一种规则，就是appVersion中带 Uc字符
if (!br.uc && /Uc/i.test(navigator.appVersion)) {
    br.uc = true;
}
