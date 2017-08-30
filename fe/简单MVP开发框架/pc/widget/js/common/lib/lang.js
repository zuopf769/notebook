/* eslint-disable */

//提出guid，防止在与老版本Tangram混用时
//在下一行错误的修改window[undefined]
var _guid = "$BAIDU$";
window[_guid] = {};
exports._guid = _guid;

//Tangram可能被放在闭包中
//一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
var $$ = window[_guid] = window[_guid] || {global:{}};

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

var guid = function() {
    return "GUID_" + $$._counter ++;
};

exports.guid = guid;


//不直接使用window，可以提高3倍左右性能


// 20111129	meizz	去除 _counter.toString(36) 这步运算，节约计算量

/**
 * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 * @class
 * @name 	baidu.lang.Class
 * @grammar baidu.lang.Class(guid)
 * @param 	{string}	guid	对象的唯一标识
 * @meta standard
 * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 * @meta standard
 * @see baidu.lang.inherits,baidu.lang.Event
 */

var _instances = $$._instances = $$._instances = {};

var Class = function() {
    this.guid = guid();

    !this.__decontrolled && (_instances[this.guid] = this);
};

exports.Class = Class;


/**
 * 释放对象所持有的资源，主要是自定义事件。
 * @name dispose
 * @grammar obj.dispose()
 * TODO: 将_listeners中绑定的事件剔除掉
 */
Class.prototype.dispose = function(){
    delete $$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);

    for(var property in this){
        typeof this[property] != "function" && delete this[property];
    }
    this.disposed = true;   // 20100716
};

/**
 * 重载了默认的toString方法，使得返回信息更加准确一些。
 * 20111219 meizz 为支持老版本的className属性，以后统一改成 __type
 * @return {string} 对象的String表示形式
 */

Class.prototype.toString = function(){
    return "[object " + (this.__type || this._className || "Object") + "]";
};

/**
 * 按唯一标识guid字符串取得实例对象
 *
 * @param   {String}    guid
 * @return  {object}            实例对象
 */
 window["baiduInstance"] = function(guid) {
     return $$._instances[guid];
 };

//  2011.11.23  meizz   添加 baiduInstance 这个全局方法，可以快速地通过guid得到实例对象
//  2011.11.22  meizz   废除创建类时指定guid的模式，guid只作为只读属性
//  2011.11.22  meizz   废除 baidu.lang._instances 模块，由统一的global机制完成；

/**
 * 判断目标参数是否string类型或String对象
 * @name baidu.lang.isString
 * @function
 * @grammar baidu.lang.isString(source)
 * @param {Any} source 目标参数
 * @shortcut isString
 * @meta standard
 * @see baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isString = function (source) {
    return '[object String]' == Object.prototype.toString.call(source);
};

exports.isString = isString;


/**
 * 自定义的事件对象。
 * @class
 * @name 	baidu.lang.Event
 * @grammar baidu.lang.Event(type[, target])
 * @param 	{string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
 * @param 	{Object} [target]触发事件的对象
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

exports.Event = Event;

/**
 * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.dispatchEvent(event, options)
 * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
 * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。例如：<br>
myobj.onMyEvent = function(){}<br>
myobj.addEventListener("onMyEvent", function(){});
 */
Class.prototype.fire =
Class.prototype.dispatchEvent = function (event, options) {
    isString(event) && (event = new Event(event));

    !this.__listeners && (this.__listeners = {});

    // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
    options = options || {};
    for (var i in options) {
        event[i] = options[i];
    }

    var i, n, me = this, t = me.__listeners, p = event.type;
    event.target = event.target || (event.currentTarget = me);

    // 支持非 on 开头的事件名
    p.indexOf("on") && (p = "on" + p);

    typeof me[p] == "function" && me[p].apply(me, arguments);

    if (typeof t[p] == "object") {
        for (i=0, n=t[p].length; i<n; i++) {
            t[p][i] && t[p][i].apply(me, arguments);
        }
    }
    return event.returnValue;
};

