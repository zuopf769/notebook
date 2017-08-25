/**
 * @file lang.js
 * @author Mr.Q(robbenmu)
 */

/* eslint-disable */

// 提出guid，防止在与老版本Tangram混用时
// 在下一行错误的修改window[undefined]
var _guid = '$BAIDU$';
window[_guid] = {};
module.exports._guid = _guid;

// Tangram可能被放在闭包中
// 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
var $$ = window[_guid] = window[_guid] || {
    global: {}
};


/**
 * 返回一个当前页面的唯一标识字符串。
 * @name baidu.lang.guid
 * @function
 * @grammar baidu.lang.guid()
 * @version 1.1.1
 * @meta standard
 *
 * @returns {String} 当前页面的唯一标识字符串
 */

$$._counter = $$._counter || 1;

var guid = function () {
    return 'TANGRAM$' + $$._counter++;
};

module.exports.guid = guid;


// 不直接使用window，可以提高3倍左右性能


// 20111129 meizz   去除 _counter.toString(36) 这步运算，节约计算量

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name    baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param   {string}    guid    对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，
 * 因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。
 * <br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */

var _instances = $$._instances = $$._instances = {};

var Class = function () {
    this.guid = guid();

    !this.__decontrolled && (_instances[this.guid] = this);
};

module.exports.Class = Class;


Class.prototype.dispose = function () {
    delete $$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for (var property in this) {
        typeof this[property] !== 'function' &&
        delete this[property];
    }
    this.disposed = true; // 20100716
};

Class.prototype.toString = function () {
    return '[object ' + (this.__type || this._className || 'Object') + ']';
};


window.baiduInstance = function (guid) {
    return $$._instances[guid];
};

var isString = function (source) {
    return '[object String]' === Object.prototype.toString.call(source);
};

module.exports.isString = isString;


/**
 * 自定义的事件对象。
 * @class
 * @name    baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param   {string} type    事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param   {Object} [target]触发事件的对象
 * @meta standard
 * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
 * @meta standard
 * @see baidu.lang.Class
 */
var Event = function (type, target) {
    this.type = type;
    this.returnValue = true;
    this.target = target || null;
    this.currentTarget = null;
};

module.exports.Event = Event;

