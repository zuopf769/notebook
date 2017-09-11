## js实现手机横竖屏事件

在做H5项目时，需要在横竖屏变化时，做一些处理。毫无疑问，需要使用orientationchange来监听横竖屏的变化。

### 方案1 orientationchange事件

```
// 监听 orientation changes
window.addEventListener("orientationchange", function(event) {
 // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
}, false);
```

orientationchange事件在低端的adroid机器上存在兼容性问题，可能不会触发



### 方案2 resize配合(window.inner/outerWidth, window.inner/outerHeight)

```
window.addEventListener("resize", function(event) {
	var orientation=(window.innerWidth > window.innerHeight)? "landscape":"portrait";
	if(oritentation === 'portrait'){
		// do something ……
	} else {
		// do something else ……
	}
}, false);
```

#### 缺点
只要`window`的`size`变化，就会不断触发触发`resize`事件。可以使用`setTimeout`来优化一下
如果有多个地方需要监听横竖屏，就需要注册多个`window.addEventListener("resize", function(event) {……})`。</br>

能不能通过订阅与发布模式来改进一下，只注册一个resize负责监听横竖屏变化，只要横竖发生变化就发布通知订阅的对象。其他需要监听横竖屏的地方只需订阅一下即可。

关键代码如下：

```
var resizeCB = function(){
   if(win.innerWidth > win.innerHeight){//初始化判断
   		meta.init = 'landscape';
    	meta.current = 'landscape';
   } else {
   		meta.init = 'portrait';
    	meta.current = 'portrait';
   }
   return function(){
	    if(win.innerWidth > win.innerHeight){
		     if(meta.current !== 'landscape'){
			      meta.current = 'landscape';
			      event.trigger('__orientationChange__', meta);
		     }
	    } else {
		     if(meta.current !== 'portrait'){
			      meta.current = 'portrait';
			      event.trigger('__orientationChange__', meta);
		     }
	    }
	   }
  }();
```
#### 代码