/**
 * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * @grammar obj.addEventListener(type, handler[, key])
 * @param   {string}   type         自定义事件的名称
 * @param   {Function} handler      自定义事件被触发时应该调用的回调函数
 * @return  {Function}              将用户注入的监听函数返回，以便移除事件监听，特别适用于匿名函数。
 * @remark  事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。
 */
Class.prototype.on =
Class.prototype.addEventListener = function (type, handler, key) {
    if (typeof handler != "function") {
        return;
    }

    !this.__listeners && (this.__listeners = {});

    var i, t = this.__listeners;

    type.indexOf("on") && (type = "on" + type);

    typeof t[type] != "object" && (t[type] = []);

    // 避免函数重复注册
    for (i = t[type].length - 1; i >= 0; i--) {
        if (t[type][i] === handler) return handler;
    };

    t[type].push(handler);

    // [TODO delete 2013] 2011.12.19 兼容老版本，2013删除此行
    key && typeof key == "string" && (t[type][key] = handler);

    return handler;
};

//  2011.12.19  meizz   很悲剧，第三个参数 key 还需要支持一段时间，以兼容老版本脚本
//  2011.11.24  meizz   事件添加监听方法 addEventListener 移除第三个参数 key，添加返回值 handler
//  2011.11.23  meizz   事件handler的存储对象由json改成array，以保证注册函数的执行顺序
//  2011.11.22  meizz   将 removeEventListener 方法分拆到 baidu.lang.Class.removeEventListener 中，以节约主程序代码

var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");

var trim = function (source) {
    return String(source)
            .replace(trimer, "");
};


/**
 * 添加多个自定义事件。
 * @grammar obj.addEventListeners(events, fn)
 * @param 	{object}   events       json对象，key为事件名称，value为事件被触发时应该调用的回调函数
 * @param 	{Function} fn	        要挂载的函数
 * @version 1.3
 */
/* addEventListeners("onmyevent,onmyotherevent", fn);
 * addEventListeners({
 *      "onmyevent"         : fn,
 *      "onmyotherevent"    : fn1
 * });
 */
Class.prototype.addEventListeners = function (events, fn) {
    if(typeof fn == 'undefined'){
        for(var i in events){
            this.addEventListener(i, events[i]);
        }
    }else{
        events = events.split(',');
        var i = 0, len = events.length, event;
        for(; i < len; i++){
            this.addEventListener(trim(events[i]), fn);
        }
    }
};


/**
 * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
 * 事件移除操作是一个不常用的方法，如果你有需求再import调入，可以节约代码
 * 可能通过参数走不同的分支：不传handler会移除某类事件监听；如果连type都不传那就移除当前实例的全部事件监听
 *
 * @grammar obj.removeEventListener(type, handler)
 * @param {string}   type     事件类型
 * @param {Function} handler  要移除的事件监听函数或者监听函数的key
 * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 */
Class.prototype.un =
Class.prototype.removeEventListener = function (type, handler) {
    var i,
        t = this.__listeners;
    if (!t) return;

    // remove all event listener
    if (typeof type == "undefined") {
        for (i in t) {
            delete t[i];
        }
        return;
    }

    type.indexOf("on") && (type = "on" + type);

    // 移除某类事件监听
    if (typeof handler == "undefined") {
        delete t[type];
    } else if (t[type]) {
        // [TODO delete 2013] 支持按 key 删除注册的函数
        typeof handler=="string" && (handler=t[type][handler]) && delete t[type][handler];

        for (i = t[type].length - 1; i >= 0; i--) {
            if (t[type][i] === handler) {
                t[type].splice(i, 1);
            }
        }
    }
};

// 2011.12.19 meizz 为兼容老版本的按 key 删除，添加了一行代码

