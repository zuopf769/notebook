#orientationchange-fix


## 中文
orientationchange-fix是一个基于CSS3`@media`特性实现对原生`orientationchange`修复的实用库，它让orientation detection更加可靠，更加easy。

### 使用
将`orientationchange-fix`脚本（文件）引入`<head></head>`节点中。**注意**：  *将其放置在样式文件之后(保证不影响html的font-family的设置)*
```xml
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="main.css" type="text/css">
  <!-- 引入orientationchange-fix文件 -->
  <script type="text/javascript" src="js/library/orientationchange-fix.js"></script>
</head>
```
对需要检测横竖屏的地方，注册`orientationchange`事件，调用`window.neworientation.current`来判断横竖屏状态。
```js
window.addEventListener('orientationchange', function(){
 if(window.neworientation.current === 'portrait|landscape'){
 	// do something……
 } else {
 	// do something……
 }
}, false);
```

### API
##### window.neworientation
```js
window.neworientation:{
  isOrientation: 'true|false', //是否支持'orientationchange'
  font: 'font-family',//初始化html的'font-family'
  init: 'portrait|landscape', //初始化时，横竖屏的状态
  current: 'portrait|landscape'//当前横竖屏的状态
}
```
### changelog
1.1.0: 重写原生事件的触发方法


