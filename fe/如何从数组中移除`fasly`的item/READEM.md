
## 如何从数组中移除`fasly`的item

[左鹏飞](https://github.com/zuopf769) 2018.11.25

### 背景

我们经常会使用ECMAScirpt5中Array类中的`filter`方法来过滤符合条件的item；那么如何从数组中移除`fasly`(false, null, undefined, 0, NaN or an empty string)的item呢？

```
var a=[1,2,"b",0,{},"",NaN,3,undefined,null,5];
var b=a.filter(Boolean); // [1,2,"b",{},3,5]
```


### 原理

Boolean 是一个函数，它会对遍历数组中的元素，并根据元素的真假类型，对应返回true或false.
例如：

```
Boolean(0); // false
Boolean(true); // true
Boolean(1); // true
Boolean(""); // false
Boolean("false"); // true. "false"是一个非空字符串
```

实际上，下面这样的写法是一种简写模式

```
b = a.filter(Boolean);
```

它等价于

```
b = a.filter(function (x) { return Boolean(x); });
```

### 参考文献

http://www.devign.me/javascript-tip-remove-falsy-items-out-of-an-array