/**
 * 创建一个类，包括创造类的构造器、继承基类Class
 * @name baidu.lang.createClass
 * @function
 * @grammar baidu.lang.createClass(constructor[, options])
 * @param {Function} constructor 类的构造器函数
 * @param {Object} [options]

 * @config {string} [type] 类名
 * @config {Function} [superClass] 父类，默认为baidu.lang.Class
 * @version 1.2
 * @remark
 *
            使用createClass能方便的创建一个带有继承关系的类。同时会为返回的类对象添加extend方法，使用obj.extend({});可以方便的扩展原型链上的方法和属性

 * @see baidu.lang.Class,baidu.lang.inherits
 *
 * @returns {Object} 一个类对象
 */

var createClass = /**@function*/function(constructor, options) {
    options = options || {};
    var superClass = options.superClass || Class;

    // 创建新类的真构造器函数
    var fn = function(){
        var me = this;

        // 20101030 某类在添加该属性控制时，guid将不在全局instances里控制
        options.decontrolled && (me.__decontrolled = true);

        // 继承父类的构造器
        superClass.apply(me, arguments);

        // 全局配置
        for (i in fn.options) me[i] = fn.options[i];

        constructor.apply(me, arguments);

        for (var i=0, reg=fn["\x06r"]; reg && i<reg.length; i++) {
            reg[i].apply(me, arguments);
        }
    };

    // [TODO delete 2013] 放置全局配置，这个全局配置可以直接写到类里面
    fn.options = options.options || {};

    var C = function(){},
        cp = constructor.prototype;
    C.prototype = superClass.prototype;

    // 继承父类的原型（prototype)链
    var fp = fn.prototype = new C();

    // 继承传参进来的构造器的 prototype 不会丢
    for (var i in cp) fp[i] = cp[i];

    // 20111122 原className参数改名为type
    var type = options.className || options.type;
    typeof type == "string" && (fp.__type = type);

    // 修正这种继承方式带来的 constructor 混乱的问题
    fp.constructor = cp.constructor;

    // 给类扩展出一个静态方法，以代替 baidu.object.extend()
    fn.extend = function(json){
        for (var i in json) {
            fn.prototype[i] = json[i];
        }
        return fn;  // 这个静态方法也返回类对象本身
    };

    return fn;
};

exports.createClass = createClass;

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上

/**
 * 创建一个baidu.lang.Class的单例实例
 * @name baidu.lang.createSingle
 * @function
 * @grammar baidu.lang.createSingle(json)
 * @param {Object} json 直接挂载到这个单例里的预定属性/方法
 * @version 1.2
 * @see baidu.lang.Class
 *
 * @returns {Object} 一个实例
 */
var createSingle = function (json) {
    var c = new Class();

    for (var key in json) {
        c[key] = json[key];
    }
    return c;
};

exports.createSingle = createSingle;


/**
 * 所有类的实例的容器
 * key为每个实例的guid
 * @meta standard
 */

window[_guid]._instances = window[_guid]._instances || {};

//	[TODO]	meizz	在2012年版本中将删除此模块

/**
 * 解除instance中对指定类实例的引用关系。
 * @name baidu.lang.decontrol
 * @function
 * @grammar baidu.lang.decontrol(guid)
 * @param {string} guid 类的唯一标识
 * @version 1.1.1
 * @see baidu.lang.instance
 */
var decontrol = function(guid) {
    var m = window[_guid];
    m._instances && (delete m._instances[guid]);
};

exports.decontrol = decontrol;

/**
 * 事件中心
 * @class
 * @name baidu.lang.eventCenter
 * @author rocy
 */
var eventCenter = window.$$_eventCenter = window.$$_eventCenter || createSingle();

exports.eventCenter = eventCenter;

/**
 * 注册全局事件监听器。
 * @name baidu.lang.eventCenter.addEventListener
 * @function
 * @grammar baidu.lang.eventCenter.addEventListener(type, handler[, key])
 * @param 	{string}   type         自定义事件的名称
 * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
 * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
 * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。
 */

