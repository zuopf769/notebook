## mumber常用工具方法


### comma

```
/**
 * 为目标数字添加逗号分隔
 * @name comma
 * @function
 * @grammar comma(source[, length])
 * @param {number} source 需要处理的数字
 * @param {number} [length] 两次逗号之间的数字位数，默认为3位
 *
 * @returns {string} 添加逗号分隔后的字符串
 */
var comma = function (source, length) {
```

### pad

```
/**
 * 对目标数字进行0补齐处理
 * @name pad
 * @function
 * @grammar pad(source, length)
 * @param {number} source 需要处理的数字
 * @param {number} length 需要输出的长度
 *
 * @returns {string} 对目标数字进行0补齐处理后的结果
 */
var pad = function (source, length) {
```

### randomInt

```
/**
 * 生成随机整数，范围是[min, max]
 * @name randomInt
 * @function
 * @grammar randomInt(min, max)
 *
 * @param   {number} min    随机整数的最小值
 * @param   {number} max    随机整数的最大值
 * @return  {number}        生成的随机整数
 */
var randomInt = function(min, max){
```

