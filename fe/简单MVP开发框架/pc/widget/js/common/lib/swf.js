/* eslint-disable */

var browser = require('./browser.js');
var array = require('./array.js');
var lang = require('./lang.js');
var string = require('./string.js');


/**
 * 获得flash对象的实例
 * @name swf.getMovie
 * @function
 * @grammar swf.getMovie(name)
 * @param {string} name flash对象的名称
 * @see swf.create
 * @meta standard
 * @returns {HTMLElement} flash对象的实例
 */
var getMovie = function (name) {
    //ie9下, Object标签和embed标签嵌套的方式生成flash时,
    //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
    var movie = document[name], ret;
    return browser.ie == 9 ?
        movie && movie.length ?
            (ret = array.remove(lang.toArray(movie),function(item){
                return item.tagName.toLowerCase() != "embed";
            })).length == 1 ? ret[0] : ret
            : movie
        : movie || window[name];
};

exports.getMovie = getMovie;

/**
 * Js 调用 Flash方法的代理类.
 * @function
 * @name swf.Proxy
 * @grammar new swf.Proxy(id, property, [, loadedHandler])
 * @param {string} id Flash的元素id.object标签id, embed标签name.
 * @param {string} property Flash的方法或者属性名称，用来检测Flash是否初始化好了.
 * @param {Function} loadedHandler 初始化之后的回调函数.
 * @remark Flash对应的DOM元素必须已经存在, 否则抛错. 可以使用swf.create预先创建Flash对应的DOM元素.
 * @author liyubei@com (leeight)
 */
var Proxy = function(id, property, loadedHandler) {
    /**
     * 页面上的Flash对象
     * @type {HTMLElement}
     */
    var me = this,
        flash = this._flash = getMovie(id),
        timer;
    if (! property) {
        return this;
    }
    timer = setInterval(function() {
        try {
            /** @preserveTry */
            if (flash[property]) {
                me._initialized = true;
                clearInterval(timer);
                if (loadedHandler) {
                    loadedHandler();
                }
            }
        } catch (e) {
        }
    }, 100);
};

exports.Proxy = Proxy;

/**
 * 获取flash对象.
 * @return {HTMLElement} Flash对象.
 */
Proxy.prototype.getFlash = function() {
    return this._flash;
};
/**
 * 判断Flash是否初始化完成,可以与js进行交互.
 */
Proxy.prototype.isReady = function() {
    return !! this._initialized;
};
/**
 * 调用Flash中的某个方法
 * @param {string} methodName 方法名.
 * @param {...*} var_args 方法的参数.
 */
Proxy.prototype.call = function(methodName, var_args) {
    try {
        var flash = this.getFlash(),
            args = Array.prototype.slice.call(arguments);

        args.shift();
        if (flash[methodName]) {
            flash[methodName].apply(flash, args);
        }
    } catch (e) {
    }
};

/**
 * 浏览器支持的flash插件版本
 * @property version 浏览器支持的flash插件版本
 * @grammar swf.version
 * @return {String} 版本号
 * @meta standard
 */
var version = (function () {
    var n = navigator;
    if (n.plugins && n.mimeTypes.length) {
        var plugin = n.plugins["Shockwave Flash"];
        if (plugin && plugin.description) {
            return plugin.description
                    .replace(/([a-zA-Z]|\s)+/, "")
                    .replace(/(\s)+r/, ".") + ".0";
        }
    } else if (window.ActiveXObject && !window.opera) {
        for (var i = 12; i >= 2; i--) {
            try {
                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                if (c) {
                    var version = c.GetVariable("$version");
                    return version.replace(/WIN/g,'').replace(/,/g,'.');
                }
            } catch(e) {}
        }
    }
})();

exports.version = version;


/**
 * 创建flash对象的html字符串
 * @name swf.createHTML
 * @function
 * @grammar swf.createHTML(options)
 *
 * @param {Object}  options                     创建flash的选项参数
 * @param {string}  options.id                  要创建的flash的标识
 * @param {string}  options.url                 flash文件的url
 * @param {String}  options.errorMessage        未安装flash player或flash player版本号过低时的提示
 * @param {string}  options.ver                 最低需要的flash player版本号
 * @param {string}  options.width               flash的宽度
 * @param {string}  options.height              flash的高度
 * @param {string}  options.align               flash的对齐方式，允许值：middle/left/right/top/bottom
 * @param {string}  options.base                设置用于解析swf文件中的所有相对路径语句的基本目录或URL
 * @param {string}  options.bgcolor             swf文件的背景色
 * @param {string}  options.salign              设置缩放的swf文件在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu                是否显示右键菜单，允许值：true/false
 * @param {boolean} options.loop                播放到最后一帧时是否重新播放，允许值： true/false
 * @param {boolean} options.play                flash是否在浏览器加载时就开始播放。允许值：true/false
 * @param {string}  options.quality             设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string}  options.scale               设置flash内容如何缩放来适应设置的宽高。允许值：showall/noborder/exactfit
 * @param {string}  options.wmode               设置flash的显示模式。允许值：window/opaque/transparent
 * @param {string}  options.allowscriptaccess   设置flash与页面的通信权限。允许值：always/never/sameDomain
 * @param {string}  options.allownetworking     设置swf文件中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen     是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing     允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont          设置静态文本对象是否以设备字体呈现。允许值：true/false
 * @param {boolean} options.swliveconnect       第一次加载flash时浏览器是否应启动Java。允许值：true/false
 * @param {Object}  options.vars                要传递给flash的参数，支持JSON或string类型。
 *
 * @see swf.create
 * @meta standard
 * @returns {string} flash对象的html字符串
 */