/**
 * 移除全局事件监听器。
 * @name baidu.lang.eventCenter.removeEventListener
 * @grammar baidu.lang.eventCenter.removeEventListener(type, handler)
 * @function
 * @param {string}   type     事件类型
 * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
 * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
 */

/**
 * 派发全局自定义事件，使得绑定到全局自定义事件上面的函数都会被执行。
 * @name baidu.lang.eventCenter.dispatchEvent
 * @grammar baidu.lang.eventCenter.dispatchEvent(event, options)
 * @function
 * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
 * @param {Object} 					options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
 */

/**
 * 根据变量名或者命名空间来查找对象
 * @function
 * @grammar baidu.lang.getModule(name, opt_obj)
 * @param {string} name 变量或者命名空间的名字.
 * @param {Object=} opt_obj 从这个对象开始查找，默认是window;
 * @return {?Object} 返回找到的对象，如果没有找到返回null.
 * @see goog.getObjectByName
 */
var getModule = function(name, opt_obj) {
    var parts = name.split('.'),
        cur = opt_obj || window,
        part;
    for (; part = parts.shift(); ) {
        if (cur[part] != null) {
            cur = cur[part];
        } else {
          return null;
        }
    }

    return cur;
};

exports.getModule = getModule;

/**
 * 为类型构造器建立继承关系
 * @name baidu.lang.inherits
 * @function
 * @grammar baidu.lang.inherits(subClass, superClass[, type])
 * @param {Function} subClass 子类构造器
 * @param {Function} superClass 父类构造器
 * @param {string} type 类名标识
 * @remark
 *
使subClass继承superClass的prototype，因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
<strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>

 * @shortcut inherits
 * @meta standard
 * @see baidu.lang.Class
 */
var inherits = function (subClass, superClass, type) {
    var key, proto,
        selfProps = subClass.prototype,
        clazz = new Function();

    clazz.prototype = superClass.prototype;
    proto = subClass.prototype = new clazz();

    for (key in selfProps) {
        proto[key] = selfProps[key];
    }
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass.prototype;

    // 类名标识，兼容Class的toString，基本没用
    typeof type == "string" && (proto.__type = type);

    subClass.extend = function(json) {
        for (var i in json) proto[i] = json[i];
        return subClass;
    }

    return subClass;
};

exports.inherits = inherits;

//  2011.11.22  meizz   为类添加了一个静态方法extend()，方便代码书写
/**
 * 根据参数(guid)的指定，返回对应的实例对象引用
 * @name baidu.lang.instance
 * @function
 * @grammar baidu.lang.instance(guid)
 * @param {string} guid 需要获取实例的guid
 * @meta standard
 *
 * @returns {Object|null} 如果存在的话，返回;否则返回null。
 */
var instance = function (guid) {
    return window[_guid]._instances[guid] || null;
};

exports.instance = instance;


/**
 * 判断目标参数是否Array对象
 * @name baidu.lang.isArray
 * @function
 * @grammar baidu.lang.isArray(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isArray = function (source) {
    return '[object Array]' == Object.prototype.toString.call(source);
};

exports.isArray = isArray;

/**
 * 判断目标参数是否Boolean对象
 * @name baidu.lang.isBoolean
 * @function
 * @grammar baidu.lang.isBoolean(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isElement,baidu.lang.isArray,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isBoolean = function(o) {
    return typeof o === 'boolean';
};

exports.isBoolean = isBoolean;

/**
 * 判断目标参数是否为Date对象
 * @name baidu.lang.isDate
 * @function
 * @grammar baidu.lang.isDate(source)
 * @param {Any} source 目标参数
 * @version 1.3
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isBoolean,baidu.lang.isElement
 *
 * @returns {boolean} 类型判断结果
 */
var isDate = function(o) {
    // return o instanceof Date;
    return {}.toString.call(o) === "[object Date]" && o.toString() !== 'Invalid Date' && !isNaN(o);
};

