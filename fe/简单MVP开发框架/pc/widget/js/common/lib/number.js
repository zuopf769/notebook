/* eslint-disable */
/**
 * 为目标数字添加逗号分隔
 * @name baidu.number.comma
 * @function
 * @grammar baidu.number.comma(source[, length])
 * @param {number} source 需要处理的数字
 * @param {number} [length] 两次逗号之间的数字位数，默认为3位
 *
 * @returns {string} 添加逗号分隔后的字符串
 */
var comma = function (source, length) {
    if (!length || length < 1) {
        length = 3;
    }

    source = String(source).split(".");
    source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
    return source.join(".");
};

exports.comma = comma;


/**
 * 对目标数字进行0补齐处理
 * @name baidu.number.pad
 * @function
 * @grammar baidu.number.pad(source, length)
 * @param {number} source 需要处理的数字
 * @param {number} length 需要输出的长度
 *
 * @returns {string} 对目标数字进行0补齐处理后的结果
 */
var pad = function (source, length) {
    var pre = "",
        negative = (source < 0),
        string = String(Math.abs(source));

    if (string.length < length) {
        pre = (new Array(length - string.length + 1)).join('0');
    }

    return (negative ?  "-" : "") + pre + string;
};

exports.pad = pad;



/**
 * 生成随机整数，范围是[min, max]
 * @name baidu.number.randomInt
 * @function
 * @grammar baidu.number.randomInt(min, max)
 *
 * @param 	{number} min 	随机整数的最小值
 * @param 	{number} max 	随机整数的最大值
 * @return 	{number} 		生成的随机整数
 */
var randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.randomInt = randomInt;

