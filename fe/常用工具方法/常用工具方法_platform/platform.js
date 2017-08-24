
/**
 * 判断是否为android平台
 * @property android 是否为android平台
 * @grammar platform.android
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isAndroid = /android/i.test(navigator.userAgent);

module.exports.isAndroid = isAndroid;


/**
 * 判断是否为ipad平台
 * @property ipad 是否为ipad平台
 * @grammar platform.ipad
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isIpad = /ipad/i.test(navigator.userAgent);

module.exports.isIpad = isIpad;


/**
 * 判断是否为iphone平台
 * @property iphone 是否为iphone平台
 * @grammar platform.iphone
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isIphone = /iphone/i.test(navigator.userAgent);

module.exports.isIphone = isIphone;


/**
 * 判断是否为macintosh平台
 * @property macintosh 是否为macintosh平台
 * @grammar platform.macintosh
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isMacintosh = /macintosh/i.test(navigator.userAgent);

module.exports.isMacintosh = isMacintosh;


/**
 * 判断是否为windows平台
 * @property windows 是否为windows平台
 * @grammar platform.windows
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isWindows = /windows/i.test(navigator.userAgent);

module.exports.isWindows = isWindows;


/**
 * 判断是否为x11平台
 * @property x11 是否为x11平台
 * @grammar platform.x11
 * @meta standard
 * @return {Boolean} 布尔值
 */
var isX11 = /x11/i.test(navigator.userAgent);

module.exports.isX11 = isX11;

