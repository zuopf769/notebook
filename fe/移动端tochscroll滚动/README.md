## 移动端touchScroll滚动组件

> 左鹏飞  2017.09.14

### 背景

最近有个项目是地区选择器以弹层的形式浮动在底部页面的上面；可以上下滚动选择相应的地区；如果用原生的滚动条，地区区域上滑滑动到最底部时，会触发底下页面整体的滚动；这个体验很不好。

![浮层](https://github.com/zuopf769/notebook/blob/master/fe/%E7%A7%BB%E5%8A%A8%E7%AB%AFtochscroll%E6%BB%9A%E5%8A%A8/1649e949ef67ecfbc4ef84421449ffae.png)


### 解决方案

#### 方案一：底部页面body的overflow属性切换hidden和auto

```
// 阻止底层列表区可以滚动
stopBottomScroll: function () {
    $('body')[0].style.overflow = 'hidden';
},
allowBottomScroll: function () {
    $('body')[0].style.overflow = 'auto';
},
```

+ 在弹层show的时候：底部页面body的overflow属性设为hidden
+ 在弹层hide的时候：底部页面body的overflow属性设为auto


```
// 阻止事件冒泡
this.mask[0].addEventListener('touchmove', function (e) {
    oThis.stopBottomScroll();
    e.preventDefault();
    e.stopPropagation();
});
```

+ 同时把mask层的touchmove事件阻止事件的默认行为和冒泡


#### 方案二： 自定义touchScroll滚动组件

自定义滚动组件现在市面上也很多优秀的组件如：

+ [iscroll](https://github.com/cubiq/iscroll/blob/master/build/iscroll-lite.js)
+ [alloytouch](https://github.com/AlloyTeam/AlloyTouch/blob/master/alloy_touch.js)

但是我还是准备自己一步一步实现一个。

注意点：

```
function TouchScroll (options) {

    // 最外层容器（高度固定）
    this.scrollerContainer = $(options.scrollWrap);
    // 内容区（高度高于最外层容器）
    this.scrollerContent = $(options.scrollContent);

    // 滑动的最大便移量
    this.scrollerHeight = this.scrollerContent.height();
    this.wrapH = this.scrollerContainer.height();
    this.maxScrollY = this.wrapH - this.scrollerHeight;


    // 记录每次touchend后最终的translateY值
    this.endY = 0;

    // 是否在滑动中
    this.isMoving = false;
    // 是否在transition动画中
    this.isInTransition = false;

    // 初始化
    this._init();

};

```
+ 滑动的最大便移量是 `this.wrapH - this.scrollerHeight`
+ 状态位`isMoving `表示是否在滑动中
+ 状态`isInTransition`表示是否在`transition`动画中



```
 var me = this;
 this.scrollerContent.on('touchstart', $.proxy(me._handleTouchstart, me));
 this.scrollerContent.on('touchmove', $.proxy(me._handleTouchmove, me));
 this.scrollerContent.on('touchend', $.proxy(me._handleTouchend, me));
```

+ 监听`touchstart `、`touchmove `、`touchend `事件



```
 _handleTouchstart: function (e) {
	
	 // 防止多次触发
    if (this.isMoving || this.isInTransition) {
        return;
    }

    this.startY = e.targetTouches[0].screenY;
    this.startTime = this.getTime();

},
```
+ 注意防止滑动过程中多次触发


```
_handleTouchmove: function (e) {

    e.preventDefault();
    e.stopPropagation();

    this.isMoving = true;

    var nowY = e.targetTouches[0].screenY;

    // 偏移量
    var moveDistance = nowY - this.startY;

    // 内容区应该移动到的位置
    var movePageY = this.endY + moveDistance;

    // 如果超过最大偏移量(模拟阻尼)
    if (movePageY > 0 || movePageY < this.maxScrollY) {
        // moveDistance * 2 / 3阻尼模拟
        movePageY =  this.endY  + moveDistance * 2 / 3;
    }

    // 没有动画效果，所以'-webkit-transition': 'none'
    this.scrollerContent.css({
        '-webkit-transform': 'translate3d(0,' + movePageY + 'px, 0)',
        '-webkit-transition': 'none'
    });

},
```
+ touchmove过程中如果超过最大偏移量，要实现阻尼的效果
+ touchmove过程中要实现跟随手指运动的效果，所以这里的`'-webkit-transition': 'none'`


```
_handleTouchend: function (e) {
      
    var touches = e.changedTouches ? e.changedTouches[0] : e;
    var endY = touches.screenY;

    var endTime =  this.getTime();
    var duration = endTime - this.startTime;

    if (duration < 300) {// 快速滑动考虑惯性加速度

        var resultObj = this.calculateMoment(endY, this.startY, duration, this.maxScrollY);
        endY = resultObj.newEnd;
        duration = resultObj.duration;

        var moveDistance = endY - this.startY;
        var movePageY = this.endY + moveDistance;

        this.scrollTo(movePageY, duration);
    }
    else {

        var moveDistance = endY - this.startY;
        var movePageY = this.endY + moveDistance;

        if (movePageY > 0) {
            this.scrollTo(0, 300);
        } 
        else if (movePageY < this.maxScrollY) {
            this.scrollTo(this.maxScrollY, 300);
        }
        else {
            this.scrollTo(movePageY, duration);
        }
    }
    this.isMoving = false;
},
```

+ 滑动时长小于300ms，则要考虑快速滚动惯性加速的情况


```
calculateMoment: function (end, start, time) {
    var distance = end - start;

    // 平均速度
    var speed = Math.abs(distance) / time;
    // 新的endY坐标
    var newEnd;
    // 新的时长
    var duration;
    // 加速度
    var deceleration = 6e-4;

	 // 新的endY坐标的计算方式：比当初的坐标的值变大
    newEnd = end + speed * speed / (2 * deceleration) * (distance < 0 ? -1 : 1);
    duration = speed / deceleration;

    return {
        newEnd: Math.round(newEnd),
        duration: duration
    };
}
```

+ v方-v0方=2as加速度公式
+ 初始速度设置为0，v即平均速度speed，则s =  v方 / 2a 


```
  scrollTo: function (Y, time) {
	if (Y > 0) {
	    Y = 0;
	}
	else if (Y < this.maxScrollY) {
	    Y = this.maxScrollY;
	}

	this.isInTransition = true;
	var oThis = this;
	setTimeout(function () {
	    oThis.isInTransition = false;
	}, time);
	this.scrollerContent.css({
	    '-webkit-transform': 'translate3d(0, ' + Y + 'px,  0)',
	    '-webkit-transition-property': 'all',
	    '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
	    '-webkit-transition-duration': time + 'ms'
	});
	this.endY = Y;
    },
```

+  translate3d开启硬件加速
+  cubic-bezier(0.1, 0.3, 0.5, 1)曲线


[完整代码](https://github.com/zuopf769/notebook/blob/master/fe/%E7%A7%BB%E5%8A%A8%E7%AB%AFtochscroll%E6%BB%9A%E5%8A%A8/touchScroll.html)

### 总结

+ 阻尼
+ 惯性加速度
+ 弹性矫正
