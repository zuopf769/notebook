/**
 * @file  Event Emitter
 * @author  zuopengfei01
 */

/**
 * Emitter
 *
 * @exports Emitter
 * @constructor
 */
function Emitter() {}

/**
 * Emitter的prototype（为了便于访问）
 *
 * @inner
 */
var proto = Emitter.prototype;

/**
 * 获取事件列表
 * 若还没有任何事件则初始化列表
 *
 * @private
 * @return {Object}
 */
proto._getEvents = function () {
    if (!this._events) {
        this._events = {};
    }

    return this._events;
};

/**
 * 获取最大监听器个数
 * 若尚未设置，则初始化最大个数为10
 *
 * @private
 * @return {number}
 */
proto._getMaxListeners = function () {
    if (isNaN(this.maxListeners)) {
        this.maxListeners = 10;
    }

    return this.maxListeners;
};

/**
 * 挂载事件
 *
 * @public
 * @param {string} event 事件名
 * @param {Function} listener 监听器
 * @return {Emitter}
 */
proto.on = function (event, listener) {
    var events = this._getEvents();
    var maxListeners = this._getMaxListeners();

    events[event] = events[event] || [];

    var currentListeners = events[event].length;
    if (currentListeners >= maxListeners && maxListeners !== 0) {
        throw new RangeError(
            'Warning: possible Emitter memory leak detected. '
            + currentListeners
            + ' listeners added.'
       );
    }

    events[event].push(listener);

    return this;
};

/**
 * 挂载只执行一次的事件
 *
 * @public
 * @param {string} event 事件名
 * @param {Function} listener 监听器
 * @return {Emitter}
 */
proto.once = function (event, listener) {
    var me = this;

    function on() {
        me.off(event, on);
        listener.apply(this, arguments);
    }
    // 挂到on上以方便删除
    on.listener = listener;

    this.on(event, on);

    return this;
};

/**
 * 注销事件与监听器
 * 任何参数都`不传`将注销当前实例的所有事件
 * 只传入`event`将注销该事件下挂载的所有监听器
 * 传入`event`与`listener`将只注销该监听器
 *
 * @public
 * @param {string=} event 事件名
 * @param {Function=} listener 监听器
 * @return {Emitter}
 */
proto.off = function (event, listener) {
    var events = this._getEvents();

    // 移除所有事件
    if (0 === arguments.length) {
        this._events = {};
        return this;
    }

    var listeners = events[event];
    if (!listeners) {
        return this;
    }

    // 移除指定事件下的所有监听器
    if (1 === arguments.length) {
        delete events[event];
        return this;
    }

    // 移除指定监听器（包括对once的处理）
    var cb;
    for (var i = 0; i < listeners.length; i++) {
        cb = listeners[i];
        if (cb === listener || cb.listener === listener) {
            listeners.splice(i, 1);
            break;
        }
    }
    return this;
};

/**
 * 触发事件
 *
 * @public
 * @param {string} event 事件名
 * @param {...*} args 传递给监听器的参数，可以有多个
 * @return {Emitter}
 */
proto.emit = function (event) {
    var events = this._getEvents();
    var listeners = events[event];
    // 内联arguments的转化 提升性能
    var args = [];
    for (var i = 1; i < arguments.length; i++) {
        args.push(arguments[i]);
    }

    if (listeners) {
        listeners = listeners.slice(0);
        for (i = 0; i < listeners.length; i++) {
            listeners[i].apply(this, args);
        }
    }

    return this;
};

/**
 * 返回指定事件的监听器列表
 *
 * @public
 * @param {string} event 事件名
 * @return {Array} 监听器列表
 */
proto.listeners = function (event) {
    var events = this._getEvents();
    return events[event] || [];
};

/**
 * 设置监听器的最大个数，为0时不限制
 *
 * @param {number} number 监听器个数
 * @return {Emitter}
 */
proto.setMaxListeners = function (number) {
    this.maxListeners = number;

    return this;
};

// var protoKeys = Object.keys(proto);

// /**
//  * 将Emitter混入目标对象
//  *
//  * @param {Object} obj 目标对象
//  * @return {Object} 混入Emitter后的对象
//  */
// Emitter.mixin = function (obj) {
//     // forIn不利于V8的优化
//     var key;
//     for (var i = 0, max = protoKeys.length; i < max; i++) {
//         key = protoKeys[i];
//         obj[key] = proto[key];
//     }
//     return obj;
// };


