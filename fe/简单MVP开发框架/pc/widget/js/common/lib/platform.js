/* eslint-disable */

/**
 * 判断是否为android平台
 * @property android 是否为android平台
 * @grammar platform.android
 * @meta standard
 * @see platform.x11,platform.windows,platform.macintosh,platform.iphone,platform.ipad
 * @return {Boolean} 布尔值
 * @author jz
 */
var isAndroid = /android/i.test(navigator.userAgent);

exports.isAndroid = isAndroid;


/**
 * 判断是否为ipad平台
 * @property ipad 是否为ipad平台
 * @grammar platform.ipad
 * @meta standard
 * @see platform.x11,platform.windows,platform.macintosh,platform.iphone,platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
var isIpad = /ipad/i.test(navigator.userAgent);

exports.isIpad = isIpad;


/**
 * 判断是否为iphone平台
 * @property iphone 是否为iphone平台
 * @grammar platform.iphone
 * @meta standard
 * @see platform.x11,platform.windows,platform.macintosh,platform.ipad,platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
var isIphone = /iphone/i.test(navigator.userAgent);

exports.isIphone = isIphone;


/**
 * 判断是否为macintosh平台
 * @property macintosh 是否为macintosh平台
 * @grammar platform.macintosh
 * @meta standard
 * @see platform.x11,platform.windows,platform.iphone,platform.ipad,platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
var isMacintosh = /macintosh/i.test(navigator.userAgent);

exports.isMacintosh = isMacintosh;


/**
 * 判断是否为windows平台
 * @property windows 是否为windows平台
 * @grammar platform.windows
 * @meta standard
 * @see platform.x11,platform.macintosh,platform.iphone,platform.ipad,platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
var isWindows = /windows/i.test(navigator.userAgent);

exports.isWindows = isWindows;


/**
 * 判断是否为x11平台
 * @property x11 是否为x11平台
 * @grammar platform.x11
 * @meta standard
 * @see platform.windows,platform.macintosh,platform.iphone,platform.ipad,platform.android
 * @return {Boolean} 布尔值
 * @author jz
 */
var isX11 = /x11/i.test(navigator.userAgent);

exports.isX11 = isX11;

