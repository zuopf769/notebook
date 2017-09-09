## js实现手机横竖屏事件

在做H5项目时，需要在横竖屏变化时，做一些处理。毫无疑问，需要使用orientationchange来监听横竖屏的变化。

### 方案1 orientationchange事件

```
// 监听 orientation changes
window.addEventListener("orientationchange", function(event) {
 // 根据event.orientation|screen.orientation.angle等于0|180、90|-90度来判断横竖屏
}, false);
```

该方案在低端的adroid机器上存在兼容性问题

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
只要window的size变化，就会不断触发触发resize事件。可以使用setTimeout来优化一下
如果有多个地方需要监听横竖屏，就需要注册多个window.addEventListener("resize", function(event) {……})。</br>

能不能通过订阅与发布模式来改进一下，只注册一个resize负责监听横竖屏变化，只要横竖发生变化就发布通知订阅的对象。其他需要监听横竖屏的地方只需订阅一下即可。


#### 改进方案1 基于CSS3@media媒体查询检测来实现

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



