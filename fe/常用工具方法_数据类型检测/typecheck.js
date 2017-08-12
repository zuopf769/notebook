/**
 * 判断目标参数是否string类型或String对象
 * @name isString
 * @function
 * @grammar isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 *
 * @returns {boolean} 类型判断结果
 */
var isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

module.exports.isString = isString;



/**
 * 判断目标参数是否Array对象
 * @name isArray
 * @function
 * @grammar baidu.lang.isArray(source)
 * @param {Any} source 目标参数
 * @meta standard
 *
 * @returns {boolean} 类型判断结果
 */
var isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

module.exports.isArray = isArray;



/**
 * 判断目标参数是否Boolean对象
 * @name isBoolean
 * @function
 * @grammar isBoolean(source)
 * @param {Any} source 目标参数
 * @version 1.3
 *
 * @returns {boolean} 类型判断结果
 */
var isBoolean = function(o) {
    return typeof o === 'boolean';
};

module.exports.isBoolean = isBoolean;



/**
 * 判断目标参数是否为Date对象
 * @name isDate
 * @function
 * @grammar isDate(source)
 * @param {Any} source 目标参数
 * @version 1.3
 *
 * @returns {boolean} 类型判断结果
 */
var isDate = function(o) {
    // return o instanceof Date;
    return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
};

module.exports.isDate = isDate;


/**
 * 判断目标参数是否为function或Function实例
 * @name isFunction
 * @function
 * @grammar isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
var isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};

module.exports.isFunction = isFunction;



/**
 * 判断目标参数是否number类型或Number对象
 * @name isNumber
 * @function
 * @grammar isNumber(source)
 * @param {Any} source 目标参数
 * @meta standard
 *
 * @returns {boolean} 类型判断结果
 * @remark 用本函数判断NaN会返回false，尽管在Javascript中是Number类型。
 */
var isNumber = function (source) {
    return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
};

module.exports.isNumber = isNumber;



/**
 * 判断目标参数是否为Object对象
 * @name baidu.lang.isObject
 * @function
 * @grammar baidu.lang.isObject(source)
 * @param {Any} source 目标参数
 * @shortcut isObject
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isObject = function (source) {
    return 'function' == typeof source || !!(source && 'object' == typeof source);
};

module.exports.isObject = isObject;


/**
 * 判断目标参数是否为Element对象
 * @name isElement
 * @function
 * @grammar isElement(source)
 * @param {Any} source 目标参数
 * @meta standard
 *
 * @returns {boolean} 类型判断结果
 */
var isElement = function (source) {
    return !!(source && source.nodeName && source.nodeType == 1);
};

module.exports.isElement = isElement;

