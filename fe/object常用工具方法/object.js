
/**
 * 判断一个对象是不是字面量对象，即判断这个对象是不是由{}或者new Object类似方式创建
 *
 * @name isPlain
 * @function
 * @grammar isPlain(source)
 * @param {Object} source 需要检查的对象
 * @remark 事实上来说，在Javascript语言中，任何判断都一定会有漏洞，因此本方法只针对一些最常用的情况进行了判断
 * 
 * @returns {Boolean} 检查结果
 */
var isPlain  = function(obj){
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        key;
    if ( !obj ||
         //一般的情况，直接用toString判断
         Object.prototype.toString.call(obj) !== "[object Object]" ||
         //IE下，window/document/document.body/HTMLElement/HTMLCollection/NodeList等DOM对象上一个语句为true
         //isPrototypeOf挂在Object.prototype上的，因此所有的字面量都应该会有这个属性
         //对于在window上挂了isPrototypeOf属性的情况，直接忽略不考虑
         !('isPrototypeOf' in obj)
       ) {
        return false;
    }

    //判断new fun()自定义对象的情况
    //constructor不是继承自原型链的
    //并且原型中有isPrototypeOf方法才是Object
    if ( obj.constructor &&
        !hasOwnProperty.call(obj, "constructor") &&
        !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
    }
    //判断有继承的情况
    //如果有一项是继承过来的，那么一定不是字面量Object
    //OwnProperty会首先被遍历，为了加速遍历过程，直接看最后一项
    for ( key in obj ) {}
    return key === undefined || hasOwnProperty.call( obj, key );
};

module.exports.isPlain = isPlain;

var isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};
/**
 * 对一个object进行深度拷贝
 *
 * @author berg
 * @name clone
 * @function
 * @grammar clone(source)
 * @param {Object} source 需要进行拷贝的对象
 * @remark
 * 对于Object来说，只拷贝自身成员，不拷贝prototype成员
 * @meta standard
 *
 * @returns {Object} 拷贝后的新对象
 */
var clone  = function (source) {
    var result = source, i, len;
    if (!source
        || source instanceof Number
        || source instanceof String
        || source instanceof Boolean) {
        return result;
    } else if (isArray(source)) {
        result = [];
        var resultLen = 0;
        for (i = 0, len = source.length; i < len; i++) {
            result[resultLen++] = clone(source[i]);
        }
    } else if (isPlain(source)) {
        result = {};
        for (i in source) {
            if (source.hasOwnProperty(i)) {
                result[i] = clone(source[i]);
            }
        }
    }
    return result;
};

module.exports.clone = clone;


/**
 * 遍历Object中所有元素，1.1.1增加
 * @name each
 * @function
 * @grammar each(source, iterator)
 * @param {Object} source 需要遍历的Object
 * @param {Function} iterator 对每个Object元素进行调用的函数，function (item, key)
 * @version 1.1.1
 *
 * @returns {Object} 遍历的Object
 */
var each = function (source, iterator) {
    var returnValue, key, item;
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);

                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

module.exports.each = each;


/**
 * 将源对象的所有属性拷贝到目标对象中
 * @name extend
 * @function
 * @grammar extend(target, source)
 * @param {Object} target 目标对象
 * @param {Object} source 源对象
 * @remark
 *
1.目标对象中，与源对象key相同的成员将会被覆盖。<br>
2.源对象的prototype成员不会拷贝。

 * @shortcut extend
 * @meta standard
 *
 * @returns {Object} 目标对象
 */
var extend = function (target, source) {
    for (var p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p];
        }
    }

    return target;
};

module.exports.extend = extend;


/**
 * 检测一个对象是否是空的，需要注意的是：如果污染了Object.prototype或者Array.prototype，那么isEmpty({})或者baidu.object.isEmpty([])可能返回的就是false.
 * @function
 * @grammar isEmpty(obj)
 * @param {Object} obj 需要检测的对象.
 * @return {boolean} 如果是空的对象就返回true.
 */
var isEmpty = function(obj) {
    for (var key in obj) {
        return false;
    }

    return true;
};

module.exports.isEmpty = isEmpty;

/**
 * 获取目标对象的键名列表
 * @name baidu.object.keys
 * @function
 * @grammar baidu.object.keys(source)
 * @param {Object} source 目标对象
 * @see baidu.object.values
 *
 * @returns {Array} 键名列表
 */
var keys = function (source) {
    var result = [], resultLen = 0, k;
    for (k in source) {
        if (source.hasOwnProperty(k)) {
            result[resultLen++] = k;
        }
    }
    return result;
};

module.exports.keys = keys;


/**
  * 获取目标对象的值列表
  * @name values
  * @function
  * @grammar values(source)
  * @param {Object} source 目标对象
  *
  * @returns {Array} 值列表
  */
 var values = function (source) {
     var result = [], resultLen = 0, k;
     for (k in source) {
         if (source.hasOwnProperty(k)) {
             result[resultLen++] = source[k];
         }
     }
     return result;
 };

 module.exports.values = values;

/**
 * 遍历object中所有元素，将每一个元素应用方法进行转换，返回转换后的新object。
 * @name map
 * @function
 * @grammar map(source, iterator)
 *
 * @param   {Array}    source   需要遍历的object
 * @param   {Function} iterator 对每个object元素进行处理的函数
 * @return  {Array}             map后的object
 */
var map = function (source, iterator) {
    var results = {};
    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            results[key] = iterator(source[key], key);
        }
    }
    return results;
};

module.exports.map = map;


/*
 * 默认情况下，所有在源对象上的属性都会被非递归地合并到目标对象上
 * 并且如果目标对象上已有此属性，不会被覆盖
 */
/**
 * 合并源对象的属性到目标对象。
 *
 * @name merge
 * @function
 * @grammar merge(target, source[, opt_options])
 *
 * @param {Function} target 目标对象.
 * @param {Function} source 源对象.
 * @param {Object} opt_options optional merge选项.
 * @config {boolean} overwrite optional 如果为真，源对象属性会覆盖掉目标对象上的已有属性，默认为假.
 * @config {string[]} whiteList optional 白名单，默认为空，如果存在，只有在这里的属性才会被处理.
 * @config {boolean} recursive optional 是否递归合并对象里面的object，默认为否.
 * @return {object} merge后的object.
 * @see baidu.object.extend
 * @author berg
 */

function mergeItem(target, source, index, overwrite, recursive) {
    if (source.hasOwnProperty(index)) {
        if (recursive && isPlain(target[index])) {
            // 如果需要递归覆盖，就递归调用merge
            merge(
                target[index],
                source[index],
                {
                    'overwrite': overwrite,
                    'recursive': recursive
                }
            );
        } else if (overwrite || !(index in target)) {
            // 否则只处理overwrite为true，或者在目标对象中没有此属性的情况
            target[index] = source[index];
        }
    }
}

var merge = function(target, source, opt_options) {
    var i = 0,
        options = opt_options || {},
        overwrite = options['overwrite'],
        whiteList = options['whiteList'],
        recursive = options['recursive'],
        len;

    // 只处理在白名单中的属性
    if (whiteList && whiteList.length) {
        len = whiteList.length;
        for (; i < len; ++i) {
            mergeItem(target, source, whiteList[i], overwrite, recursive);
        }
    } else {
        for (i in source) {
            mergeItem(target, source, i, overwrite, recursive);
        }
    }

    return target;
};

module.exports.merge = merge;