Class.prototype.fire = Class.prototype.dispatchEvent = function (event, options) {
    isString(event) && (event = new Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i;
    var n;
    var me = this;
    var t = me.__listeners;
    var p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf('on') && (p = 'on' + p);

    typeof me[p] === 'function' && me[p].apply(me, arguments);

    if (typeof t[p] === 'object') {
        for (i = 0, n = t[p].length; i < n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};

Class.prototype.on = Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler !== 'function') {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i;
    var t = this.__listeners;

    type.indexOf('on') && (type = 'on' + type);

    typeof t[type] !== 'object' && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) {
            return handler;
        }
    }

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key === 'string' && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码

var trimer = new RegExp('(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)', 'g');

var trim = function (source) {
    return String(source)
        .replace(trimer, '');
};


/**
 * 添加多个自定义事件。
 * @grammar obj.addEventListeners(events, fn)
 * @param   {object}   events       json对象，key为事件名称，value为事件被触发时应该调用的回调函数
 * @param   {Function} fn           要挂载的函数
 * @version 1.3
 */

/* addEventListeners("onmyevent,onmyotherevent", fn);
 * addEventListeners({
 *      "onmyevent"         : fn,
 *      "onmyotherevent"    : fn1
 * });
 */
Class.prototype.addEventListeners = function (events, fn) {
    if (typeof fn === 'undefined') {
        for (var i in events) {
            this.addEventListener(i, events[i]);
        }
    }
    else {
        events = events.split(',');
        var i = 0;
        var len = events.length;
        var event;
        for (; i < len; i++) {
            this.addEventListener(trim(events[i]), fn);
        }
    }
};


Class.prototype.un = Class.prototype.removeEventListener = function (type, handler) {
    var i;
    var t = this.__listeners;
    if (!t) {
        return;
    }

    // remove all event listener
    if (typeof type === 'undefined') {
        for (i in t) {
            delete t[i];
        }
        return;
    }

    type.indexOf('on') && (type = 'on' + type);

    // 移除某类事件监听
    if (typeof handler === 'undefined') {
        delete t[type];
    }
    else if (t[type]) {
        // [TODO delete 2013] 支持按 key 删除注册的函数
        typeof handler === 'string' && (handler = t[type][handler]) && delete t[type][handler];

        for (i = t[type].length - 1; i >= 0; i--) {
            if (t[type][i] === handler) {
                t[type].splice(i, 1);
            }
        }
    }
};


var createClass = function (constructor, options) {
    options = options || {};
    var superClass = options.superClass || Class;

    // 创建新类的真构造器函数
    var fn = function () {
        var me = this;
        var i;
        var reg;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me.__decontrolled = true);

        // 继承父类的构造器
        superClass.apply(me, arguments);

        // 全局配置
        for (i in fn.options) {
            me[i] = fn.options[i];
        }

        constructor.apply(me, arguments);

        for (i = 0, reg = fn['\x06r']; reg && i < reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    // [TODO delete 2013] 放置全局配置，这个全局配置可以直接写到类里面
    fn.options = options.options || {};

    var C = function () {};
    var cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) {
        fp[i] = cp[i];
    }

    // 20111122 原className参数改名为type
    var type = options.className || options.type;
    typeof type === 'string' && (fp.__type = type);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function (json) {
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn; // 这个静态方法也返回类对象本身
    };

    return fn;
};

module.exports.createClass = createClass;

var createSingle = function (json) {
    var c = new Class();

    for (var key in json) {
        c[key] = json[key];
    }
    return c;
};

module.exports.createSingle = createSingle;

window[_guid]._instances = window[_guid]._instances || {};

var decontrol = function (guid) {
    var m = window[_guid];
    m._instances && (
    delete m._instances[guid]
    );
};

module.exports.decontrol = decontrol;

/**
 * 事件中心
 * @class
 * @name baidu.lang.eventCenter
 * @author rocy
 */
var eventCenter = window.$$_eventCenter = window.$$_eventCenter || createSingle();

module.exports.eventCenter = eventCenter;

var getModule = function (name, opt_obj) {
    var parts = name.split('.');
    var cur = opt_obj || window;
    var part;
    for (; part = parts.shift();) {
        if (cur[part] != null) {
            cur = cur[part];
        }
        else {
            return null;
        }
    }

    return cur;
};

module.exports.getModule = getModule;

var inherits = function (subClass, superClass, type) {
    var key;
    var proto;
    var selfProps = subClass.prototype;
    var Clazz = new Function();

    Clazz.prototype = superClass.prototype;
    proto = subClass.prototype = new Clazz();

    for (key in selfProps) {
        proto[key] = selfProps[key];
    }
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass.prototype;

    // 类名标识，兼容Class的toString，基本没用
    typeof type === 'string' && (proto.__type = type);

    subClass.extend = function (json) {
        for (var i in json) {
            proto[i] = json[i];
        }
        return subClass;
    };

    return subClass;
};

module.exports.inherits = inherits;


var instance = function (guid) {
    return window[_guid]._instances[guid] || null;
};

module.exports.instance = instance;


var isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

module.exports.isArray = isArray;

var isBoolean = function (o) {
    return typeof o === 'boolean';
};

module.exports.isBoolean = isBoolean;


var isDate = function (o) {
    // return o instanceof Date;
    return {}.toString.call(o) === '[object Date]' && o.toString() !== 'Invalid Date' && !isNaN(o);
};

module.exports.isDate = isDate;


var isElement = function (source) {
    return !!(source && source.nodeName && source.nodeType === 1);
};

module.exports.isElement = isElement;


var isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' === Object.prototype.toString.call(source);
};

module.exports.isFunction = isFunction;


var isNumber = function (source) {
    return '[object Number]' === Object.prototype.toString.call(source) && isFinite(source);
};

module.exports.isNumber = isNumber;

var isObject = function (source) {
    return 'function' === typeof source || !!(source && 'object' === typeof source);
};

module.exports.isObject = isObject;


var _module = function (name, module, owner) {
    var packages = name.split('.');
    var len = packages.length - 1;
    var packageName;
    var i = 0;

    // 如果没有owner，找当前作用域，如果当前作用域没有此变量，在window创建
    if (!owner) {
        try {
            if (!(new RegExp('^[a-zA-Z_\x24][a-zA-Z0-9_\x24]*\x24')).test(packages[0])) {
                throw '';
            }
            owner = eval(packages[0]);
            i = 1;
        }
        catch (e) {
            owner = window;
        }
    }

    for (; i < len; i++) {
        packageName = packages[i];
        if (!owner[packageName]) {
            owner[packageName] = {};
        }
        owner = owner[packageName];
    }

    if (!owner[packages[len]]) {
        owner[packages[len]] = module;
    }
};

module.exports.module = _module;

var register = function (Class, constructorHook, methods) {
    var reg = Class['\x06r'] || (Class['\x06r'] = []);
    reg[reg.length] = constructorHook;

    for (var method in methods) {
        Class.prototype[method] = methods[method];
    }
};

module.exports.register = register;

var toArray = function (source) {
    if (source === null || source === undefined) {
        return [];
    }
    if (isArray(source)) {
        return source;
    }

    // The strings and functions also have 'length'
    if (typeof source.length !== 'number' || typeof source === 'string' || isFunction(source)) {
        return [source];
    }

    // nodeList, IE 下调用 [].slice.call(nodeList) 会报错
    if (source.item) {
        var l = source.length;
        var array = new Array(l);
        while (l--) {
            array[l] = source[l];
        }
        return array;
    }

    return [].slice.call(source);
};

module.exports.toArray = toArray;
