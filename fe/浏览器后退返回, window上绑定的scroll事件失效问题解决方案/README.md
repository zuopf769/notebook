## 浏览器后退返回, window上绑定的scroll事件失效问题解决方案

> 左鹏飞  2017.08.01

移动端的很多业务场景都是列表页，上拉加载、下拉刷新；然后点击跳转详情页；按返回键，回到相应的列表跳出处。


### 自己遇到的坑

按返回键，回到相应的列表跳出处后，上拉加载更多失效了。

#### 解决问题过程记录

#### 1. 抓包查看了网络请求，发现返回后没有发生请求。OMG原来有缓存。

+ 为啥有缓存？

>在移动端HTML5浏览器和webview中，“后退到前一个页面”意味着：前一个页面的html/js/css等静态资源的请求（甚至是ajax动态接口请求）根本不会重新发送，直接使用缓存的响应，而不管这些静态资源响应的缓存策略是否被设置了禁用状态。（这点我在自己的项目中也确实得到了验证，按回退按钮的时候抓包并没有抓到任何请求）。

+ 能不走缓存么？

1）在头部加相关的meta标签

```javascript
<meta http-equiv="cache-control" content="max-age=0" />
<meta http-equiv="cache-control" content="no-cache" />
<meta http-equiv="expires" content="0" />
<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" /> //设置页面过期时间
<meta http-equiv="pragma" content="no-cache" />

```

2）或者设置响应头


```javvascript
res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
res.header('Expires', '-1');
res.header('Pragma', 'no-cache');
```

相比较而言，在header中设置比设置meta标签更为靠谱一些，但是也存在两者都没效果的情况。

这样看上去，浏览器历史纪录和HTTP缓存是有关系的。
事实上不是这样的，当你点击返回按钮的时候浏览器不会遵循http缓存机制。

看来浏览器也是很任性的…


3）JS监听pagehide/pageshow来阻止页面进入bfcache/page cache，或者监测到页面从bfcache/page cache中加载展现时进行刷新。

```javascript
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload()
    }
};
```

4) JS读取读取页面的版本号，同时也记录在浏览器/webview本地（cookie/localStorage/sessionStorage）进行存储，作为本地版本号；如果版本号不一致强制刷新页面。

   逻辑其实很简单就是页面加载时，dom上绑定个版本号，跳出去时，读取版本号加1，并存到localStorage里，返回时候两个版本号对比，如果不一样就刷新，并且重新绑定页面版本号。
   

#### 小结

强制刷新页面会有个奇葩的现象，页面先走缓存，然后刷新页面，会跳动下。


#### 2. 有了缓存，都能解决阅读进度的问题了，从来跳过来就跳回去哪儿。

> 后退”不光意味着html/js/css/接口等动静态资源不会重新请求，连JS也不会重新执行。因为前一个页面没有被unload，最后离开时的状态和数据被完整地保留在内存中，发生后退时浏览器直接把“离开时”的页面状态展示给用户。


JS不会重新执行，但是页面中的点击事件是好使的，就是window.onscroll事件不好使了。

那window.onscroll放在document.body上面吧，仍然不好使。

分析原因后是：页面卸载时dispose了？

```javascript
me.on('ondispose', function () {
    me.$el.remove();
    me.unBindEvent(window, 'scroll');
});
```

注释掉，仍然不好使。那就是页面卸载时，主动me.unBindEvent了；返回时走的又是缓存，没有重新绑定


#### 3. 不能绑在window了，那就换到容器上吧

重改页面结构

```javascript
<div class="content-container">
    <div class="list-wrap">
    
    	...
    </div>
</div>
```

content-container容器撑满整个视口即和屏幕等宽高，列表item append到list-wrap里面，让滚动条出在content-container上;把scroll事件绑定到她上面。

```javascript
me.bindEvent(me.pageWrap, 'scroll.loadmore', $.throttle(200, function () {
    // 正在加载中
    if (me.isLoading) {
        return false;
    }
    if (me.lists[me.curIcon].next === 0) {
        return false;
    }
    var scrollTop = me.pageWrap.scrollTop();
    var wHeight = me.pageWrap.height();
    var pageHeight = me.$el.height();
    // 见底了
    if (scrollTop + wHeight >= pageHeight) {
        me.loadmoreBtns[me.curIcon].setState({
            icon: me.curIcon,
            state: 2
        });
        me.Mediator.fire('s:getLoadmoreData', {
            icon: me.curIcon,
            pn: me.lists[me.curIcon].pn + 1
        });
        me.isLoading = true;
    }

}));
```

后遗症：

绑定到容器上后，之前的offset().top都为0了，因为它是`获得当前元素相对于document的位置。`现在window上没有滚动条了，所以都为0,导致之前的根据页面滚动到相应距离后，区块吸顶的现象丢失了。

只能采用原生方法了`$(item)[0].scrollTop`来取得区块相对于容器的滚动距离了，然后加上其他容器外的dom的高度。


### 总结

页面中如果监听了window的scroll事件, 在页面中点击链接之后,再点击浏览器的后退按钮返回那个页面, 这个时候页面中绑定的scroll事件就会失效。解决办法就是把scroll事件绑定在某个容器上。










