### 如何记录阅读进度

大家是否会遇到这些需求:

1. 如果有三个tab页签，从某个tab页签下跳出去打开新页后，点击浏览器后退键，能回到跳出去的相应tab页签下


2. 希望像原生app那样在wap端的列表页跳到详情页，点击浏览器后退键，能回到跳出去的列表处


3. 如果有上拉加载更多，希望还是能回到相应页码处


4. 能多端同步阅读进度么？


下面我们就从易到难，一个一个的来解决上面的问题：

### 场景一

如果有三个tab页签，从某个tab页签下跳出去打开新页后，点击浏览器后退键，能回到跳出去的相应tab页签下


#### 解决思路

1. 切换页签是记录是哪个页签

```javascript
$.each(me.$elements.$navBarItems, function(index, item) {
    var navbaritemHM = me.createHammer(item);
    navbaritemHM.on('tap', function (e) {
        var tabtype = $(e.currentTarget).attr('data-tabtype');
        // 页签切换打点
        me.fire('tabChangeClick', {
            id: me.options.entUuid,
            tabtype: tabtype
        });

        me._pushHistoryState(tabtype);
        me._hideLoadmoreBtnWrap();
        me._handleNavbarClick(e, tabtype);
    });
});

```
注意上面的me._pushHistoryState(tabtype)的方法；负责记录tabtype? 那应该记录在哪儿呢？


首先，我尝试了

```javascript
history.replaceState(null, '', newURL);
```
但是发现浏览器goback时，会不断的pushstate，一直退出不去了，所以不能这么做


那就只能放到全局变量中了，在跳出时再replaceState(null, '', newURL);

```javscript
_pushHistoryState: function (tabtype) {
    var hash = location.hash;
    var originURL = location.href;
    if (hash) {
        var hrefSplit = location.href.split('#')
        originURL = hrefSplit[0];
    }
    var newURL= util.updateUrlQuery('type', tabtype, originURL);
    if (hash) {
        newURL += hash;
    }
    // 添加页签类型
    // history.replaceState(null, '', newURL);
    globalData.set({
        lastURL: newURL
    });
}
```

上面的代码中globalData就是个全局变量

代码如下：

```javascript
var Gd = {
    set: function () {
        var args = arguments;
        if (args.length === 1 && typeof args[0] === 'object') {
            $.extend(this, args[0]);
        }
        else if (args.length === 2 &&  typeof args[0] === 'string') {
            this[args[0]] = args[1];
        }
    }
};

module.exports = Gd;
```

然后跳出去的时候history.replaceState

```javascript
// 列表跳转打点
    me.on('jumpClick', function (opt) {

    // 页面跳转前修改state
    var lastURL = globalData.lastURL;
    var hash = globalData.hash;
    if (!lastURL) {
        lastURL = location.href;
    }
    if (hash) {
        var oHash = location.hash;
        if (oHash) {
            lastURL = lastURL.split('#')[0];
        }
        lastURL = lastURL + '#' + hash;
    }
    history.replaceState && history.replaceState(null, '', lastURL);
});
```

等goback列表页时，会从url上取tab类，如果有就覆盖传入的tabtype

```javascrpt
var main = function (options) {

    // 页签分类
    var tabs = JSON.parse(options.tab) || [];
    // url的query
    var type = util.getQueryValue(location.href, 'type');
    if (type) {
        // 适配乱输入type
        type = ['word', 'txt', 'vision'].indexOf(type) === -1 ? null : type;
    }
    if (tabs.length > 0) {
        if (!type) {// 第一个页签
            type = tabs[0].icon;
        }
    }
  

    // 主view
    var view = new View({
        el: options.el,
        pageWrap: options.pageWrap,
        Mediator: Mediator,
        entUuid: options.entUuid,
        tab: options.tab,
        icon: type
    });
```
需要注意的地方是,适配下用户乱输入query

```
 if (type) {
        // 适配乱输入type
        type = ['word', 'txt', 'vision'].indexOf(type) === -1 ? null : type;
}
```


### 场景二

希望像原生app那样在wap端的列表页跳到详情页，点击浏览器后退键，能回到跳出去的列表处


#### 解决思路

如果列表有分类，那很简单可以套用上面的方案，页面滚动时，记录滚动到哪个分类下，存到globalData中，跳出去时history.replaceState

```
 // 页面跳转前修改state
    var lastURL = globalData.lastURL;
    var hash = globalData.hash;
    if (!lastURL) {
        lastURL = location.href;
    }
    if (hash) {
        var oHash = location.hash;
        if (oHash) {
            lastURL = lastURL.split('#')[0];
        }
        lastURL = lastURL + '#' + hash;
    }
    history.replaceState && history.replaceState(null, '', lastURL);
```

思路就是页签类型用query记录，位置用hash来记录


页面加载完就可以根据hash跳转到相应的位置

```
// 根据锚点页面滚动到相应的路径分类下
    _scrollToPath: function() {
        var me = this;
        var hash = location.hash;
        if (hash) {
            var anchor = hash.split('#')[1];
            var pathWrap = me.$elements.$allPathWrap.filter(function(index) {
                if ($(this).attr('data-pathtype') === anchor) {
                    return true;
                }
            });
            $(window).scrollTop(pathWrap.offset().top);
        }
    },
```

如果没有分类，那就只能记录页面滚动距离，存到localstorage里面，后退回来，取出来距离跳转相应位置

### 场景三

如果有上拉加载更多，希望还是能回到相应页码处

### 解决思路

如果页面只显示一页，上拉加载更多，下拉刷新，这个问题也很好解决，存到localstorage里面，后退回来，重新加载数据


如果是上拉加载更多，一直累加dom，这个只能是缓存之前的数据到前端了，木有别的办法了


### 场景四

能多端同步阅读进度么？


这个问题只能是存库了，页面滚动时候，存到localstorage的同时，发后端请求记录到数据库了



## 总结

关于阅读进度的记录，除非就是

+ 合理使用url query和hash记录进度

+ history.replaceState记录跳出去的页面url

+ localstorage记录页码，甚至是数据

+ 页面滚动时，实时记录阅读进度并存到数据库

