/**
 * @file util.js
 */

var $ = require('../dep/zepto_extend.js');

var arrayRemove = function (source, match) {
    var len = source.length;

    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
        }

    }
    return source;
};

var uniqueId = (function () {
    var idCounter = 1;
    return function (prefix) {
        var id = idCounter++;
        return prefix ? prefix + id : id;
    };
})();

exports.uniqueId = uniqueId;

var zIndexManager = (function () {
    var base = 9000;
    var attr = 'ZIndexDefaultValue';
    var stack = [];

    return {
        bringToFront: function (el) {
            var defaultZIndex;
            var $el = $(el);

            if ($el.data(attr) === null) {
                defaultZIndex = $el.css('z-index');
                $el.data(attr, defaultZIndex);
            }

            $el.css('z-index', base++);

            if (!el.id) {
                el.id = uniqueId('Zuniqueid__');
            }

            arrayRemove(stack, el.id);
            stack.push(el.id);
        },

        sendToBack: function (el) {
            var $el = $(el);
            var defaultZIndex = $el.data(defaultZIndex) || 0;

            if (!el.id) {
                el.id = uniqueId('Zuniqueid__');
            }

            $el.css('z-index', defaultZIndex);
            arrayRemove(stack, el.id);
        },

        getActive: function () {
            if (stack.length > 0) {
                return stack[stack.length - 1];
            }

            return null;
        }

    };
})();

exports.zIndexManager = zIndexManager;

/**
 * 调用此方法，可以减小重复实例化Zepto的开销。所有通过此方法调用的，都将公用一个Zepto实例，
 * 如果想减少Zepto实例创建的开销，就用此方法。
 * @method staticCall
 * @grammar gmu.staticCall( dom, fnName, args... )
 * @param  {DOM} elem Dom对象
 * @param  {String} fn Zepto方法名。
 * @param {*} * zepto中对应的方法参数。
 */
var staticCall = (function ($) {
    var proto = $.fn;
    var slice = [].slice;
    var instance = $();

    instance.length = 1;

    return function (item, fn) {
        instance[0] = item;
        return proto[fn].apply(instance, slice.call(arguments, 2));
    };

})($);

exports.staticCall = staticCall;

var deferFn = function (fn, time, context) {
    time = time || 13;
    context = context || null;

    setTimeout(function () {
        fn.call(context);
    }, time);
};
exports.deferFn = deferFn;

var docTypeList = {
    0: 'none',
    1: 'doc',
    2: 'xls',
    3: 'ppt',
    4: 'docx',
    5: 'xlsx',
    6: 'pptx',
    7: 'pdf',
    8: 'txt',
    9: 'wps',
    10: 'et',
    11: 'dps',
    12: 'vsd',
    13: 'rtf',
    14: 'pot',
    15: 'pps',
    16: 'epub'

};

/**
 * docTypeId转换为文档扩展名
 *
 * @method docType2Str
 * @param {number} docType 文档类型id
 * @return {string} 文档扩展名
 */
exports.docType2Str = function (docType) {
    return docTypeList[docType];
};

/**
 * query转换为json对象
 *
 * @method docType2Str
 * @param {string} search 符合url search格式的字符串
 * @return {Object} JSON对象
 */
exports.query2JSON = function (search) {
    var query = search.substr(search.lastIndexOf('?') + 1);
    var params = query.split('&');
    var len = params.length;
    var result = {};
    var i = 0;
    var key;
    var value;
    var item;
    var param;

    for (; i < len; i++) {
        if (!params[i]) {
            continue;
        }

        param = params[i].split('=');
        key = param[0];
        value = param[1];

        item = result[key];
        if ('undefined' === typeof item) {
            result[key] = value;
        }
        else if ($.isArray(item)) {
            item.push(value);
        }
        else {
            result[key] = [item, value];
        }
    }
    return result;
};
var nativeKeys = Object.keys;
var keys = function (obj) {
    if (!$.isPlainObject(obj)) {
        return [];
    }

    if (nativeKeys) {
        return nativeKeys(obj);
    }

    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }

    }
    return keys;
};
var invert = function (obj) {
    var result = {};
    var keyList = keys(obj);
    for (var i = 0, length = keyList.length; i < length; i++) {
        result[obj[keyList[i]]] = keyList[i];
    }
    return result;
};
var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#x27;',
    '`': '&#x60;'

};
var unescapeMap = invert(escapeMap);

// Functions for escaping and unescaping strings to/from HTML interpolation.
var createEscaper = function (map) {
    var escaper = function (match) {
        return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function (string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
};
exports.escape = createEscaper(escapeMap);
exports.unescape = createEscaper(unescapeMap);


var decodeHTML = function (source) {
    var str = String(source)
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
    // 处理转义的中文和实体字符
    return str.replace(/&#([\d]+);/g, function (_0, _1) {
        return String.fromCharCode(parseInt(_1, 10));
    });
};

exports.decodeHTML = decodeHTML;


var reqanimFrame = (function () {
    var requestAnimationFrame;
    var cancelAnimationFrame;

    if (window.requestAnimationFrame) {
        requestAnimationFrame = window.requestAnimationFrame;
        cancelAnimationFrame = window.cancelAnimationFrame;
    }

    if (window.webkitRequestAnimationFrame) { // Chrome <= 23, Safari <= 6.1, Blackberry 10

        requestAnimationFrame = window.webkitRequestAnimationFrame;
        cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame;
    }


    var lastTime = 0;

    requestAnimationFrame = function (callback) {

        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);

        lastTime = currTime + timeToCall;

        return id; // return the id for cancellation capabilities

    };

    cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };

    return {
        requestAnimationFrame: requestAnimationFrame,
        cancelAnimationFrame: cancelAnimationFrame
    };

})();

exports.requestAnimationFrame = reqanimFrame.requestAnimationFrame;
exports.cancelAnimationFrame = reqanimFrame.cancelAnimationFrame;
