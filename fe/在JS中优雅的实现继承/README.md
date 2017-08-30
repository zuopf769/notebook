## 在JS中优雅的实现继承

### 1. Class基类

Class类是该继承机制提供的一个基类，用户可以通过继承lang.Class来获取它的属性及方法。

+ 该类有唯一的id

+ 事件相关的方法

	+ 注册对象的事件监听器
	+ 派发自定义事件
	+ 移除对象的事件监听器
	+ 析构函数，释放对象所持有的资源

### 2. eventCenter类

eventCenter是new的Class类的实例

```
var createSingle = function (json) {
    var c = new Class();

    for (var key in json) {
        c[key] = json[key];
    }
    return c;
};

```

可以当做一个调停者(medirator)类绑定事件和触发事件，进行解耦

因为是单例所以是全局唯一


使用方法：

+ 监听事件

```
lang.eventCenter.addEventListener( 'Reader.zoomChange', function( event ) {
    barCodeIns.fixPosition();
} );

```
+ 触发事件

```
lang.eventCenter.dispatchEvent('flashReaderCreater.before',{options:o,el:me.el});
```
> 关于on/addEventListener,fire/dispatchEvent的选择是，关于自定义的事件用on/fire;关于dom/ui的事件用addEventListener/dispatchEvent


### 3. function createClass(constructor, options)


创建新类的真构造器函数是fn


父类如何不传就是，默认是Class

```
var superClass = options.superClass || Class;

```

构造其中实现了父类的构造器构造器的执行及本生构造器的执行

```
var fn = function(){
    var me = this;

    // 某类在添加该属性控制时，guid将不在全局instances里控制
    options.decontrolled && (me.__decontrolled = true);

    // 继承父类的构造器
    superClass.apply(me, arguments);

    // 全局配置
    for (i in fn.options) me[i] = fn.options[i];

    constructor.apply(me, arguments);

    for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
        reg[i].apply(me, arguments);
    }
};

```


下面该端代码是实现了静态函数的注入（如何注入请看register）

```
for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
        reg[i].apply(me, arguments);
    }
```

需要注意的是这种继承方式带来的 constructor 混乱的问题

```
var C = function(){},
    cp = constructor.prototype;
    C.prototype = superClass.prototype;

// 继承父类的原型（prototype)链
var fp = fn.prototype = new C();

// 修正这种继承方式带来的 constructor 混乱的问题
fp.constructor = cp.constructor;

```

### 4. 向某个类注册插件


注册constructorHook，即在构造函数中执行个函数

```
var reg = Class["\x06r"] || (Class["\x06r"] = []);
reg[reg.length] = constructorHook;
```

在createClass方法中执行该钩子，执行上下文为当前组件，一般用于解耦

```
 for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
     reg[i].apply(me, arguments);
 }

```

挂载到载体类原型链上的方法集，一般为普通对象，或则某个列的prototype对象
```
 for (var method in methods) {
        Class.prototype[method] = methods[method];
    }
```





