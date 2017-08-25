/**
 * @file log.js
 **/

var staticsList = require('./staticsList.js');

var log = function (url) {
    var img = new Image();
    var key = 'tangram_sio_log_' + Math.floor(Math.random() * 2147483648).toString(36);

    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = function () {
        // 下面这句非常重要
        // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
        // 则在gif动画播放过程中，img会多次触发onload
        // 因此一定要清空
        img.onload = img.onerror = img.onabort = null;

        window[key] = null;

        // 下面这句非常重要
        // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
        // 因此这里一定要置为null
        img = null;
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    img.src = url;
};

var nsLog = function (type, other) {
    var t = new Date().getTime();
    var s = staticsList;
    var pathArr = (type + '').split('.');
    var j = 0;
    var l = pathArr.length;

    for (; j < l; j++) {
        if ((s = s[pathArr[j]]) === undefined) {
            throw ('Not defined static item ' + type);
        }

    }


    var params = [
        '//nsclick.baidu.com/v.gif?pid=332', 'type=' + s,
        'action=wa_' + pathArr.join('_'), 't=' + t,
        'referrer=' + (document.referrer ? encodeURIComponent(document.referrer) : ''),
        'url=' + encodeURIComponent(location.href),
        'homescreen=' + (window.navigator.standalone ? 1 : 0)
    ];

    if (other) {
        for (var i in other) {
            if (other.hasOwnProperty(i)) {
                params.push(i + '=' + other[i]);
            }

        }
    }

    // 发送请求
    log(params.join('&').replace('nsclick.baidu.com', 'wkclick.baidu.com'));
    // log(params.join('&'));   // 2016.03.02 nsclick试下线
    // ctj备份wkclick的打点，做验证用
    // try {
    //     var wapfelog = window['wapfelog'];
    //     wapfelog.send('click', {
    //         wkclickurl: params.join('&').replace('nsclick.baidu.com', 'wkclick.baidu.com')
    //     }, 1, 100061);
    // }
    // catch (e) {}
};

module.exports = {
    log: log,
    nsLog: nsLog
};