[完整代码](https://github.com/zuopf769/notebook/blob/master/fe/js%E5%AE%9E%E7%8E%B0%E6%89%8B%E6%9C%BA%E6%A8%AA%E7%AB%96%E5%B1%8F%E4%BA%8B%E4%BB%B6/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88window.resize/other/pl_2.js)


#### 改进方案1 

基于CSS3@media媒体查询检测来实现

通过window.innerWidth > window.innerHeight来实现的是一种伪检测，有点不可靠。 可不可以通过浏览器来实现检测？如基于CSS3@media媒体查询来实现。</br>


##### 实现思路：

+ 创建包含标识横竖屏状态的特定css样式
+ 通过JS向页面中注入CSS代码
+ resize回调函数中获取横竖屏的状态

> 这里选择<html></html>的节点font-family作为检测样式属性。
理由如下：</br>
1. 选择<html></html>主要为了避免reflow和repaint<br>
2. 选择font-family样式，主要是因为font-family有如下特性：<br>
   &nbsp;&nbsp;&nbsp;&nbsp;优先使用排在前面的字体。<br>
   &nbsp;&nbsp;&nbsp;&nbsp;如果找不到该种字体，或者该种字体不包括所要渲染的文字，则使用下一种字体。<br>
	&nbsp;&nbsp;&nbsp;&nbsp;如果所列出的字体，都无法满足需要，则让操作系统自行决定使用哪种字体。
这样我们就可以指定特定标识来标识横竖屏的状态，不过需要将指定的标识放置在其他字体的前面，这样就不会引起hmtl字体的变化。


```
  // callback
  var resizeCB = function() {
    // 取到html标签原有的样式
    var hstyle = win.getComputedStyle(html, null),
    	ffstr = hstyle['font-family'],
       pstr = "portrait, " + ffstr,
       lstr = "landscape, " + ffstr,
       // 拼接css
       cssstr = '@media (orientation: portrait) { .orientation{font-family:' + pstr + ';} } @media (orientation: landscape) { .orientation{font-family:' + lstr + ';}}';
    // 载入样式    
    loadStyleString(cssstr);
    // 添加类
    html.className = 'orientation' + html.className;
    if (hstyle['font-family'] === pstr) { //初始化判断
      meta.init = 'portrait';
      meta.current = 'portrait';
    } else {
      meta.init = 'landscape';
      meta.current = 'landscape';
    }
    return function() {
      if (hstyle['font-family'] === pstr) {
        if (meta.current !== 'portrait') {
          meta.current = 'portrait';
          event.trigger('__orientationChange__', meta);
        }
      } else {
        if (meta.current !== 'landscape') {
          meta.current = 'landscape';
          event.trigger('__orientationChange__', meta);
        }
      }
    }
  }();
```

#### 代码

[完整代码](https://github.com/zuopf769/notebook/blob/master/fe/js%E5%AE%9E%E7%8E%B0%E6%89%8B%E6%9C%BA%E6%A8%AA%E7%AB%96%E5%B1%8F%E4%BA%8B%E4%BB%B6/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88window.resize/other/pl_3.js)

#### 改进方案2 

可以再改进一下，在支持orientationchange时，就使用原生的orientationchange，不支持则使用上面方案

```
// 是否支持orientationchange事件
var isOrientation = ('orientation' in window && 'onorientationchange' in window);
// callback
var orientationCB = function(e) {
  if (win.orientation === 180 || win.orientation === 0) {
    meta.init = 'portrait';
    meta.current = 'portrait';
  }
  if (win.orientation === 90 || win.orientation === -90) {
    meta.init = 'landscape';
    meta.current = 'landscape';
  }
  return function() {
    if (win.orientation === 180 || win.orientation === 0) {
      meta.current = 'portrait';
    }
    if (win.orientation === 90 || win.orientation === -90) {
      meta.current = 'landscape';
    }
    event.trigger(eventType, meta);
  }
};
var callback = isOrientation ? orientationCB() : (function() {
  resizeCB();
  return function() {
    timer && win.clearTimeout(timer);
    timer = win.setTimeout(resizeCB, 300);
  }
})();
// 监听
win.addEventListener(isOrientation ? eventType : 'resize', callback, false);
```

#### 完整代码

[代码](https://github.com/zuopf769/notebook/blob/master/fe/js%E5%AE%9E%E7%8E%B0%E6%89%8B%E6%9C%BA%E6%A8%AA%E7%AB%96%E5%B1%8F%E4%BA%8B%E4%BB%B6/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88window.resize/other/pl_orientation.js)

#### 改进方案3

目前，上述几种方案都是通过自定制的订阅与发布事件模式来实现的。这里可以基于浏览器的事件机制，来模拟orientationchange。即对orientationchange的不兼容进行修复。


```
var eventType = 'orientationchange';
// 触发原生orientationchange
var fire = function() {
  var e;
  if (document.createEvent) {
    e = document.createEvent('HTMLEvents');
    e.initEvent(eventType, true, false);
    win.dispatchEvent(e);
  } else {
    e = document.createEventObject();
    e.eventType = eventType;
    if (win[eventType]) {
      win[eventType]();
    } else if (win['on' + eventType]) {
      win['on' + eventType]();
    } else {
      win.fireEvent(eventType, e);
    }
  }
}
```

#### 代码

[完整代码](https://github.com/zuopf769/notebook/blob/master/fe/js%E5%AE%9E%E7%8E%B0%E6%89%8B%E6%9C%BA%E6%A8%AA%E7%AB%96%E5%B1%8F%E4%BA%8B%E4%BB%B6/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88window.resize/src/orientationchange-fix.js)

### 方案3 matchMedia

css3为我们提供了很强大的media query，而我们时常需要在js中动态的知道什么时候某个状态满足了。[CSS Object Model（CSSOM）Views](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)规范增加了对JavaScript操作CSS media query的原生支持，它在window对象下增加了matchMedia()方法。

#### MediaQueryList对象

你可以传入一个CSS media query然后返回一个MediaQueryList对象。这个对象包括两个属性：matches，布尔值数据，表示CSS media query是否与当前的显示状态匹配；media对应传入的参数字符串。如下：

```
var mediaQueryList = window.matchMedia("screen and (max-width:480px)");
console.log(match.media); //"screen and (max-width:480px)"
console.log(match.matches); //true or false

```

#### MediaQueryList对象监听器

```
var match = window.matchMedia("(orientation:portrait)");
match.addListener(function(mql){
	if (match.matches) {
	
	}else {
}
});

```

当视图状态发生改变时，监听器对应的函数就会执行，而对应的MediaQueryList对象也会传入。用这个方式吗，你可以让你的JavaScript可以很快地响应布局变化，并且不需要用轮询的方式。另外关于media query的实现原理一直不太清楚，什么时候media query就生效的，比如说转屏，是否是只要当前屏幕width或height发生改变时就去查询media query估计就待看看webkit源码才能清楚了。


原生的matchMedia有些问题; [GMU](https://github.com/fex-team/GMU)在遵照CSS Object Model（CSSOM）Views规范，在zepto基础上扩展实现了$.matchMedia方法，该方法返回一个对象，该对象包含matches（是否match query），当前查询query, addListener和removeListener，调用方式与原生window.matchMedia一致。

具体思路：

##### （1）为页面添加检测元素

css media query主要还是在style上起作用，故在页面创建一个div，作为media query作用的对象。

```
$mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>').appendTo('body')
```

##### （2）为检测元素添加transition样式及media query样式

当query条件满足时，去动态修改transition作用的属性，如(width)，则可触发transitionEnd事件，这样则相当于可以监测到media query。

```
$style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; top: -10000px;}\n').appendTo('head');  

$style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n')

```


注意下这里的query:一开始加载页面成功后为

```
$.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
};

```

一开始检测元素的宽度为0，mediaQuery加载后就为1了，触发了transition动画，当有竖屏转为横屏时，mediaQuery条件就不符合了，检测元素的宽度又变回到了0，所以又会触发transition动画

注册transitionEnd事件

```
$mediaElem.on(transitionEnd, function() {
    ret.matches = $mediaElem.width() === 1;
    $.each(listeners, function (i,fn) {
        $.isFunction(fn) && fn.call(ret, ret);
    });
});
```

封装addListener及removeListener接口

主要记录在闭包中的listeners数组件，添加和删除回调函数即可

```
ret = {
    matches: $mediaElem.width() === 1 ,
    media: query,
    addListener: function (callback) {
        listeners.push(callback);
        return this;
    },
    removeListener: function (callback) {
        var index = listeners.indexOf(callback);
        ~index && listeners.splice(index, 1);
        return this;
    }
};

```

用$.mediaQuery实现转屏ortchange事件

实现转屏，只需将query传入检测转屏的query即可。这里在实现时，最开始遇了一点问题。最开始query值为"screen and (orientation: portrait)"，可在某个三星的机器上测试，居然键盘出来会改变视口大小，即认为是orientation改变了。后来经测试后query换成了"screen and (width: " + window.innerWidth + "px)"，即检测设备第一次打开时的width，若转屏后width必然不满足，使得页面上的检测元素width未受media query的css影响而改变而触发transitionEnd。具体代码如下：

```
$(function () {
    var handleOrtchange = function (mql) {
        $(document.body).prepend(mql.matches);
            $(window).trigger('ortchange');
        };
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    $.matchMedia($.mediaQuery.ortchange).addListener(handleOrtchange);
});
```


使用方法

```
$(window).on('ortchange', function () {
      console.log('ortchange');
});

```


### 参考资料

[转屏解决方案$.matchMedia](https://github.com/fex-team/GMU/wiki/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88$.matchMedia)
[Media Query和matchMedia介绍](https://github.com/fex-team/GMU/wiki/Media-Query%E5%92%8CmatchMedia%E4%BB%8B%E7%BB%8D)
