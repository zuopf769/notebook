/**
 * @file util.js
 * @description 扩展工具方法
 */

var lang = require('../lib/lang.js');
var url = require('../lib/url.js');
var array = require('../lib/array.js');
var object = require('../lib/object.js');

// 清掉console,原来console.js的位置太低，没有起到重写的作用，放到util里 by Mr.Q @date 2012.11.10

window.FEDEBUG = false;

(function () {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug',
        'dir', 'dirxml', 'error', 'exception',
        'group', 'groupCollapsed', 'groupEnd',
        'info', 'log', 'markTimeline', 'profile',
        'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];

    var length = methods.length;
    var console = (window.console = window.console || {});

    var fedebug = window.FEDEBUG = window.FEDEBUG || url.getQueryValue(location.href, 'fedebug');

    while (length--) {
        method = methods[length];

        if (!fedebug || !console[method]) {
            console[method] = noop;
        }
    }
}());

try {
    document.execCommand('BackgroundImageCache', false, true);
}
catch (e) {}

/**
 * ieReflow 强制ie重绘
 * @param  {Document} doc [document]
 */
var ieReflow = function (doc) {
    doc = doc || document;

    var $bd = $(doc.body);

    $bd.css('zoom', 1);
    $bd.css('zoom', 0);

};

exports.ieReflow = ieReflow;

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
    var dataAttr = 'ZIndexDefaultValue';
    var stack = [];

    return {
        bringToFront: function (el) {
            var $el = $(el);
            var defaultZIndex;

            if ($el.data(dataAttr) === null) {
                defaultZIndex = $el.css('z-index');
                $el.data(dataAttr, defaultZIndex || 0);
            }


            $el.css('z-index', base++);

            if (!$el.attr('id')) {
                el.attr('id', uniqueId('Zuniqueid__'));
            }

            array.remove(stack, el.id);
            stack.push(el.id);
        },

        sendToBack: function (el) {
            var $el = $(el);
            var defaultZIndex = $el.data(dataAttr) || 0;

            $el.css('z-index', defaultZIndex);
            array.remove(stack, el.id);
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

var queue = function () {
    this.q = [];
    this.paused = false;
    this._inProgress = false;
};

object.extend(queue.prototype, {

    add: function () {
        var me = this;
        array.each(arguments, function (item) {
            if (lang.isFunction(item)) {
                me.q.push(item);
            }
        });
        return this;
    },

    dequeue: function () {
        if (!this.empty()) {
            this.q.pop();
        }
        return this;
    },

    next: function () {
        if (this.empty() || this.paused) {
            return;
        }
        this._inProgress = true;
        this.q.shift().apply(this);
        return this;
    },

    flush: function () {
        while (!this.empty() && !this.paused) {
            this.next();
        }
        return this;
    },

    clear: function () {
        this.q.length = 0;
        return this;
    },

    empty: function () {
        if (this.q.length === 0) {
            this._inProgress = false;
            return true;
        }
        return false;
    },

    remove: function (fn) {
        array.remove(this.q, fn);
        return this;
    },

    promote: function (fn) {
        this.remove(fn);
        this.q.unshfit(fn);
        return this;
    },

    pause: function () {
        this.paused = true;
        return this;
    },

    run: function () {
        this.paused = false;
        this.next();
        return this;
    }

});

exports.queue = queue;

var recycle = document.createElement('div');

/**
 * recycleDom ie用的孤立节点回收
 * @param {Element} el 要回收的节点
 */

var recycleDom = function (el) {
    recycle.appendChild(el);
    recycle.innerHTML = '';
    el = null;
};

exports.recycleDom = recycleDom;


var mix = function (des, src, override) {
    var i;
    var len;

    if (lang.isArray(src)) {
        for (i = 0, len = src.length; i < len; i++) {
            mix(des, src[i], override);
        }
        return des;
    }

    for (i in src) {
        if (override || !(i in des)) {
            des[i] = src[i];
        }
    }
    return des;
};

exports.mix = mix;
