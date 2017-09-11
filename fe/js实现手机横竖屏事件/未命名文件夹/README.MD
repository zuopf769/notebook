#orientationchange-fix
## English
### description
**orientationchange-fix** is a based on `@media` attribute to fix `orientationchange` utility library, orientaionchange polyfill. it is more reliable and easy to detect oritentation of mobile device.
### test demo
![qrcode](qrcode.png)
### usage
Include **orientationchange-fix** library script in your `<head></head>` markup。
**Warning:**  putting the script after `<style></style>`, in order to not break `font-family` of `<html></html>`
```js
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="main.css" type="text/css">
  <!-- import orientationchange-fix file -->
  <script type="text/javascript" src="js/library/orientationchange-fix.js"></script>
</head>
```
When detecting orientation, only need to register `orientationchange`, and then retrieve current state of orientation by `window.neworientation.current`.
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
**window.neworientation**
```js
window.neworientation:{
  isOrientation: 'true|false', //whether 'orientationchange' is supported
  font: 'font-family',// 'font-family' of html
  init: 'portrait|landscape', //initial state of orientation
  current: 'portrait|landscape'//current state of orientation
}
```
## changelog
1.1.0: rewrite fire method


## 中文
orientationchange-fix是一个基于CSS3`@media`特性实现对原生`orientationchange`修复的实用库，它让orientation detection更加可靠，更加easy。
#### 效果测试
![qrcode](qrcode.png)
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

### License
**orientationchange-fix.js** is covered by the MIT License.