exports.isDate = isDate;

/**
 * 判断目标参数是否为Element对象
 * @name baidu.lang.isElement
 * @function
 * @grammar baidu.lang.isElement(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isElement = function (source) {
    return !!(source && source.nodeName && source.nodeType == 1);
};

exports.isElement = isElement;


/**
 * 判断目标参数是否为function或Function实例
 * @name baidu.lang.isFunction
 * @function
 * @grammar baidu.lang.isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
var isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};

exports.isFunction = isFunction;

/**
 * 判断目标参数是否number类型或Number对象
 * @name baidu.lang.isNumber
 * @function
 * @grammar baidu.lang.isNumber(source)
 * @param {Any} source 目标参数
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isObject,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 * @remark 用本函数判断NaN会返回false，尽管在Javascript中是Number类型。
 */
var isNumber = function (source) {
    return '[object Number]' == Object.prototype.toString.call(source) && isFinite(source);
};

exports.isNumber = isNumber;

/**
 * 判断目标参数是否为Object对象
 * @name baidu.lang.isObject
 * @function
 * @grammar baidu.lang.isObject(source)
 * @param {Any} source 目标参数
 * @shortcut isObject
 * @meta standard
 * @see baidu.lang.isString,baidu.lang.isNumber,baidu.lang.isArray,baidu.lang.isElement,baidu.lang.isBoolean,baidu.lang.isDate
 *
 * @returns {boolean} 类型判断结果
 */
var isObject = function (source) {
    return 'function' == typeof source || !!(source && 'object' == typeof source);
};

exports.isObject = isObject;

/**
 * 增加自定义模块扩展,默认创建在当前作用域
 * @author erik, berg
 * @name baidu.lang.module
 * @function
 * @grammar baidu.lang.module(name, module[, owner])
 * @param {string} name 需要创建的模块名.
 * @param {Any} module 需要创建的模块对象.
 * @param {Object} [owner] 模块创建的目标环境，默认为window.
 * @remark
 *
            从1.1.1开始，module方法会优先在当前作用域下寻找模块，如果无法找到，则寻找window下的模块

 * @meta standard
 */
var module = function(name, module, owner) {
    var packages = name.split('.'),
        len = packages.length - 1,
        packageName,
        i = 0;

    // 如果没有owner，找当前作用域，如果当前作用域没有此变量，在window创建
    if (!owner) {
        try {
            if (!(new RegExp('^[a-zA-Z_\x24][a-zA-Z0-9_\x24]*\x24')).test(packages[0])) {
                throw '';
            }
            owner = eval(packages[0]);
            i = 1;
        }catch (e) {
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

exports.module = module;

/**
 * 向某个类注册插件
 * @name baidu.lang.register
 * @function
 * @grammar baidu.lang.register(Class, constructorHook, methods)
 * @param   {Class}     Class   		接受注册的载体 类
 * @param   {Function}  constructorHook 运行在载体类构造器里钩子函数
 * @param	{JSON}		methods			挂载到载体类原型链上的方法集，可选
 * @meta standard
 *
 */
var register = function (Class, constructorHook, methods) {
    var reg = Class["\x06r"] || (Class["\x06r"] = []);
    reg[reg.length] = constructorHook;

    for (var method in methods) {
        Class.prototype[method] = methods[method];
    }
};

exports.register = register;

// 20111221 meizz   修改插件函数的存放地，重新放回类构造器静态属性上
// 20111129	meizz	添加第三个参数，可以直接挂载方法到目标类原型链上
/**
 * 将一个变量转换成array
 * @name baidu.lang.toArray
 * @function
 * @grammar baidu.lang.toArray(source)
 * @param {mix} source 需要转换成array的变量
 * @version 1.3
 * @meta standard
 * @returns {array} 转换后的array
 */
var toArray = function (source) {
    if (source === null || source === undefined)
        return [];
    if (isArray(source))
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

exports.toArray = toArray;

