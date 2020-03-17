# 深入理解Object.defineProperty的value

## 背景
市面上对于Object.defineProperty的讲解大都集中于下面几个配置项的讲解：

+ `configurable`: 为 true 时，该属性描述符才能够再次被改变，同时该属性也能从对应的对象上被删除。默认为 false。
+ `enumerable `：为true时，该属性才能够出现在对象的枚举属性中。
+ `writable `： 为true时，属性的值才能被 ‘=’ 赋值。
+ `get`： 当访问(获取)该属性时，该方法会被执行。
+ `set`：当修改属性值时，触发执行该方法。

而对value属性的讲解都是一笔带过，通常就是简单的说`value`表示属性的值，然后就没有然后了，这样会导致大家都忽略了对其进行深入的理解。

## value的定义

我截取了MDN中对value的定义如下，需要配合着writable来看：

``` JavaScript
 value：表示该属性的值。可以是任何有效的JS值（字符串、数值、对象、函数等）。默认为undefined。

 writable：表示该属性的值是否可写，默认为false。当且仅当属性的writable为true时，其值才能被赋值运算符改变。

```

## value值为字符串、数值、对象

value值为字符串、数值、对象很好理解，通常用来初始化变量时的赋值

```JavaScript
var obj = {};

// 在对象中添加一个属性与数据描述符的示例
Object.defineProperty(obj, "a", {
  value : 20,  // 属性 a 的初始化值是37
  writable : true,  // 可修改值内容
  enumerable : true, // 可枚举，默认 false
  configurable : true // 可删除，默认 false
});
```

这种效果和 obj.a = 20 一样；还可以这么写

```JavaScript
var obj = {};
var bValue;
Object.defineProperty(obj, "a", {
  get : function(){
    return bValue;
  },
  set : function(newValue){
    bValue = newValue;
  },
  writable : true,  // 可修改值内容
  enumerable : true, // 可枚举，默认 false
  configurable : true // 可删除，默认 false
});

obj.a = 20;

```

## value值为function
先看个demo

```JavaScript
function def (obj, key) {
    Object.defineProperty(obj, key, {
        writable: true,
        enumerable: true,
        configurable: true,
        value: function(...args) {
            console.log('key', key);
            console.log('args', args); 
        }
    });
}
 
// 定义一个方法
let obj = {
    push() {}
}
 
// 方法的绑定
def(obj, 'push');
 
obj.push([1, 2], 7, 'hello!');
// 控制台输出 key push
// 控制台输出 args [Array(2), 7, "hello!"]

```

通过如上代码我们就可以知道，用户使用了某个对象上的方法后方法名以及参数我们都可以拦截到，利用这个拦截的过程就可以做一些变化的通知。


```
const arrayProto = Array.prototype // 获取Array的原型
 
function def (obj, key) {
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        value: function(...args) {
            console.log(key); // 控制台输出 push
            console.log(args); // 控制台输出 [Array(2), 7, "hello!"]
            
            // 获取原生的方法
            let original = arrayProto[key];
            // 将开发者的参数传给原生的方法，保证数组按照开发者的想法被改变
            const result = original.apply(this, args);
 
            // do something 比如通知Vue视图进行更新
            console.log('我的数据被改变了，视图该更新啦');
            this.text = 'hello Vue';
            return result;
        }
    });
}
 
// 新的原型
let obj = {
    push() {}
}
 
// 重写赋值
def(obj, 'push');
 
let arr = [0];
 
// 原型的指向重写
arr.__proto__ = obj;
 
// 执行push
arr.push([1, 2], 7, 'hello!');

console.log(arr);
```
大家可能发现了，其实上面的代码就是vue原代码中不支持__proto__时候的实现方案


## vue源码解析

在进行数据observer绑定的时候，先判断是否hasProto，如果存在__proto__，就直接将value 的 __proto__指向重写过后的原型。如果不能使用 __proto__，貌似有些浏览器厂商没有实现。那就直接循环 arrayMethods把它身上的这些方法直接装到 value 身上好了。毕竟调用某个方法是先去自身查找，当自身找不到这关方法的时候，才去原型上查找。

```
// 判断是否有__proto__，因为部分浏览器是没有__proto__
const hasProto = '__proto__' in {}
// 重写后的原型
import { arrayMethods } from './array'
// 方法名
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

// 数组的处理
export function observeArray (value) {
    // 如果有__proto__，直接覆盖                
    if (hasProto) {
        protoAugment(value, arrayMethods);
    } else {
        // 没有__proto__就把方法加到属性自身上
        copyAugment(value, arrayMethods, )
    }
}

// 原型的赋值
function protoAugment (target, src) {
    target.__proto__ = src;
}

// 复制
function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i]
        def(target, key, src[key]);
    }
}

```

Vue在array.js中重写了methodsToPatch中七个方法，并将重写后的原型暴露出去。

```
// Object.defineProperty的封装
import { def } from '../util/index' 

// 获得原型上的方法
const arrayProto = Array.prototype 

// Vue拦截的方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

// 将上面的方法重写
methodsToPatch.forEach(function (method) {
    def(arrayMethods, method, function mutator (...args) {
        console.log('method', method); // 获取方法
        console.log('args', args); // 获取参数

    	// ...功能如上述，监听到某个方法执行后，做一些对应的操作
      	// 1、将开发者的参数传给原生的方法，保证数组按照开发者的想法被改变
        // 2、视图更新等
    })
})
```

