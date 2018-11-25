# javascript的惰性函数是个什么东东？

##  背景

大家应该都听说过JavaScript的立即执行函数，但是惰性函数是个什么东东？通过下面的🌰大家就知道为什么会有惰性函数式？

我们知道javascript最大的问题就是浏览器的兼容问题，一个api在不同的浏览器调用的结果是不一样的，有的时候我们需要通过if判断来实现不同的兼容问题：

```
function addEvent (type, element, fun) {
    if (element.addEventListener) {
        element.addEventListener(type, fun, false);
    }    else if(element.attachEvent){
        element.attachEvent('on' + type, fun);
    }    else{
        element['on' + type] = fun;
    }
}
```
上面是一个兼容不同浏览器事件绑定的方法，但是，他有一个问题：

每次调用这个方法都要进行if判断，如果浏览器支持其中的一个方法，那么它就永远支持了，没有必要每次调用都要执行一次if判断。

## 惰性函数

惰性函数的出现就是为了解决上面的bug，所谓的惰性函数就是if分支只会执行一次，之后调用函数时，直接进入所支持的分支代码。

### 方案一

第一种方案是函数在第一次调用时，对函数本身进行二次处理，该函数会被覆盖为符合分支条件的函数，这样对原函数的调用就不用再经过执行的分支了，我们可以用下面的方式使用惰性载入重写addEvent()。

```
function addEvent (type, element, fun) {
    if (element.addEventListener) {
        addEvent = function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    } else if(element.attachEvent){
        addEvent = function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    } else{
        addEvent = function (type, element, fun) {
            element['on' + type] = fun;
        }
    }   
    return addEvent(type, element, fun);
}
```

在这个惰性载入的addEvent()中，if语句的每个分支都会为addEvent变量赋值，有效覆盖了原函数。最后一步便是调用了新赋函数。下一次调用addEvent()的时候，便会直接调用新赋值的函数，这样就不用再执行if语句了。


### 方案二

在声明函数时就指定适当的函数。这样在第一次调用函数时就不会损失性能了，只在代码加载时会损失一点性能。一下就是按照这一思路重写的addEvent()。

```
var addEvent = (function () {  
    if (document.addEventListener) {  
        return function (type, element, fun) {
            element.addEventListener(type, fun, false);
        }
    }  
   else if (document.attachEvent) {  
        return function (type, element, fun) {
            element.attachEvent('on' + type, fun);
        }
    }  
    else {        
        return function (type, element, fun) {
            element['on' + type] = fun;
        }
   }
})();
```

这个例子中使用的技巧是创建一个匿名的自执行函数，通过不同的分支以确定应该使用哪个函数实现，实际的逻辑都一样，不一样的地方就是使用了函数表达式（使用了var定义函数）和新增了一个匿名函数，另外每个分支都返回一个正确的函数，并立即将其赋值给变量addEvent。

惰性载入函数的优点只执行一次if分支，避免了函数每次执行时候都要执行if分支和不必要的代码，因此提升了代码性能，至于那种方式更合适，就要看您的需求而定了。

## 优缺点

### 优点
惰性载入函数有两个主要优点，

1、是显而易见的效率问题，虽然在第一次执行的时候函数会意味赋值而执行的慢一些，但是后续的调用会因为避免的重复检测更快；

2、是要执行的适当代码只有当实际调用函数是才执行，很多JavaScript库在在加载的时候就根据浏览器不同而执行很多分支，把所有东西实现设置好，而惰性载入函数将计算延迟，不影响初始脚本的执行时间。

### 缺点

当重定义自身时已经添加到原始函数的任何属性丢会丢失。

如果该函数使用了不同的名称，比如分配给不同的变量或者以对象的方法来使用，那么重定义部分将永远不会发生，并且将会执行原始函数体。

## 总结

+ 惰性函数的实现原理就是重新定义函数：

+ 惰性思想的精髓:能一次搞定的事，我绝不做第二次：初始化程序并且只仅需执行一次的时候，这种方式非常有用，可以避免频繁的逻辑判断和避免重复的工作，提升应用程序的性能


