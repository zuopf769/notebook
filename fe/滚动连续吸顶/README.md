### 摘要

开发过程中通常会遇到滚动页面置顶区块的需求；本文记录了如何防止置顶时页面不跳动，ios上监听onscroll事件在惯性滚动时不执行脚本的解决方案，以及CSS3新属性sticky来实现黏连置顶；最终基于onscroll和sticky提出了一个通用终极方案

### 背景

项目中经常会页面碰到滚动特定距离后区块（如页签，分类标题等）吸顶的场景；本文章记录了开发过程中遇到的各种坑。


### 案例效果

 ![image](https://github.com/zuopf769/notebook/blob/master/fe/%E6%BB%9A%E5%8A%A8%E8%BF%9E%E7%BB%AD%E5%90%B8%E9%A1%B6/example.png)


### 开发思路


#### step one

首先计算好各个需要置顶区块距离页面顶部的偏移量。

```javascript
    var me = this;
    me.options.topArray = [];
    // 要用容器来计算offset
    $.each(me.$elements.$pathTitlesWrap, function (index, item) {
        var top = $(item).offset().top;
        me.options.topArray.push(top);
    });
    me.options.topRegion = [];
    $.each(me.options.topArray, function (index, item) {
        var region = {};
        region.start = me.options.topArray[index];
        region.end = me.options.topArray[index + 1] ? me.options.topArray[index + 1] : me.options.topArray[index];
        me.options.topRegion.push(region);
    });
```
计算好后形成了两个数组：一个是偏移量数组如[100, 200, 300, 400];另外一个是偏移量区间如：[{start: 100, end: 200}, {start: 200, end: 300}, {start: 300, end: 400}, {start: 400, end: 400}]

#### step two

通常的思路就是监听window.onscroll事件，判断滚动条的滚动距离，在哪个区间内然后修改相应区块的position属性由relative改为fixed

```javacript
    function handler () {
    	// 滚动条偏移量
       var scrollTop = $(window).scrollTop();
       var topArray = me.options.topArray;
		
       // 滚动条偏移量小于第一个区块的offset就隐藏一个区块
       if (scrollTop <= me.options.topRegion[0] - 1) {
            me.$elements.$pathTitleWrapFixed[0].style.display = 'none';
       }

       $.each(me.options.topRegion, function(index, item) {
          if (scrollTop >= item.start && scrollTop < item.end) {
               me._setPathTitleFixedByIndex(index);
               return false;
           }
           else {
               // me.$elements.$pathTitles.css('position', 'relative');
                me.$elements.$pathTitleWrapFixed[0].style.display = 'none';
           }
       });
       // 滚动条偏移量大于最后一个区块的offset就置顶最后一个区块
       if (scrollTop >= me.options.topArray[me.options.topArray.length - 1]) {
            me._setPathTitleFixedByIndex(me.options.topArray.length - 1);
       }
   }

```
#### step three

大功告成；开心的提测；但是。。。。。都是泪。。。。。


### 填坑

+ 坑one

	+ 现象：区块置顶时页面会跳动

	+ 原因：区块元素由relative改为fixed时，脱离文档流，会导致页面高度变化，所以出现页面跳动

	+ 解决思路：置顶区块套个容器，容器高度为区块高度，这样区块脱离文档流的时候，页面高度不会发生变化，就没跳动的现象了。

+ 坑two

	+ 现象：两个区块碰撞时，交互定位时，仍会跳动
	
	+ 原因：relative改为fixed，fixed改为relative导致
	
	+ 解决思路：在页面顶部预置一个置顶的区块，滚动条到达偏移量区间时替换文字即可。
	

+ 坑three

  + 现象：ios平台的浏览中页面快速滑动，惯性滚动中window.onscroll事件不会触发；只有惯性滚动停止时才会执行脚本；导致不能及时的吸顶
  
  + 原因：在ios，当一个手指按住屏幕并且在屏幕上移动不会发生任何事件，直到停止移动，才触发onscroll事件
  
  
  + 解决思路一:
  
  采用touch事件来触发handler方法
  
  ```javascript
  // 解决ios下面页面滚动时禁止所有事件，但是仍然解决不了惯性滚动
    $('body').on('touchstart', function (e) {
        handler.apply(me);
    });
    $('body').on('touchmove', function (e) {
        handler.apply(me);
    });
    $('body').on('touchend', function (e) {
        handler.apply(me);
        setTimeout(function() {
            handler.apply(me);
        }, 1000);
    });
  ```
  
  但是，但是，解决了滑动拖动过程中实时计算的问题；注意touchend的时候，用两个定时器来从新计算，知识解决了快速惯性滚动时，有的时候置顶的fixed块回不到relative的情况。但是仍然没有解决window.onscroll导致的问题。
  
    + 解决思路二：

    采用iscoll组件的probe，监听onScroll事件，可以实时监听到滚动距离
    
    例子：http://lab.cubiq.org/iscroll5/demos/probe/
    
    + 解决思路三：
    
    使用 position: sticky 达到粘性元素区域悬浮效果
    
> sticky：
对象在常态时遵循常规流。它就像是relative和fixed的合体，当在屏幕中时按常规流排版，当卷动到屏幕外时则表现如fixed。该属性的表现是现实中你见到的吸附效果。（CSS3）

> 重点了解sticky属性值
当该元素在屏幕中时并不脱离文档流，仍然保留元素原本在文档流中的位置。

> 当元素在容器中被滚动超过指定的偏移值时，该元素将固定在容器指定的位置。例如：设置了top:50px;那么在sticky元素到达距离相对定位的元素顶部50px的位置时固定，不再向上移动

> 元素固定的相对偏移是相对于离它最近的具有滚动框的祖先元素，如果祖先元素都不可以滚动，那么是相当于viewport（视口）来计算元素的偏移量

 

> 当目标元素在屏幕中可见时，他的行为就像position:relative;而当页面滚动超出目标区域时，他的表现就像position:fixed;它会固定在目标位置。

 

> 需要注意的是，如果同时定义了left和right值，那么left生效，right会无效，同样，同时定义了top和bottom，top赢



```javacript
.sticky {  
    position: -webkit-sticky;  
    position: -moz-sticky;  
    position: -ms-sticky;  
    position: sticky;  
    top: 15px; // 使用和 Fixed 同样的方式设定位置  
}

```

完美解决，ios上的问题完美解决，并且还会有推出去的效果。但是android平台有兼容性问题。需要做兼容性处理。


### 终极方案

区分平台Android平台用之前的脚本；ios平台用css实现.
```javascript
if (/(Android)/i.test(navigator.userAgent)) {
        // 页面滚动事件
        me.bindEvent(window, 'scroll', handler);
        // 解决ios下面页面滚动时禁止所有事件，但是仍然解决不了惯性滚动
        $('body').on('touchstart', function (e) {
            handler.apply(me);
        });
        $('body').on('touchmove', function (e) {
            handler.apply(me);
        });
        $('body').on('touchend', function (e) {
            handler.apply(me);
            setTimeout(function() {
                handler.apply(me);
            }, 1000);
        });
    }
```

也可以判断css3属性是否支持，如果支持就用css样式，不支持脚本来实现。


```
/** 
* 判断浏览器是否支持某一个CSS3属性 
* @param {String} 属性名称 
* @return {Boolean} true/false 
* @version 1.0 
* @author ydr.me 
* 2014年4月4日14:47:19 
*/
 
function supportCss3(style) { 
	var prefix = ['webkit', 'Moz', 'ms', 'o'], 
		i, 
		humpString = [], 
		htmlStyle = document.documentElement.style, 
		_toHumb = function (string) { 
				return string.replace(/-(\w)/g, function ($0, $1) { 
					return $1.toUpperCase(); 
				}); 
		}; 
 
		for (i in prefix) 
			humpString.push(_toHumb(prefix[i] + '-' + style)); 
 
			humpString.push(_toHumb(style)); 
 
		for (i in humpString) 
			if (humpString[i] in htmlStyle) return true; 
 
		return false; 
}
```



    
  
  
  
  
  
  




