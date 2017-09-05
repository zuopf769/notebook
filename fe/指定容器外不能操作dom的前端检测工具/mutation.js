
// 可以在控制台直接调用、查看细节
var api = api = {};

/****************  html,head,body下直接操作元素 配置区 *****************/
// 如果有违法操作， 脚本提供自动打断点功能，
// 需要在控制台通过  api.detectRootDom.debug(true) 开启，或者直接修改下面的配置
// 因为 MutationObserver 是异步触发
// 所以如果需要看到完整的调用堆栈，请开启开发者工具Sources Tab下右上角的Async选项
var autoDebug = false;

// 白名单
var domWhiteList = {

    // 属性变动白名单， 支持字符串和正则
    attr: [/^data\-sf\-detect\-/],

    // dom变动白名单， 以其是否包含下面的属性为准， 只支持字符串
    nodeAttr: ['sfDetectCloneStyle', 'sfDetectRemoveLink']
};

/****************  全局 配置区 *****************/

// 检测的时间间隔， 单位毫秒
var detectTimeDelay = 3000;

// 检测开关， 默认都开启
// 为防止错误过多， 比较乱，
// 可以开始全部关闭， 然后按顺序依次开启一个， 逐个处理错误， 等逐个都处理完成后再统一打开检测
var detectSwitch = {
    id: true,   // 检测id
    classNamespace: true,  // 检测是否有css规则没有包裹命名空间
    globalJs: true,    // 检测是否有全局js变量
    rootDom: true    // 检测是否有节点直接插入到html, head, body 里
};
api.switch = detectSwitch;


//-------------工具方法 start-------------//
// 查看k是否在whiteList中， k是字符串， whiteList是数组， 里面包含字符串和正则
function inWhiteList(k, whiteList) {

    var item;
    var i = 0;
    var l = whiteList.length;

    for (; i < l; i++) {
        item = whiteList[i];

        if (typeof item === 'string') {
            if (item === k) {
                return true;
            }
        }
        else if (item.test(k)) {
            return true;
        }
    }
    return false;
}

// 查看node的dataset属性是否包含attrList里的属性
function hasDataAttr(node, attrList) {
    var i = 0;
    var l = attrList.length;
    var attr;

    if (!node.dataset) {
        return;
    }

    while (i < l) {
        attr = attrList[i];

        if (node.dataset[attr]) {
            return true;
        }

        i++;
    }
}

function startsWith(str, whiteList) {
    var i = 0;
    var l = whiteList.length;

    while (i < l) {
        if (str.startsWith(whiteList[i])) {
            return true;
        }
        i++;
    }
    return false;
}
//-------------工具方法 end-------------//

// 用于检测容器的class
// 主要用于检测在container外部是否有dom操作
var container_class = 'mutation-observer-wrap';

var detectRootDom = (function () {

    // 要监听的容器
    var container = document.getElementsByClassName(container_class)[0];

    // https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // 页面根元素
    var target = document.documentElement;
    var observer;
    var config = {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true
    };

    var isObserver = false;
    var isDomReady = false;
    var isDebug = false;

    observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            var nodeList = [];
            var i;
            var l;
            switch (mutation.type) {
                case 'attributes':
                    if (inWhiteList(mutation.attributeName, domWhiteList.attr)) {
                        return;
                    }
                case 'characterData':
                    nodeList.push({
                        node: mutation.target,
                        type: mutation.type,
                        attributeName: mutation.attributeName
                    });
                    break;
                case 'childList':

                    if (mutation.addedNodes) {
                        for (i = 0, l = mutation.addedNodes.length; i < l; i++) {
                            nodeList.push({
                                target: mutation.target,
                                node: mutation.addedNodes[i],
                                type: 'addNode'
                            });
                        }
                    }
                    if (mutation.removedNodes) {
                        for (i = 0, l = mutation.removedNodes.length; i < l; i++) {
                            nodeList.push({
                                target: mutation.target,
                                node: mutation.removedNodes[i],
                                type: 'removeNode'
                            });
                        }
                    }
                    break;
            }

            var node;
            var target;
            var msg;
            for (i = 0, l = nodeList.length; i < l; i++) {
                node = nodeList[i].node;

                if (hasDataAttr(node, domWhiteList.nodeAttr)) {
                    continue;
                }

                if (!node.parentNode) {
                    target = nodeList[i].target;

                    if (target && (target === container || container.contains(target))) {
                        continue;
                    }
                }

                // !container.contains(node)即是在container外面
                // container === node即是自己的容器内部
                if (container === node || !container.contains(node)) {
                    node.dataset = node.dataset || {};
                    if (node.dataset.sfDetectDom) {
                        return;
                    }
                    node.dataset.sfDetectDom = 1;

                    if (isDebug) {
                        debugger;
                    }

                    switch (nodeList[i].type) {
                        case 'attributes':
                            msg = '有属性变动 —— ' + nodeList[i].attributeName;
                            break;
                        case 'characterData':
                            msg = '有文本节点变动';
                            break;
                        case 'addNode':
                            msg = '有新节点加入';
                            break;
                        case 'removeNode':
                            msg = '有旧节点删除';
                    }
                    console.error('globalDetect: container外有dom节点变动：' + msg, node);
                }
            }
        });
    });

    document.addEventListener("DOMContentLoaded", function(event) {
        isDomReady = true;
        isDebug = autoDebug;
    });

    api.detectRootDom = {
        debug: function (debug) {
            isDebug = !!debug;
        },
        on: function () {

            if (!detectSwitch.rootDom) {
                return;
            }

            if (!container) {
               return;
            }

            if (!isDomReady) {
                return;
            }

            if (isObserver) {
                return;
            }

            isObserver = true;
            debugger;
            observer.observe(target, config);
        },
        off: function () {
            if (!isObserver) {
                return;
            }
            isObserver = false;
            observer.disconnect();
        }
    };
    return api.detectRootDom;
})();

/****************  以下是启动区 *********************/
var timer;
function autoDetect() {

    try {
        detectRootDom.on();
    }
    catch (e) {
        console.error(e);
    }

    timer = setTimeout(function () {
        autoDetect();
    }, detectTimeDelay);
}

function stopDetect() {
    clearTimeout(timer);
    timer = null;
    detectRootDom.off();
}


autoDetect();

