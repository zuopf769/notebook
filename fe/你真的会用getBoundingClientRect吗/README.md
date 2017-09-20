## 你真的会用getBoundingClientRect吗？

> 左鹏飞 2017.09.20


本文介绍了什么是getBoundingClientRect；以及获取width,height的兼容性写法；最后介绍了两个使用场景：获取页面元素的位置和判断元素是否在可视区域。

### 1. 什么是getBoundingClientRect


`getBoundingClientRect`用于获得页面中某个元素的左，上，右和下分别相对浏览器视窗的位置。`getBoundingClientRect`是`DOM`元素到浏览器可视范围的距离（不包含文档卷起的部分）。

+ 该函数返回一个`Object`对象，该对象有6个属性：`top,lef,right,bottom,width,height`；

+ 这里的top、left和css中的理解很相似，width、height是元素自身的宽高;

+ 但是right，bottom和css中的理解有点不一样。right是指元素右边界距窗口最左边的距离，bottom是指元素下边界距窗口最上面的距离。

![图1](https://github.com/zuopf769/notebook/blob/master/fe/%E4%BD%A0%E7%9C%9F%E7%9A%84%E4%BC%9A%E7%94%A8getBoundingClientRect%E5%90%97/2008100603035335.gif)

```
// 获取元素
var box=document.getElementById('box');

// 元素上边距离页面上边的距离
alert(box.getBoundingClientRect().top);

// 元素右边距离页面左边的距离
alert(box.getBoundingClientRect().right); 

// 元素下边距离页面上边的距离
alert(box.getBoundingClientRect().bottom);

// 元素左边距离页面左边的距离
alert(box.getBoundingClientRect().left);
```


![图2](https://github.com/zuopf769/notebook/blob/master/fe/%E4%BD%A0%E7%9C%9F%E7%9A%84%E4%BC%9A%E7%94%A8getBoundingClientRect%E5%90%97/2008100603040663.gif)


### 2.兼容性

getBoundingClientRect()最先是IE的私有属性，现在已经是一个W3C标准。所以你不用当心浏览器兼容问题，不过还是有区别的：IE只返回top,lef,right,bottom四个值，不过可以通过以下方法来获取width,height的值


```
var ro = object.getBoundingClientRect();
var Width = ro.right - ro.left;
var Height = ro.bottom - ro.top;

//兼容所有浏览器写法：

var ro = object.getBoundingClientRect();
var Top = ro.top;
var Bottom = ro.bottom;
var Left = ro.left;
var Right = ro.right;
var Width = ro.width||Right - Left;
var Height = ro.height||Bottom - Top;

```

### 3. 用getBoundingClientRect()来获取页面元素的位置

以前绝大多数的时候使用下面的代码来获取页面元素的位置：

```
var _x = 0, _y = 0;
do{
	_x += el.offsetLeft;
	_y += el.offsetTop;
}
while(el=el.offsetParent);

return {x:_x,y:_y}

```
这里有个”offsetParent”问题，所以要写很多兼容的代码。


有了`getBoundingClientRect`这个方法，获取页面元素的位置就简单多了，

```
var X= this.getBoundingClientRect().left+document.documentElement.scrollLeft;

var Y =this.getBoundingClientRect().top+document.documentElement.scrollTop;

```

### 4. 判断元素是否在可视区域

以前的办法是通过各种offset判断元素是否可见。

```
me.on('onload', function () {
    var hasDot = false;
    function scrollHandler() {
        var elOffsetTop = me.$el.offset().top;
        var elHeight = me.$el.height();
        var wHeight = $(window).height();
        var scrollTop = $(window).scrollTop();
        if (scrollTop + wHeight >= elOffsetTop + elHeight) {
            if (!hasDot) {
                me.fire('moduleShow');
            }
            hasDot = true;
        }
    }
    // 知识图谱推荐模块展现PV/UV(模块底部露出页面视为被展现)
    $(window).on('scroll.kgrecommend', scrollHandler);
    // 先执行一遍
    scrollHandler();
});
```


 getBoundingClientRect是获取可视区域相关位置信息的，使用这个属性来判断更加方便：

```
function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
```


 