var createHTML = function (options) {
    options = options || {};
    var ver = version,
        needVersion = options['ver'] || '6.0.0',
        vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
        encodeHTML = string.encodeHTML;

    // 复制options，避免修改原对象
    for (k in options) {
        tmpOpt[k] = options[k];
    }
    options = tmpOpt;

    // 浏览器支持的flash插件版本判断
    if (ver) {
        ver = ver.split('.');
        needVersion = needVersion.split('.');
        for (i = 0; i < 3; i++) {
            vUnit1 = parseInt(ver[i], 10);
            vUnit2 = parseInt(needVersion[i], 10);
            if (vUnit2 < vUnit1) {
                break;
            } else if (vUnit2 > vUnit1) {
                return ''; // 需要更高的版本号
            }
        }
    } else {
        return ''; // 未安装flash插件
    }

    var vars = options['vars'],
        objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];

    // 初始化object标签需要的classid、codebase属性值
    options['align'] = options['align'] || 'middle';
    options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
    options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
    options['movie'] = options['url'] || '';
    delete options['vars'];
    delete options['url'];

    // 初始化flashvars参数的值
    if ('string' == typeof vars) {
        options['flashvars'] = vars;
    } else {
        var fvars = [];
        for (k in vars) {
            item = vars[k];
            fvars.push(k + "=" + encodeURIComponent(item));
        }
        options['flashvars'] = fvars.join('&');
    }

    // 构建IE下支持的object字符串，包括属性和参数列表
    var str = ['<object '];
    for (i = 0, len = objProperties.length; i < len; i++) {
        item = objProperties[i];
        str.push(' ', item, '="', encodeHTML(options[item]), '"');
    }
    str.push('>');
    var params = {
        'wmode'             : 1,
        'scale'             : 1,
        'quality'           : 1,
        'play'              : 1,
        'loop'              : 1,
        'menu'              : 1,
        'salign'            : 1,
        'bgcolor'           : 1,
        'base'              : 1,
        'allowscriptaccess' : 1,
        'allownetworking'   : 1,
        'allowfullscreen'   : 1,
        'seamlesstabbing'   : 1,
        'devicefont'        : 1,
        'swliveconnect'     : 1,
        'flashvars'         : 1,
        'movie'             : 1
    };

    for (k in options) {
        item = options[k];
        k = k.toLowerCase();
        if (params[k] && (item || item === false || item === 0)) {
            str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
        }
    }

    // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
    options['src']  = options['movie'];
    options['name'] = options['id'];
    delete options['id'];
    delete options['movie'];
    delete options['classid'];
    delete options['codebase'];
    options['type'] = 'application/x-shockwave-flash';
    options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';


    // 构建embed标签的字符串
    str.push('<embed');
    // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
    // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
    var salign;
    for (k in options) {
        item = options[k];
        if (item || item === false || item === 0) {
            if ((new RegExp("^salign\x24", "i")).test(k)) {
                salign = item;
                continue;
            }

            str.push(' ', k, '="', encodeHTML(item), '"');
        }
    }

    if (salign) {
        str.push(' salign="', encodeHTML(salign), '"');
    }
    str.push('></embed></object>');

    return str.join('');
};

exports.createHTML = createHTML;


