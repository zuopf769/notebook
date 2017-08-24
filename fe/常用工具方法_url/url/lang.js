/**
 * 判断目标参数是否Array对象
 * @name lang.isArray
 * @function
 * @grammar lang.isArray(source)
 * @param {Any} source 目标参数
 * @meta standard
 *
 * @returns {boolean} 类型判断结果
 */
var isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

module.exports.isArray = isArray;