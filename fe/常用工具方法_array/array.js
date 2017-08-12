/**
 * 查询数组中指定元素的索引位置
 * @name indexOf
 * @function
 * @grammar indexOf(source, match[, fromIndex])
 * @param {Array} source 需要查询的数组
 * @param {Any} match 查询项
 * @param {number} [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length + fromIndex往后开始查找
 *             
 * @returns {number} 指定元素的索引位置，查询不到时返回-1
 */
var indexOf = function (source, match, fromIndex) {
    var len = source.length,
        iterator = match;
    // 单竖杠可以进行取整运算，就是只保留正数部分，小数部分通过拿掉    
    fromIndex = fromIndex | 0;
    if (fromIndex < 0) {//小于0
        fromIndex = Math.max(0, len + fromIndex);
    }
    for ( ; fromIndex < len; fromIndex ++) {
        if(fromIndex in source && source[fromIndex] === match) {
            return fromIndex;
        }
    }
    
    return -1;
};

module.exports.indexOf = indexOf;

/**
 * 判断一个数组中是否包含给定元素
 * @name contains
 * @function
 * @grammar contains(source, obj)
 * @param {Array} source 需要判断的数组.
 * @param {Any} obj 要查找的元素.
 * @return {boolean} 判断结果.
 * @author berg
 */
var contains = function(source, obj) {
    return (indexOf(source, obj) >= 0);
};

module.exports.contains = contains;


/**
 * 遍历数组中所有元素
 * @name each 
 * @function
 * @grammar each(source, iterator[, thisObject])
 * @param {Array} source 需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)。
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @remark
 * each方法不支持对Object的遍历,对Object的遍历使用object.each 。
 * @shortcut each
 * @meta standard
 *             
 * @returns {Array} 遍历的数组
 */
 
var each = function (source, iterator, thisObject) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            //TODO
            //此处实现和标准不符合，标准中是这样说的：
            //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
            returnValue = iterator.call(thisObject || source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

module.exports.each = each;
module.exports.forEach = each;


/**
 * 清空一个数组
 * @name empty
 * @function
 * @grammar empty(source)
 * @param {Array} source 需要清空的数组.
 * @author berg
 */
var empty = function(source) {
    source.length = 0;
};

module.exports.empty = empty;

/**
 * 判断一个数组中是否所有元素都满足给定条件
 * @name every
 * @function every(source, iterator[,thisObject])
 * @param {Array} source 需要判断的数组.
 * @param {Function} iterator 判断函数.
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {boolean} 判断结果.
 * @see some
 */
var every = function(source, iterator, thisObject) {
    var i = 0,
        len = source.length;
    for (; i < len; i++) {
        if (i in source && !iterator.call(thisObject || source, source[i], i)) {
            return false;
        }
    }
    return true;
};

module.exports.every = every;


/**
 * 从数组中筛选符合条件的元素
 * @name filter
 * @function
 * @grammar filter(source, iterator[, thisObject])
 * @param {Array} source 需要筛选的数组
 * @param {Function} iterator 对每个数组元素进行筛选的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)，函数需要返回true或false
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @meta standard
 * @see find
 *             
 * @returns {Array} 符合条件的数组项集合
 */

var filter = function (source, iterator, thisObject) {
    var result = [],
        resultIndex = 0,
        len = source.length,
        item,
        i;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            //TODO
            //和标准不符，see array.each
            if (true === iterator.call(thisObject || source, item, i)) {
                // resultIndex用于优化对result.length的多次读取
                result[resultIndex++] = item;
            }
        }
    }
    
    return result;
};

module.exports.filter = filter;

/**
 * 从数组中寻找符合条件的第一个元素
 * @name find
 * @function
 * @grammar find(source, iterator)
 * @param {Array} source 需要查找的数组
 * @param {Function} iterator 对每个数组元素进行查找的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)，函数需要返回true或false
 * @see filter,indexOf
 *             
 * @returns {Any|null} 符合条件的第一个元素，找不到时返回null
 */
var find = function (source, iterator) {
    var item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            if (true === iterator.call(source, item, i)) {
                return item;
            }
        }
    }
    
    return null;
};

module.exports.find = find;

/**
 * 将两个数组参数合并成一个类似hashMap结构的对象，这个对象使用第一个数组做为key，使用第二个数组做为值，如果第二个参数未指定，则把对象的所有值置为true。
 * @name hash
 * @function
 * @grammar hash(keys[, values])
 * @param {Array} keys 作为key的数组
 * @param {Array} [values] 作为value的数组，未指定此参数时，默认值将对象的值都设为true。
 *             
 * @returns {Object} 合并后的对象{key : value}
 */
var hash = function(keys, values) {
    var o = {}, vl = values && values.length, i = 0, l = keys.length;
    for (; i < l; i++) {
        o[keys[i]] = (vl && vl > i) ? values[i] : true;
    }
    return o;
};

module.exports.hash = hash;