/**
 * 在页面中创建一个flash对象
 * @name swf.create
 * @function
 * @grammar swf.create(options[, container])
 *
 * @param {Object}  options                     创建flash的选项参数
 * @param {string}  options.id                  要创建的flash的标识
 * @param {string}  options.url                 flash文件的url
 * @param {String}  options.errorMessage        未安装flash player或flash player版本号过低时的提示
 * @param {string}  options.ver                 最低需要的flash player版本号
 * @param {string}  options.width               flash的宽度
 * @param {string}  options.height              flash的高度
 * @param {string}  options.align               flash的对齐方式，允许值：middle/left/right/top/bottom
 * @param {string}  options.base                设置用于解析swf文件中的所有相对路径语句的基本目录或URL
 * @param {string}  options.bgcolor             swf文件的背景色
 * @param {string}  options.salign              设置缩放的swf文件在由width和height设置定义的区域内的位置。允许值：l/r/t/b/tl/tr/bl/br
 * @param {boolean} options.menu                是否显示右键菜单，允许值：true/false
 * @param {boolean} options.loop                播放到最后一帧时是否重新播放，允许值： true/false
 * @param {boolean} options.play                flash是否在浏览器加载时就开始播放。允许值：true/false
 * @param {string}  options.quality             设置flash播放的画质，允许值：low/medium/high/autolow/autohigh/best
 * @param {string}  options.scale               设置flash内容如何缩放来适应设置的宽高。允许值：showall/noborder/exactfit
 * @param {string}  options.wmode               设置flash的显示模式。允许值：window/opaque/transparent
 * @param {string}  options.allowscriptaccess   设置flash与页面的通信权限。允许值：always/never/sameDomain
 * @param {string}  options.allownetworking     设置swf文件中允许使用的网络API。允许值：all/internal/none
 * @param {boolean} options.allowfullscreen     是否允许flash全屏。允许值：true/false
 * @param {boolean} options.seamlesstabbing     允许设置执行无缝跳格，从而使用户能跳出flash应用程序。该参数只能在安装Flash7及更高版本的Windows中使用。允许值：true/false
 * @param {boolean} options.devicefont          设置静态文本对象是否以设备字体呈现。允许值：true/false
 * @param {boolean} options.swliveconnect       第一次加载flash时浏览器是否应启动Java。允许值：true/false
 * @param {Object}  options.vars                要传递给flash的参数，支持JSON或string类型。
 *
 * @param {HTMLElement|string} [container]      flash对象的父容器元素，不传递该参数时在当前代码位置创建flash对象。
 * @meta standard
 * @see swf.createHTML,swf.getMovie
 */
var create = function (options, target) {
    options = options || {};
    var html = createHTML(options)
               || options['errorMessage']
               || '';

    if (target && 'string' == typeof target) {
        target = document.getElementById(target);
    }
    // $(target || document.body).append(html);
    insertHTML(target || document.body, 'beforeEnd', html);
};

exports.create = create;

var _g = function(id) {
    if (!id) return null; //修改IE下dom.g(dom.g('dose_not_exist_id'))报错的bug，by Meizz, dengping
    if ('string' == typeof id || id instanceof String) {
        return document.getElementById(id);
    } else if (id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
        return id;
    }
    return null;
};
/**
 * 在目标元素的指定位置插入HTML代码
 * @name dom.insertHTML
 * @function
 * @grammar dom.insertHTML(element, position, html)
 * @param {HTMLElement|string} element 目标元素或目标元素的id
 * @param {string} position 插入html的位置信息，取值为beforeBegin,afterBegin,beforeEnd,afterEnd
 * @param {string} html 要插入的html
 * @remark
 *
 * 对于position参数，大小写不敏感<br>
 * 参数的意思：beforeBegin&lt;span&gt;afterBegin   this is span! beforeEnd&lt;/span&gt; afterEnd <br />
 * 此外，如果使用本函数插入带有script标签的HTML字符串，script标签对应的脚本将不会被执行。
 *
 * @shortcut insertHTML
 * @meta standard
 *
 * @returns {HTMLElement} 目标元素
 */
var insertHTML = function (element, position, html) {
    element = _g(element);
    var range,begin;

    //在opera中insertAdjacentHTML方法实现不标准，如果DOMNodeInserted方法被监听则无法一次插入多element
    //by lixiaopeng @ 2011-8-19
    if (element.insertAdjacentHTML && !browser.opera) {
        element.insertAdjacentHTML(position, html);
    } else {
        // 这里不做"undefined" != typeof(HTMLElement) && !window.opera判断，其它浏览器将出错？！
        // 但是其实做了判断，其它浏览器下等于这个函数就不能执行了
        range = element.ownerDocument.createRange();
        // FF下range的位置设置错误可能导致创建出来的fragment在插入dom树之后html结构乱掉
        // 改用range.insertNode来插入html, by wenyuxiang @ 2010-12-14.
        position = position.toUpperCase();
        if (position == 'AFTERBEGIN' || position == 'BEFOREEND') {
            range.selectNodeContents(element);
            range.collapse(position == 'AFTERBEGIN');
        } else {
            begin = position == 'BEFOREBEGIN';
            range[begin ? 'setStartBefore' : 'setEndAfter'](element);
            range.collapse(begin);
        }
        range.insertNode(range.createContextualFragment(html));
    }
    return element;
};