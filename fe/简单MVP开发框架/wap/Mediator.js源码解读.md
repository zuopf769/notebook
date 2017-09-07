## Mediator.js源码解读

### 导读

+ Mediator的中文意思就是中介者，主要用于功能模块的解耦，各模块间通过事件监听和触发来互相通信
+ 继承自lang.Class；拥有on、off等事件绑定、解绑的功能
+ Mediator在lang.Class的事件基础上重写了fire，新增了promise的功能

### fire的promise then功能示例

```
    Mediator.fire('s:getContent', {
	pn: pn
    }).then(function (contentData) {
    
	Mediator.fire('v:createZoomView', {
	    element: options.element,
	    index: options.index,
	    src: contentData
	});
	
	
    });
```

有了promise功能就不用在通过事件来通信了



### 代码地址

 [代码地址](https://github.com/zuopf769/notebook/blob/master/fe/%E7%AE%80%E5%8D%95MVP%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6/wap/widget/lib/mediator.js)

### 源码解读
```
var isArguments = function (obj) {
    return !!obj.hasOwnProperty('callee');
};
```
+ 该方法是判断obj是不是arguments(类数组对象，即有属性length的对象)
+ arguments.callee是当前方法的引用

```
// event是事件类型
fire: function (event, options) {
    // 是字符串就new lang.Event
    lang.isString(event) && (event = new lang.Event(event));
    
    // __listeners是个对象，存放事件和事件处理器的map， 每个key又是个链表
    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        if (options.hasOwnProperty(i)) {
            event[i] = options[i];
        }
    }

    var n;
    var me = this;
    var t = me.__listeners;
    // 事件类型
    var p = event.type;
    // dfd对象
    var dfd = new $.Deferred();
    
    var cb;
    var result;
    var promise;

    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf('on') && (p = 'on' + p);
	
    // 如果me[p]是function类型直接执行
    typeof me[p] === 'function' && me[p].apply(me, arguments);
	
    // 这里判断是object，其实是存放event handler的数组
    if (typeof t[p] === 'object') {
        for (i = 0, n = t[p].length; i < n; i++) {
        	  // handler
            cb = t[p][i];
            // 给handler上加静态属性_dfd
            cb._dfd = dfd;
            result = cb.apply(me, arguments);
				
	    // 如果handler返回的是promise， 通常s:xxx的事件handler都返回promise
            if (this.isPromise(result)) {
                promise = result;
            }

        }
    }

    return promise || event.returnValue;
}
```

+ `cb = t[p][i]` 为相应的事件handler 
+ `cb._dfd = dfd`这句非常重要： 上面有句` var dfd = new $.Deferred()` ；给cb，即handler上加静态属性_dfd；为啥要给handler上加静态属性_dfd？其实是为了方便在hander内部优雅的取到promise对象；代码如下：

```
var dfd = Mediator.getDeferred(args);

```
getDeferred方法如下

```
getDeferred: function (arg) {

    if (!isArguments(arg)) {
        throw new Error('getDeferred arguments error.');
    }

    if (arg.callee.hasOwnProperty('_dfd')
        && !lang.isObject(arg.callee._dfd)) {

        throw new Error('getDeferred arguments have not deferred');
    }
	
	 // arg.callee即当前方法
    return arg.callee._dfd;
},

```

比如在注册事件时的handler里面，调用`Mediator.getDeferred(args);`时，`arg.callee`就是这里的cb`cb = t[p][i];`,尔cb上加了静态属性`cb._dfd = dfd;`


所以下面的代码中可以很优雅的`getDeferred`

```
Mediator.on('s:getContent', function (e) {
    var pn = e.pn || 1;
    var rn = e.rn || config.rn;
    var args = arguments;
    var dfd = Mediator.getDeferred(args);
    flow(pn, rn)
        .then(function (data) {
            dfd.resolve(data);
        });
    return dfd.promise();
});
```

```
when: function (name) {
    var me = this;
    var args = [].slice.call(arguments, 0);
    var promises = [];

    $.each(args, function (i, item) {
        promises.push(me.fire.call(me, item));
    });

    return $.when.apply($, promises);
},
```

该方法主要是用于多个promise并发执行


```
lang.createSingle(Mediator);
```
上面的代码是继承lang.class,让其拥有class的事件处理的功能
