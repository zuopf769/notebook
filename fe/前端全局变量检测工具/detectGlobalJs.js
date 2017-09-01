
// 可以在控制台直接调用 api 查看细节
var api = api || {};



// 检测开关， 默认都开启
// 为防止错误过多， 比较乱，
// 可以开始全部关闭， 然后按顺序依次开启一个， 逐个处理错误， 等逐个都处理完成后再统一打开检测

var detectTimeDelay = 1000;

var detectSwitch = {
    id: true,   // 检测id
    classNamespace: true,  // 检测是否有css规则没有包裹命名空间
    globalJs: true,    // 检测是否有全局js变量
    rootDom: true    // 检测是否有节点直接插入到html, head, body 里
};



/****************  js全局变量 配置区 start *****************/

// 找不到的全局变量可以把名字设置到这里， 然后打开控制台， 刷新页面， 会自动在设置值的地方断点停住
// 多个变量用空格分割即可
// 比如想找 varA  varB 这两个变量， 下面就配置为： var globalJsName = 'varA varB';
var globalJsName = 'a';

// 暂时不处理的js全局变量放这里， 包括第三方不可控的， 后续统一处理
//     可以放一些无法处理的第三方变量， 或处理起来较麻烦的变量， 等大部分改造完成后再处理这里
//
// 注意： 放到这里的都是后续必须要处理的， 如果确定是不需要处理的， 请放到下面的 globalJsWihteList 变量里
//
// 支持正则和字符串两种形式
var globalJsWihteListThirdParty = [

    /^_bdhm_loaded_/,
    /^_hmt$/,
    /^mini_tangram_log_/,

    'loaded', 

    // 某一类
    'cpro_mobile_slot', '_ssp_global', 'cpro_id', 'cproArray', 'slotbydup',

    // 某一类
    /^BAIDU_SSP_/,
    /^BAIDU_DUP($|2?_?)/,
    /^BAIDU_(CLB)_/
];

var globalJsWihteList = [

    /^BD_PS_C\d+$/,

    /^sf_edu_jsonp\d+$/
].concat(globalJsWihteListThirdParty);

/****************  js全局变量 配置区 end *****************/


/****************  工具方法  start*****************/

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
};

/****************  工具方法  end*****************/



var detectGlobalJs = (function () {

    function defineProperty(name) {
        if (!name) {
            return;
        }
        var vv;
        Object.defineProperty(window, name, {
            set: function (v) {
                vv = v;
                console.log('set window.' + name + ': ' + vv);
                debugger;
            },
            get: function () {
                console.log('get window.' + name + ': ' + vv);
                debugger;
                return vv;
            }
        });
    }
    api.defineProperty = defineProperty;

    if (globalJsName) {
        var arr = globalJsName.split(' ');
        var i = 0;
        var l = arr.length;

        for (; i < l; i++) {
            defineProperty(arr[i]);
        }

    }

    var map = {};
    var whiteListMap = {};
    var globalMap = {};

    api.showGlobalJs = function (showWhiteList) {
        console.log('globalMap:\n    ' + JSON.stringify(globalMap));
        if (showWhiteList) {
            console.log('whiteListMap:\n    ' + JSON.stringify(whiteListMap));
        }
    };

    var k;

    // window上已有变量, autoDetect已经delay执行
    for (k in window) {
        map[k] = true;
    }

    if (globalJsWihteListThirdParty && globalJsWihteListThirdParty.length) {
        console.error('有第三方的全局变量未处理！');
    }

    var whiteList = globalJsWihteList || [];

    return function () {
        // 开关
        if (!detectSwitch.globalJs) {
            return function () {};
        }
        
        for (k in window) {
            // 不是window上的默认属性
            if (!map[k] && !whiteListMap[k] && !globalMap[k]) {
                // 不在白名单中
                if (inWhiteList(k, whiteList)) {
                    // 记录命中白名单
                    whiteListMap[k] = true;
                    continue;
                }
                // 记录已经命中了全局变量
                globalMap[k] = true;
                console.error('globalDetect: window下有全局变量 ' + k + ' : ' + window[k]);
            }
        }
    };
})();


/****************  以下是启动区 *********************/
var timer;

function autoDetect() {

    try {
        detectGlobalJs();
    }
    catch (e) {
        console.error(e);
    }

    timer = setTimeout(function () {
        autoDetect();
    }, detectTimeDelay);
};

function stopDetect() {
    clearTimeout(timer);
    timer = null;
};

autoDetect();
