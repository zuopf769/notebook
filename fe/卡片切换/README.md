### 滑动组件

>  左鹏飞  2017.07.13

#### 关键功能点

+ 手指拖动时整体跟随手指滑动；松开手指时切换到上/下一张卡片或者归位
+ 拖动第一张和最后一张卡片时，模拟阻力；松开手指时弹性归位
+ 快速左（右）滑时，切换上/下一张卡片
+ 支持回调

#### 关键技术点

+ touch事件中的touches、targetTouches和changedTouches

```javascript
touches: 当前屏幕上所有触摸点的列表;
targetTouches: 当前对象上所有触摸点的列表;
changedTouches: 涉及当前(引发)事件的触摸点的列表

通过一个例子来区分一下触摸事件中的这三个属性:

1. 用一个手指接触屏幕，触发事件，此时这三个属性有相同的值。

2. 用第二个手指接触屏幕，此时，touches有两个元素，每个手指触摸点为一个值。当两个手指触摸相同元素时，
targetTouches和touches的值相同，否则targetTouches 只有一个值。changedTouches此时只有一个值，
为第二个手指的触摸点，因为第二个手指是引发事件的原因

3. 用两个手指同时接触屏幕，此时changedTouches有两个值，每一个手指的触摸点都有一个值

4. 手指滑动时，三个值都会发生变化

5. 一个手指离开屏幕，touches和targetTouches中对应的元素会同时移除，而changedTouches仍然会存在元素。

6. 手指都离开屏幕之后，touches和targetTouches中将不会再有值，changedTouches还会有一个值，
此值为最后一个离开屏幕的手指的接触点。

```
> touchstart和trouchmove时使用touches和targetTouches都可以；touchend时使用changedTouches


	
+ 触点坐标选取

```javascript

touchstart和touchmove使用: e.targetTouches[0].pageX 或 (jquery)e.originalEvent.targetTouches[0].pageX

touchend使用: e.changedTouches[0].pageX 或 (jquery)e.originalEvent.changedTouches[0].pageX

```

+ 关键的几个初始化值

```javascript
    // 父容器
    this.parentCon = parentCon;
    // 滚动容器
    this.scrollCon = scrollCon;
    // 每个item的宽度
    this.swipeW = swipeW;
    // 切换成功后的回调
    this.swipeCb = swipeCb;
    // 卡片个数
    this.cardSize = this.scrollCon.children().size();
    // 父容器宽度
    this.wrapW = parentCon.width();
    // 滚动容器宽度
    this.scrollerWidth = this.scrollCon.width();
    // 滚动最大距离
    this.maxScrollX = this.wrapW - this.scrollerWidth - 10 * 2;
    // 滚动容器左边距
    this.paddingLeft = this.scrollCon.offset().left;
    // 是否跟随手指滑动中
    this.isMoving = false;
    // 卡片是否在过渡动画中
    this.isInTransition = false;
    // 当前卡片index
    this.curCardIndex = 0;
```

> + 滑动的区间的确定： 0 ~ scrollerWidth
> + 当前卡片index, 左滑+1，右滑-1
> + 是否跟随手指滑动中，卡片是否在过渡动画中（这个变量的原因是：手指滑动过程中会反复触发touchend，从而再次触发touchstart；为了节流甚至导致不可预期的错误，最好在touchstart的过程中阻止掉滑动行为）


+ 记录上次最终的偏移量（this.offsetX = 0）

> + 最开始是0；

```javascript
	init: function () {
        var oThis = this;
        // 记录上次的水平偏移量
        this.offsetX = 0;
        oThis.scrollCon.on('touchstart', function (e) {
        ....
```


> + 在拖动过程中直接改滑动容器的tanslatex属性，而不要更改this.offsetX,因为拖动只是实现跟随手指动的效果，手指离开时要归位或者翻卡，并不是最终的偏移量


> + 在切换卡片后要记录下当前的偏移量；

```javascript
	scrollTo: function (x, time) {
        this.isInTransition = true;
        var oThis = this;
        setTimeout(function () {
            oThis.isInTransition = false;
        }, time);
        this.scrollCon.css({
            '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)',
            '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
            '-webkit-transition-duration': time
        }).attr('x', x);
        this.offsetX = x;
        $.isFunction(oThis.swipeCb) && oThis.swipeCb();

    },
```

+ 跟随手指滑动

> 跟随手指滑动的效果即：手指滑动到哪儿容器就跟着到哪儿。主要原理就是计算滑动偏移量，不断的修改tanslateX