/**
 * 从后往前，查询数组中指定元素的索引位置
 * @name lastIndexOf
 * @function
 * @grammar lastIndexOf(source, match)
 * @param {Array} source 需要查询的数组
 * @param {Any} match 查询项
 * @param {number} [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length+fromIndex往前开始查找
 * @see indexOf
 *             
 * @returns {number} 指定元素的索引位置，查询不到时返回-1
 */

var lastIndexOf = function (source, match, fromIndex) {
    var len = source.length;

    fromIndex = fromIndex | 0;

    if(!fromIndex || fromIndex >= len){
        fromIndex = len - 1;
    }
    if(fromIndex < 0){
        fromIndex += len;
    }
    for(; fromIndex >= 0; fromIndex --){
        if(fromIndex in source && source[fromIndex] === match){
            return fromIndex;
        }
    }
    
    return -1;
};

module.exports.lastIndexOf = lastIndexOf;


/**
 * 遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组。
 * @name map
 * @function
 * @grammar map(source, iterator[, thisObject])
 * @param {Array}    source   需要遍历的数组.
 * @param {Function} iterator 对每个数组元素进行处理的函数.
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {Array} map后的数组.
 * @see reduce
 */
var map = function(source, iterator, thisObject) {
    var results = [],
        i = 0,
        l = source.length;
    for (; i < l; i++) {
        results[i] = iterator.call(thisObject || source, source[i], i);
    }
    return results;
};

module.exports.map = map;

/**
 * 遍历数组中所有元素，将每一个元素应用方法进行合并，并返回合并后的结果。
 * @name reduce
 * @function
 * @grammar reduce(source, iterator[, initializer])
 * @param {Array}    source 需要遍历的数组.
 * @param {Function} iterator 对每个数组元素进行处理的函数，函数接受四个参数：上一次reduce的结果（或初始值），当前元素值，索引值，整个数组.
 * @param {Object}   [initializer] 合并的初始项，如果没有此参数，默认用数组中的第一个值作为初始值.
 * @return {Array} reduce后的值.
 * @version 1.3.4
 * @see reduce
 */
var reduce = function(source, iterator, initializer) {
    var i = 0,
        l = source.length,
        found = 0;

    if( arguments.length < 3){
        //没有initializer的情况，找到第一个可用的值
        for(; i < l; i++){
            initializer = source[i++];
            found = 1;
            break;
        }
        if(!found){
            return ;
        }
    }

    for (; i < l; i++) {
        if( i in source){
            initializer = iterator(initializer, source[i] , i , source);
        }
    }
    return initializer;
};

module.exports.reduce = reduce;


/**
 * 移除数组中的项
 * @name remove
 * @function
 * @grammar remove(source, match)
 * @param {Array} source 需要移除项的数组
 * @param {Any} match 要移除的项
 * @meta standard
 * @see removeAt
 *             
 * @returns {Array} 移除后的数组
 */
var remove = function (source, match) {
    var len = source.length;
        
    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
        }
    }
    return source;
};

module.exports.remove = remove;


/**
 * 移除数组中的项
 * @name removeAt
 * @function
 * @grammar removeAt(source, index)
 * @param {Array} source 需要移除项的数组
 * @param {number} index 要移除项的索引位置
 * @see remove
 * @meta standard
 * @returns {Any} 被移除的数组项
 */
var removeAt = function (source, index) {
    return source.splice(index, 1)[0];
};

module.exports.removeAt = removeAt;


/**
 * 判断一个数组中是否有部分元素满足给定条件
 * @name some
 * @function
 * @grammar some(source, iterator[,thisObject])
 * @param {Array} source 需要判断的数组.
 * @param {Function} iterator 判断函数.
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @return {boolean} 判断结果.
 * @see every
 */
var some = function(source, iterator, thisObject) {
    var i = 0,
        len = source.length;
    for (; i < len; i++) {
        if (i in source && iterator.call(thisObject || source, source[i], i)) {
            return true;
        }
    }
    return false;
};

module.exports.some = some;


/**
 * 过滤数组中的相同项。如果两个元素相同，会删除后一个元素。
 * @name unique
 * @function
 * @grammar unique(source[, compareFn])
 * @param {Array} source 需要过滤相同项的数组
 * @param {Function} [compareFn] 比较两个数组项是否相同的函数,两个数组项作为函数的参数。
 *             
 * @returns {Array} 过滤后的新数组
 */
var unique = function (source, compareFn) {
    var len = source.length,
        result = source.slice(0),
        i, datum;
        
    if ('function' != typeof compareFn) {
        compareFn = function (item1, item2) {
            return item1 === item2;
        };
    }
    
    // 从后往前双重循环比较
    // 如果两个元素相同，删除后一个
    while (--len > 0) {
        datum = result[len];
        i = len;
        while (i--) {
            if (compareFn(datum, result[i])) {
                result.splice(len, 1);
                break;
            }
        }
    }

    return result;
};

module.exports.unique = unique;
