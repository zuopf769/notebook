## object常用工具方法


### isPlain

```
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
```

### clone
```
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
```


### each

```

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
```


### extend

```
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
```

### isEmpty

```

/**
 * 检测一个对象是否是空的，需要注意的是：如果污染了Object.prototype或者Array.prototype，那么isEmpty({})或者baidu.object.isEmpty([])可能返回的就是false.
 * @function
 * @grammar isEmpty(obj)
 * @param {Object} obj 需要检测的对象.
 * @return {boolean} 如果是空的对象就返回true.
 */
var isEmpty = function(obj) {
```


### keys

```

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
```




### values

```

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
```

### map

```

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
```


### merge

```

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
 */
 var merge = function(target, source, opt_options) {
```