```javascript

	oThis.scrollCon.on('touchmove', function (e) {
            // 滑动中
            oThis.isMoving = true;
            var touches = e.touches ? e.touches[0] : e;
            var timestamp = oThis.getTime();
            oThis.movingX = touches.screenX;
            oThis.movingY = touches.screenY;

            // 水平偏移量
            var diffScreenX = oThis.movingX - oThis.startX;
            // scoller容器应该移动的距离
            var moveScreenX = oThis.offsetX + diffScreenX;

            // 滑动方向
            var moveDirection = oThis.swipeDirection(oThis.startX, oThis.movingX, oThis.startY, oThis.movingY);

            // 不能阻止页面的纵向滚动
            if (moveDirection === 'Left' || moveDirection === 'Right') {
                e.preventDefault();
                e.stopPropagation();
            }

            // 超过边缘滑动有阻力
            if (moveScreenX > 0 || moveScreenX < oThis.maxScrollX) {
                diffScreenX = diffScreenX * 2 / 3;
                moveScreenX = oThis.offsetX + diffScreenX;
            }

            oThis.scrollCon.css({
                '-webkit-transform': 'translate3d(' + moveScreenX + 'px, 0, 0)',
                '-webkit-transition-duration': 'none'
            });
        });
        
```

> 注意点

> + 不管左滑（偏移量为负）右滑（偏移量为正），新的trnaslateX值都是加法处理
> + 跟随手指滑动时，不能有动画所以需要：'-webkit-transition-duration': 'none'


+ 滑动方向判断

```javascript
	// 滑动方向
    swipeDirection: function (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? (x1 - x2 > 0 ? 'Left' : 'Right')
            : (y1 - y2 > 0 ? 'Up' : 'Down');
    },
```

> 横滑不能影响页面上下滚动，所以需要判断是左右滑动才阻止页面滚动行为，上下滑动不能阻止页面滚动

```javascrpt
 	// 不能阻止页面的纵向滚动
   if (moveDirection === 'Left' || moveDirection === 'Right') {
         e.preventDefault();
         e.stopPropagation();
   }

```

+ 超过边缘滑动有阻力效果模拟

```javascript
if (moveScreenX > 0 || moveScreenX < oThis.maxScrollX) {
       diffScreenX = diffScreenX * 2 / 3;
       moveScreenX = oThis.offsetX + diffScreenX;
}
```

> 原理就是在左边和最后边拖动时，把偏移量改为diffScreenX * 2 / 3


+ 如何判断是翻卡行为

> + 触摸动作时间很短 小于300m时
> + 滑动偏移量大于10小于30切到下一张卡或前一张卡

```javascript
if (duration < 300 || (Math.abs(diffScreenX) > 10 && Math.abs(diffScreenX) < 30)) {
     scrollToFun(moveDirection);
}
```

+ 拖动后该切换卡片还是归位

```javascript
if (Math.abs(diffScreenX) >= (oThis.swipeW / 3)) {
       scrollToFun(moveDirection);
}
else {// 归位
       oThis.scrollTo(oThis.offsetX, '300ms');
}
```
> 原理：如果拖动的距离大于卡片宽度三分之一时就翻卡；否则就归位


+ 切换卡片还是归位处理函数

```javascript
				// 切换卡片还是归位
            function scrollToFun(moveDirection) {
                var x;
                if (moveDirection === 'Right') {// 右滑
                    oThis.curCardIndex = oThis.curCardIndex - 1 < 0 ? 0 : oThis.curCardIndex - 1;
                    if (oThis.curCardIndex === 0) {
                        oThis.scrollTo(0, '300ms');
                    }
                    else {
                        if (oThis.curCardIndex === oThis.cardSize - 2) {
                            x = oThis.offsetX
                                 + (oThis.swipeW - ($(window).width() - oThis.swipeW - 10
                                 - oThis.paddingLeft)) + oThis.paddingLeft;
                        }
                        else {
                            x = oThis.offsetX + (oThis.swipeW + 10);
                        }
                        oThis.scrollTo(x, '300ms');
                    }

                }
                else if (moveDirection === 'Left') {// 左滑
                    oThis.curCardIndex = (oThis.curCardIndex + 1) >= oThis.cardSize
                        ? oThis.cardSize - 1 : oThis.curCardIndex + 1;
                    if (oThis.curCardIndex === oThis.cardSize - 1) {
                        oThis.scrollTo(oThis.maxScrollX, '300ms');
                    }
                    else {
                        if (oThis.curCardIndex === 1) {
                            x = oThis.offsetX - oThis.paddingLeft - oThis.swipeW;
                        }
                        else {
                            x = oThis.offsetX - oThis.swipeW - 10;
                        }
                        oThis.scrollTo(x, '300ms');
                    }
                }
            }
```
> + 向右滑动时如果是第一张卡，就复位到0
> + 向左滑动时如果最后一张卡，就复位到最大偏移量
> + 正常的思路就是如果没有padding和margin以及一个卡片撑满整屏幕的话就好办了，
>   只需要再上次的位置加一个item卡片的宽度就可以了：(oThis.swipeW + 10);
> + 其他需要注意margin和padding之类的


总结

+ 此次做的功能类似幻灯片的翻页效果，所以没有考虑滚动加速度
+ 其实可以根据角度来判断滑动方向











