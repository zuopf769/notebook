## 使用html5 postMessage解决与嵌套的iframe跨域消息传递

> 左鹏飞 2017.08.25

### 1. 背景

最近有个需求是通过iframe的形式接入第三方的视频播放落地页：

+ 需要我们这边告诉他自动播放，那边视频就自动播放，否则用户点了播放按钮后才播放；
+ 视频播放落地页中的视频播放按钮点击、暂停、播放完成等事件都需要通知到我们自己的页面中，用于做打点统计

### 2. 技术方案

html5 postMessage

### 3. postMessage能干什么？

+ 页面和其打开的新窗口的数据传递

+ 多窗口之间消息传递

+ 页面与嵌套的iframe消息传递

上面三个问题的跨域数据传递

### 4. postMessage()发送消息

`postMessage()`方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

`postMessage(data,origin)`方法接受两个参数

 + data:要传递的数据，html5规范中提到该参数可以是JavaScript的任意基本类型或可复制的对象，然而并不是所有浏览器都做到了这点儿，部分浏览器只能处理字符串参数，所以我们在传递参数的时候需要使用JSON.stringify()方法对对象参数序列化，在低版本IE中引用json2.js可以实现类似效果。

+ origin：字符串参数，指明目标窗口的源，协议+主机+端口号[+URL]，URL会被忽略，所以可以不写，这个参数是为了安全考虑，postMessage()方法只会将message传递给指定窗口，当然如果愿意也可以建参数设置为"*"，这样可以传递给任意窗口，如果要指定和当前窗口同源的话设置为"/"。

```
http://test.com/index.html

<div style="width:200px; float:left; margin-right:200px;border:solid 1px #333;">
        <div id="color">Frame Color</div>
    </div>
    <div>
        <iframe id="child" src="http://lsLib.com/lsLib.html"></iframe>
</div>
```

我们可以在http://test.com/index.html
通过postMessage()方法向跨域的iframe页面http://lsLib.com/lsLib.html传递消息

```
window.onload = function(){
    window.frames[0].postMessage('getcolor','http://lslib.com');
}
```

> 注意的点是： postMessage方法的调用者是向哪个ifrme发消息的那个iframe对象


### 5.接收消息

test.com上面的页面向lslib.com发送了消息，那么在lslib.com页面上如何接收消息呢，监听window的message事件就可以

```
http://lslib.com/lslib.html
window.addEventListener('message',function(e){
    if(e.source!=window.parent) return;
    var color=container.style.backgroundColor;
    window.parent.postMessage(color,'*');
},false);
```
这样我们就可以接收任何窗口传递来的消息了，为了安全起见，我们利用这时候的MessageEvent对象判断了一下消息源,`MessageEvent`是一个这样的东东

![MessageEvent](https://github.com/zuopf769/notebook/blob/master/fe/%E4%BD%BF%E7%94%A8html5%20postMessage%E8%A7%A3%E5%86%B3%E8%B7%A8%E5%9F%9F%E3%80%81%E8%B7%A8%E7%AA%97%E5%8F%A3%E6%B6%88%E6%81%AF%E4%BC%A0%E9%80%92/1.png)

```
有几个重要属性

data：顾名思义，是传递来的message
source：发送消息的窗口对象
origin：发送消息窗口的源（协议+主机+端口号）
这样就可以接收跨域的消息了，我们还可以发送消息回去，方法类似

```

### 6.代码实例

```
var iframe = document.getElementsByClassName('video-iframe')[0];

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);

    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function isAutoPlay() {
    if (getQueryString('autoPlay') === '1') {
        iframe.contentWindow.postMessage('play', 'https://a.leleketang.com');
    }
}

// 如果url包含autoPlay=1参数，则自动播放
$(document).ready(function () {
    // 如果不是ie
    if (iframe.attachEvent) {
        iframe.attachEvent('onload', function () {
            isAutoPlay();
        });
    }
    else {
        iframe.onload = function () {
            isAutoPlay();
        };
    }
});
```

```

// postMessage 监听
window.addEventListener('message', function (event) {
	// 为了安全起见，我们利用这时候的MessageEvent对象判断了一下消息源,
    var safeOrigin = ['https://a.leleketang.com', 'http://a.leleketang.com'];
    if ($.inArray(event.origin, safeOrigin) === -1) {
        return;
    }

    // 播放操作通知
    if (event.data === 'play') {
        if (!isPlay) {
            // 统计播放次数
            $doc.trigger('video-play-incre');
            // 播放量自增接口

            var videoId = globalData.videoId;
            $.ajax({
                url: '/recomvideoincr?videoId=' + videoId,
                dataType: 'json',
                type: 'POST',
                success: function (rel) {
                
                }
            });
            isPlay = true;
        }
    }

    // 播放结束操作通知
    if (event.data === 'ended') {
        $doc.trigger('video-play-complete');
    }
}, false);
```

7. 兼容IE的写法

[代码地址](https://github.com/zuopf769/notebook/blob/master/fe/%E4%BD%BF%E7%94%A8html5%20postMessage%E8%A7%A3%E5%86%B3%E8%B7%A8%E5%9F%9F%E3%80%81%E8%B7%A8%E7%AA%97%E5%8F%A3%E6%B6%88%E6%81%AF%E4%BC%A0%E9%80%92/postMessage.js)



