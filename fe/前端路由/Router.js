var T = {};

T.browser = {};
T.browser.ie = /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined;
T.browser.firefox = /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined;

T.lang = {};
T.lang.isObject = function (source) {
    return 'function' == typeof source || !!(source && 'object' == typeof source);
};
T.lang.isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};
T.lang.toArray = function (source) {
    if (source === null || source === undefined)
        return [];
    if (T.lang.isArray(source))
        return source;

    // The strings and functions also have 'length'
    if (typeof source.length !== 'number' || typeof source === 'string' || isFunction(source)) {
        return [source];
    }

    //nodeList, IE 下调用 [].slice.call(nodeList) 会报错
    if (source.item) {
        var l = source.length, array = new Array(l);
        while (l--)
            array[l] = source[l];
        return array;
    }

    return [].slice.call(source);
};

T.object = {};
T.object.each = function (source, iterator) {
    var returnValue, key, item;
    if ('function' == typeof iterator) {
        for (key in source) {
            if (source.hasOwnProperty(key)) {
                item = source[key];
                returnValue = iterator.call(source, item, key);

                if (returnValue === false) {
                    break;
                }
            }
        }
    }
    return source;
};

T.dom = {};
T.dom.ready = $(document).ready;



T.fn = {};

function isString(source){
    return '[object String]' == Object.prototype.toString.call(source);
}

T.fn.bind = baidu.fn.bind = function(func, scope) {
    var xargs = arguments.length > 2 ? [].slice.call(arguments, 2) : null;
    return function () {
        var fn = isString(func) ? scope[func] : func,
            args = (xargs) ? xargs.concat([].slice.call(arguments, 0)) : arguments;
        return fn.apply(scope || fn, args);
    };
};

T.fn.blank = $.noop;

/**
 * historyListen 来源于tangram扩展
 * @return {[type]} [description]
 */
var historyListen = (function() {

    var _curHash,       //当前hash值，用来判断hash变化
        _frame,
        _callbackFun;   //hash变化时的回调函数

    /**
     * 用于IE更新iframe的hash值
     * @private
     * @param {String} hash
     */
    function _addHistory(hash) {
        var fdoc = _frame.contentWindow.document;
        hash = hash || '#';

        //通过open方法触发frame的onload
        fdoc.open();
        fdoc.write('\<script\>window.top.location.hash="' + hash + '";\</script\>');
        fdoc.close();
        fdoc.location.hash = hash;
    }

    ;

    /**
     * @private
     * 执行回调函数并改边hash值
     */
    function _hashChangeCallBack() {

        _callbackFun && _callbackFun();
        //设置当前的hash值，防止轮询再次监听到hash变化
        _curHash = (window.location.hash.replace(/^#/, '') || '');
    }

    ;

    /**
     * 判断hash是否变化
     * @private
     */
    function _checkHash() {

        var hash = location.hash.replace(/^#/, '');
        if (hash != _curHash) {
            //如果frame存在通过frame的onload事件来触发回调方法，如果不存在直接执行回调函数
            _frame ? _addHistory(hash) : _hashChangeCallBack();
        }
    }

    ;

    /**
     * 通过hash值的来记录页面的状态
     * 通过js改变hash的时候，浏览器会增加历史记录，并且执行回调函数
     * @param {Function} callBack hash值变更时的回调函数.
     */
    function listen(callBack) {
        _curHash = ('');
        if (callBack)
            _callbackFun = callBack;

        if (T.browser.ie) {

            //IE下通过创建frame来增加history
            _frame = document.createElement('iframe');
            _frame.style.display = 'none';
            document.body.appendChild(_frame);

            _addHistory(window.location.hash);
            //通过frame的onload事件触发回调函数
            _frame.attachEvent('onload', function() {
                _hashChangeCallBack();
            });
            setInterval(_checkHash, 100);

        } else if (T.browser.firefox < 3.6) {
            //ff3.5以下版本hash变化会自动增加历史记录，只需轮询监听hash变化调用回调函数
            setInterval(_checkHash, 100);

        } else {
            if (_curHash != location.hash.replace(/^#/, ''))
                _curHash = (window.location.hash.replace(/^#/, '') || '');

            //ff3.6 chrome safari oprea11通过onhashchange实现
            window.onhashchange = _hashChangeCallBack;
        }
    }


    return listen;
})();



var RouteList = [];

var namedParam = /:([\w\d]+)/g;
var splatParam = /\*([\w\d]+)/g;
var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
var hashStrip = /^#*/;

var Route = {
    add : function(add, callback) {
        var _self = this;
        if (T.lang.isObject(add)) {
            T.object.each(add, function(val, key) {
                _slef.add(key, val);
            });
        } else {
            RouteList.push(_self._warp(add, callback));
        }
    },
    _warp : function(path, callback) {
        var route;

        if (typeof path === "string") {
            path = path.replace(escapeRegExp, "\\$&")
                .replace(namedParam, "([^\/]*)")
                .replace(splatParam, "(.*?)");

            route = new RegExp('^' + path + '$');
        } else {
            route = path;
        }
        return {'route':route,'callback':callback};
    },

    getPath: function() {
        return window.location.pathname;
    },

    getHash: function() {
        return window.location.hash;
    },

    getHost: function() {
        return((document.location + "").replace(
            this.getPath() + this.getHash(), ""
        ));
    },

    getFragment: function() {
        return this.getHash().replace(hashStrip, "");
    },

    navigate: function() {
        var args = T.lang.toArray(arguments);
        var triggerRoutes = true;

        if (typeof args[args.length - 1] === "boolean") {
            triggerRoutes = args.pop();
        }

        var path = args.join("/");
        if (this.path === path) return;

        if (!triggerRoutes) {
            this.path = path;
        }
        window.location.hash = path;

    },
    change: function(e) {
        //var path = (this.history ? this.getPath() : this.getFragment());
        var path = this.getFragment();
        if (path === this.path) return;
        this.path = path;
        for (var i = 0; i < RouteList.length; i++)
            if (this._match(RouteList[i], path)) return;
    },
    _match: function(item, path) {
        var match = item.route.exec(path)
        if (!match) return false;
        var params = match.slice(1);
        item.callback(params);
        return true;
    },
    create : function() {
        var _self = this;
        T.dom.ready(function() {
            _self.change();
            historyListen(T.fn.bind(_self.change, _self));
        })

    }

};

module.exports.Route = Route;
