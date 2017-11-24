## 前端全（无）埋点之页面停留时长统计

> [左鹏飞](https://github.com/zuopf769)  2017.11.24


相关阅读： 

[前端全（无）埋点之页面操作路径可视化](https://github.com/zuopf769/notebook/blob/master/fe/%E5%89%8D%E7%AB%AF%E5%85%A8%EF%BC%88%E6%97%A0%EF%BC%89%E5%9F%8B%E7%82%B9%E4%B9%8B%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E8%B7%AF%E5%BE%84%E5%8F%AF%E8%A7%86%E5%8C%96/README.md)

### 1. 概述

为了更好地了解用户对产品的使用情况，业务中，我们经常会收到埋点统计的需求，比如：

+ 收集一段时间内用户光标在页面中的运动情况，包括光标移动、点击等行为
+ 统计用户滚屏行为
+ 统计用户在站点的停留时长
+ 收集页面链接的点击数量等

本文讲解统计页面停留时长时，用户关闭或者跳出页面的时候，请求未发出。

### 2. 页面停留时长统计的思路

总体来说页面停留时长统计有两个思路：

+ 当前页面关闭的时候统计
> + 统计时机： unload、beforeunload事件
> + 存在的问题： 
>   + 用户关闭或者跳出页面的时候，请求未发出
>   + 当用户从浏览器切换到其他app界面或者Home屏的时候，部分浏览器默认会停止页面脚本的执行，如果在这个时候使用了unload事件，可能会让你失望，因为unload事件并不会触发，从而导致停留时长过长。

+ 跳转到新的页面后统计
>  + 统计时机：将数据传递给下跳页，在下跳页发送数据
>  + 存在的问题：
> 		+ 下跳页中必须部署同样的统计脚本
> 		+ 最后一个页面没有下跳页，关闭浏览器就需要特殊处理


### 3 当前页面关闭统计方案

当前页面关闭统计方案解的思路就是阻塞页面关闭，先发数据统计请求，然后再关闭页面

#### 3.1 解决方案一： 阻塞式的 Ajax 请求

XMLHttpRequest::open方法的第三个参数，如果设置为false就是同步加载

```
window.addEventListener('unload', function(event) {
	var xhr = new XMLHttpRequest(),
	xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	xhr.open('post', '/log', false); // 同步请求
	xhr.send(data);
});
```

这样可以阻塞页面关闭，当然可以在readState为2的时候就abort请求，因为我们不关心响应的内容，只要请求发出去就行了。


#### 3.2 解决方案二： 暴力的死循环

原理跟上面类似，只不过是使用一个空的死循环阻塞页面关闭

```
window.addEventListener('unload', function(event) {
  send(data);
  var now = +new Date;
  while(new Date - now >= 10) {} // 阻塞 10ms
});
```

#### 3.3 发一个图片请求阻塞

大部分浏览器都会等待图片的加载，趁这个机会把统计数据发送出去

```
window.addEventListener('unload', function(event) {
  send(data);
  (new Image).src = 'http://example.com/s.gif';
});
```

#### 3.4 小结

以上提到的几个方案都是一个原理，让浏览器继续保持阻塞状态，等数据发送出去后再跳转，这里存在的问题是：

+ 少量浏览器下可能不奏效
+ 等待一会儿再跳转，用户体验上打了折扣，尤其是移动端上

### 4. 跳转到新的页面后统计思路

#### 4.1 url 传参

通过数组标识一个链接的位置信息，如[站点id，页面id，模块id，链接index]，通过四个参数可以惟一标识链接位置属性，使用URL param参数将数组数据传递给下跳页，等待由下跳页将数据发送出去。

存在的问题是，下跳页中必须部署同样的统计脚本，但对一个系统来说，这是很容易做到的。我们也不会在自己的网页上放其他网站的链接吧，所以整个数据的统计都在一个闭环内。

#### 4.2 通过window.name传递数据

window.name 是浏览器给我们开放的一个接口，设置该属性的值后，即便页面发生了跳转，这个值依然不会变化，并且可以跨域使用。window.name 存储数据的生存周期为窗口会话的生存周期，同一个窗口可以通过 window.name 共享数据。

这里有个开源的库[aralejs](https://github.com/aralejs/name-storage)可以参考。

以上虽然基本解决了数据丢失和体验差的问题，但是这也很大程度依赖于开发者的编程习惯，如不能随便玩耍 window.name；也对系统有一定的要求，必须在所有页面上部署同样的埋点脚本。


#### 4.3 localstorage 存储重发

localstorage 是 HTML5 提供的两种在客户端存储数据的新方法之一，对于丢失率高的场景，咱们可以先把请求日志存储在 localstorage 中，失败后在下个页面重发，并且可以添加重试机制，这样日志的完整性能很大程度上提高。从性能角度讲还可以统一发送，减少连接。
但是针对跳出率高的场景，这种方式实测效果并不明显。


### 5. H5新特性Beacon API方案

为什么不能给用户提供这样一个 API，即使页面跳转了，也能够将上个页面的请求发出去呢？庆幸的是，W3C 工作组也想到了这个问题，提出了 Beacon API 的 草案。

Beacon API 允许开发者发送少量错误分析和上报的信息，它的特点很明显：

+ 在空闲的时候异步发送统计，不影响页面诸如 JS、CSS Animation 等执行
+ 即使页面在 unload 状态下，也会异步发送统计，不影响页面过渡/跳转到下跳页
+ 能够被客户端优化发送，尤其在 Mobile 环境下，可以将 Beacon 请求合并到其他请求上，一同处理

sendBeacon 函数挂在在 navigator 上，在 unload 之前，这个函数一定是被初始化了的。其使用方式为：

```
window.addEventListener('unload', function(event) {
  navigator.sendBeacon('/collector', data);
});

```

navigator.sendBeacon(url, data);，第一个参数为数据上报的地址，第二个参数为要发送的数据，支持的数据格式有：ArrayBufferView, Blob, DOMString, 和 FormData。

Beacon 的还有一个非常实用的移动端使用场景，当用户从浏览器切换到其他 app 界面或者 Home 屏的时候，部分浏览器默认会停止页面脚本的执行，如果在这个时候使用了 unload 时间，可能会让你失望，因为 unload 事件并不会触发，此时，Beacon 就派上用途了，它是不会受影响的。


### 6. 总结

本文讲解了传统的通过`beforunload`或者`unload`事件发送页面停留时长的时候丢点的问题；罗列了几种解决问题的思路。

### 7. 参考文献

+ [Beforeunload打点丢失原因分析及解决方案](http://blogread.cn/it/article/6804?f=wb)
+ [页面跳转时，统计数据丢失问题探讨](http://www.barretlee.com/blog/2016/02/20/navigator-beacon-api/)








