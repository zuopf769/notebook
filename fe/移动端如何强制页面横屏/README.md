## 移动端如何强制页面横屏

> [左鹏飞](https://github.com/zuopf769)  2017.12.13


### 1. 背景

最近公司要开发一个移动端的类网页游戏: 长按按钮有个自行车一直骑行，碰到某个国家的地标就弹出该国的相应say hello的tip，要求横屏显示，不能竖屏。

然而当用户竖屏打开时，而且没开启手机里的横屏模式，还要逼用户去开启。这时候用户早就不耐烦的把你的游戏关掉了。

而且有些机型有些app不能横屏：比如Android的微信就没有横屏模式，而ios的微信能开启横屏模式。

解决办法就是在竖屏模式下，写一个横屏的div，然后设置rotate正（负）90度，把他旋转过来；而且如果用户切到横屏时，需要把rotate复原，要求也能正常展现。

### 2. 纯css

把main这个div在竖屏模式下横过来，横屏状态下不变。

```
@media screen and (orientation: portrait) {
    .main {
        -webkit-transform:rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        transform: rotate(-90deg);
        width: 100vh;
        height: 100vh;
        /*去掉overflow 微信显示正常，但是浏览器有问题，竖屏时强制横屏缩小*/
        overflow: hidden;
    }
}

@media screen and (orientation: landscape) {
    .main {
        -webkit-transform:rotate(0);
        -moz-transform: rotate(0);
        -ms-transform: rotate(0);
        transform: rotate(0)
    }
}
```

但是有个问题是在横屏模式下，利用css旋转90度后，宽和高不好控制。

```
width: 100vh;
height: 100vh;

```
这样控制宽高不太适合单屏宽高的页面。

### 3. js计算宽高、对齐、旋转

上文提到了，在portrait下，旋转到横屏后宽和高会有问题。可以通过下面的js来实现。

```
var width = document.documentElement.clientWidth;
var height =  document.documentElement.clientHeight;
if( width < height ){
  $print =  $('#print');
  $print.width(height);
  $print.height(width);
  $print.css('top',  (height-width)/2);
  $print.css('left',  0-(height-width)/2 );
  $print.css('transform' , 'rotate(90deg)');
  $print.css('transform-origin' , '50% 50%');
}

```
需要注意的是transform-origin是`50% 50%`,旋转90deg后，还需要重新设置top和left将其对齐。

### 4. 最终方案

如果用户手机的旋转屏幕按钮开着，那么当手机横过来之后，上面的代码还是有问题。

```
var evt = "onorientationchange" in window ? "orientationchange" : "resize";
      
    window.addEventListener(evt, function() {
        console.log(evt);
        var width = document.documentElement.clientWidth;
         var height =  document.documentElement.clientHeight;
          $print =  $('#print');
         if( width > height ){
           
            $print.width(width);
            $print.height(height);
            $print.css('top',  0 );
            $print.css('left',  0 );
            $print.css('transform' , 'none');
            $print.css('transform-origin' , '50% 50%');
         }
         else{
            $print.width(height);
            $print.height(width);
            $print.css('top',  (height-width)/2 );
            $print.css('left',  0-(height-width)/2 );
            $print.css('transform' , 'rotate(90deg)');
            $print.css('transform-origin' , '50% 50%');
         }
        
    }, false);

```

### 5. 完整代码
```
/**
 * 横竖屏
 * @param {Object}
 */
function changeOrientation($print) {  
  var width = document.documentElement.clientWidth;
  var height =  document.documentElement.clientHeight;
  if(width < height) {
	  $print.width(height);
	  $print.height(width);
	  $print.css('top',  (height - width) / 2 );
	  $print.css('left',  0 - (height - width) / 2 );
	  $print.css('transform', 'rotate(90deg)');
	  $print.css('transform-origin', '50% 50%');
  } 
 
  var evt = "onorientationchange" in window ? "orientationchange" : "resize";
      
      window.addEventListener(evt, function() {

	  setTimeout(function() {
	      var width = document.documentElement.clientWidth;
	      var height =  document.documentElement.clientHeight;
	      // 刷新城市的宽度
	      initCityWidth();
	      // 初始化每个气泡和自行车碰撞的距离
	      cityCrashDistanceArr = initCityCrashDistance();
	
		if( width > height ){
			$print.width(width);
			$print.height(height);
			$print.css('top',  0 );
			$print.css('left',  0 );
			$print.css('transform' , 'none');
			$print.css('transform-origin' , '50% 50%');
		 }
		 else {
		  $print.width(height);
			$print.height(width);
			$print.css('top',  (height-width)/2 );
			$print.css('left',  0-(height-width)/2 );
			$print.css('transform' , 'rotate(90deg)');
			$print.css('transform-origin' , '50% 50%');
		 }
	}, 300);	
   }, false);
}
```

### 6. 总结

+ 该方案只适合页面宽高占一屏，不适合可以滚动的方案
+ 用orientationchange和resize监听横竖屏切换会有延迟的问题，具体解决延迟的方案见我的另外一篇文章[js实现手机横竖屏事件](https://github.com/zuopf769/notebook/tree/master/fe/js%E5%AE%9E%E7%8E%B0%E6%89%8B%E6%9C%BA%E6%A8%AA%E7%AB%96%E5%B1%8F%E4%BA%8B%E4%BB%B6)

### 7. 参考资料

+ [移动端如何让页面强制横屏](http://www.jianshu.com/p/9c3264f4a405)


### 8. demo

+ [女神之路](http://www.chubao.cn/s/godness/index.html)
+ [ofo进入全球20国](https://common.ofo.so/campaign/20country/)

### 9. 代码

[代码](https://github.com/zuopf769/notebook/tree/master/fe/%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%A6%82%E4%BD%95%E5%BC%BA%E5%88%B6%E9%A1%B5%E9%9D%A2%E6%A8%AA%E5%B1%8F/code)


