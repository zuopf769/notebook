## array常用工具方法

### indexOf

+ 查询数组中指定元素的索引位置

```

/**
 * 查询数组中指定元素的索引位置
 * @name array.indexOf
 * @function
 * @grammar indexOf(source, match[, fromIndex])
 * @param {Array} source 需要查询的数组
 * @param {Any} match 查询项
 * @param {number} [fromIndex] 查询的起始位索引位置，如果为负数，则从source.length + fromIndex往后开始查找
 *             
 * @returns {number} 指定元素的索引位置，查询不到时返回-1
 */
 
function indexOf (source, match, fromIndex) 

```

### contains

+ 判断一个数组中是否包含给定元素

```

/**
 * 判断一个数组中是否包含给定元素
 * @name array.contains
 * @function
 * @grammar contains(source, obj)
 * @param {Array} source 需要判断的数组.
 * @param {Any} obj 要查找的元素.
 * @return {boolean} 判断结果.
 * @author berg
 */
var contains = function(source, obj) {

```



### each

+ 遍历数组中所有元素

```
/**
 * 遍历数组中所有元素
 * @name baidu.array.each
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

```


### empty

+ 清空一个数组

```
/**
 * 清空一个数组
 * @name empty
 * @function
 * @grammar empty(source)
 * @param {Array} source 需要清空的数组.
 * @author berg
 */
var empty = function(source) {

```

### every

+ 判断一个数组中是否所有元素都满足给定条件

```
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

```

### filter

+ 从数组中筛选符合条件的元素

```
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

```

### find

+ 从数组中寻找符合条件的第一个元素

```
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

```

### hash

+ 从数组中寻找符合条件的第一个元素

```
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

```

### lastIndexOf

+ 从数组中寻找符合条件的第一个元素

```
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
```

### map

+遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组。

```
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
```

### reduce

+遍历数组中所有元素，将每一个元素应用方法进行合并，并返回合并后的结果

```
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
```

### remove

+ 移除数组中的项

```

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
```

### removeAt

+ 移除数组中的项

```

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
```


### some

+ 判断一个数组中是否有部分元素满足给定条件

```

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
```

### unique

+ 过滤数组中的相同项。如果两个元素相同，会删除后一个元素。

```

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
```





