/* eslint-disable */
/**
 * 判断是否为chrome浏览器
 * @grammar baidu.browser.chrome
 * @see browser.ie,browser.firefox,browser.safari,browser.opera
 * @property chrome chrome版本号
 * @return {Number} chrome版本号
 */
var chrome = /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;
exports.chrome = chrome;

/**
 * 判断是否为firefox浏览器
 * @property firefox firefox版本号
 * @grammar browser.firefox
 * @meta standard
 * @return {Number} firefox版本号
 */
var firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;
exports.firefox = firefox;

//IE 8下，以documentMode为准
//在百度模板中，可能会有$，防止冲突，将$1 写成 \x241
/**
 * 判断是否为ie浏览器
 * @name browser.ie
 * @field
 * @grammar browser.ie
 * @returns {Number} IE版本号
 */
var ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
exports.ie = ie;

/**
 * 判断是否为gecko内核
 * @property isGecko
 * @grammar browser.isGecko
 * @meta standard
 * @see browser.isWebkit
 * @returns {Boolean} 布尔值
 */
var isGecko = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
exports.isGecko = isGecko;

/**
 * 判断是否严格标准的渲染模式
 * @property isStrict
 * @grammar browser.isStrict
 * @meta standard
 * @returns {Boolean} 布尔值
 */
var isStrict = document.compatMode == "CSS1Compat";
exports.isStrict = isStrict;

/**
 * 判断是否为webkit内核
 * @property isWebkit
 * @grammar browser.isWebkit
 * @meta standard
 * @see browser.isGecko
 * @returns {Boolean} 布尔值
 */
var isWebkit = /webkit/i.test(navigator.userAgent);
exports.isWebkit = isWebkit;

try {
    if (/(\d+\.\d+)/.test(external.max_version)) {
/**
 * 判断是否为maxthon浏览器
 * @property maxthon maxthon版本号
 * @grammar browser.maxthon
 * @see browser.ie
 * @returns {Number} maxthon版本号
 */
        var maxthon = + RegExp['\x241'];
        exports.maxthon = maxthon;
    }
} catch (e) {}

/**
 * 判断是否为opera浏览器
 * @property opera opera版本号
 * @grammar browser.opera
 * @meta standard
 * @see baidu.browser.ie,baidu.browser.firefox,baidu.browser.safari,baidu.browser.chrome
 * @returns {Number} opera版本号
 */

/**
 * opera 从10开始不是用opera后面的字符串进行版本的判断
 * 在Browser identification最后添加Version + 数字进行版本标识
 * opera后面的数字保持在9.80不变
 */
var opera = /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined;
exports.opera;

(function(){
    var ua = navigator.userAgent;
    /*
     * 兼容浏览器为safari或ipad,其中,一段典型的ipad UA 如下:
     * Mozilla/5.0(iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.10 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21.10
     */

    /**
     * 判断是否为safari浏览器, 支持ipad
     * @property safari safari版本号
     * @grammar browser.safari
     * @meta standard
     */
    var safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
    exports.safari = safari;
})();

