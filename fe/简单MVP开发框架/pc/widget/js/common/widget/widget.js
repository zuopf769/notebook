/**
 * @file Widegt.js
 * @description ui组件基类
 */

var object = require('../lib/object.js');
var lang = require('../lib/lang.js');
var array = require('../lib/array.js');
var util = require('./util.js');

var emptyFn = function () {};
var mix = util.mix;


/**
 * widget ui组件基类
 * @version 1.1
 * @author Mr.Q(robbenmu)
 * @class
 * @param  {Object} proto  会将该object挂载在这个widget返回函数的prototype上
 * @param  {Object|Null} method 该widget的的一些类型及继承父类、插件
 * @return {Function}   返回这个widget包装后的function
 */

var widget = function (proto, method) {
    proto = mix(proto || {}, {
        el: '',
        elements: {},
        events: {},
        // 默认选项
        Options: {
        }

    });

    method = mix(method || {}, {
        prefix: 'widget',
        // 类型，做禁用的class前缀
        type: '',
        // 继承
        superClass: lang.Class

    });


    var $super = method.superClass;

    var fn = function (options) {
        var me = this;
        var args = arguments;

        options = options || {};

        me.$el = null;
        me.$elements = {};

        // me.options = mix(proto.Options, options, true);
        me.options = $.extend({}, proto.Options, options);

        me.type = method.type;
        me.prefix = method.prefix;
        // 元素创建的标志位
        me._created = false;
        // 禁用的标志位
        me._disabledStatus = false;

        // 在onload后将_created与_disabledStatus重置
        me.on('onload', function () {
            me._created = true;
            me._disabledStatus = true;

            me.$el = $(me.options.el);
            me.$el.data(me.prefix, this);

            var meta = me.$el.data(me.prefix + '-options');
            me.options = mix(me.options, meta, true);

            me.refreshElements();
            // 绑定evetns上的对象
            me._bindEvents(me.events);
        });

        // 执行构造器
        lang.isFunction(me._init) && me._init.apply(me, args);

        fn.$$plugins && array.each(fn.$$plugins, function (item, i) {
            item.apply(me, args);
        });
    };

    // 继承$super
    lang.inherits(fn, $super);

    // 改写_init函数
    /* eslint-disable fecs-camelcase */
    var _init = lang.isFunction(proto._init) ? proto._init : emptyFn;
    var _superClassInit = $super === lang.Class ? lang.Class : $super.prototype._init;
    /* eslint-enable fecs-camelcase */

    // _init执行父类构造函数
    proto._init = function () {
        var args = arguments;
        var me = this;

        lang.isFunction(_superClassInit) && _superClassInit.apply(me, args);
        lang.isFunction(_init) && _init.apply(me, args);
    };

    // 挂载默认的扩展原型
    fn.extend(mix(proto, widget._method));

    return fn;
};

widget._method = {

    /**
     * _bindEvents 绑定events对象的事件
     * 支持4种写法:
     * {
     *     '$hd click,mouseover .item': 'clickHandle',
     *     '$hd click': 'clickHandle',
     *     'click .item': 'clickHandle',
     *     'click': 'clickHandle'
     * }
     *
     * @private
     * @param {Object} events 绑定的事件对象map
     * @return {undefined}
     */
    _bindEvents: function (events) {
        var me = this;
        events = events || me.events;

        if (!lang.isObject(events)) {
            return false;
        }

        object.each(events, function (val, key) {
            var parseKey = key.split(/\s+/);
            var element;
            var type;
            var selector;

            if (!(val in me)) {
                throw new Error('缺少' + val + '事件函数');
            }

            switch (parseKey.length) {
                case 3:
                    element = me.$elements[parseKey[0]];
                    type = parseKey[1];
                    selector = parseKey[2];
                    break;

                case 2:
                    if (parseKey[0].match(/^\$/)) {
                        element = me.$elements[parseKey[0]];
                        type = parseKey[1];
                    }
                    else {
                        element = me.$el;
                        type = parseKey[0];
                        selector = parseKey[1];
                    }
                    break;

                case 1:
                    element = me.$el;
                    type = parseKey[0];
                    break;

                default:
                    break;
            }

            if (!selector) {
                me.bindEvent(element, type, val);
            }
            else {
                me.bindEvent(element, type, selector, val);
            }
        });
    },

    /**
     * bindEvent 绑定事件,添加了命名空间(type),好做回收使用
     *
     * @param {Element} element 元素
     * @param {Event} type 事件类型
     * @param {string} selector 代理使用的选择器
     * @param {Function} fun 绑定的函数
     * @return {Object} this
     */
    bindEvent: function (element, type, selector, fun) {
        var me = this;
        var args = arguments;
        var namespace = me.type;

        if (args.length === 3) {
            fun = selector;
            selector = null;
        }

        if (lang.isString(fun)) {
            fun = me[fun];
        }

        fun = $.proxy(fun, me);

        type = type.split(',');

        type = array.map(type, function (item, i) {
            return item + '.' + namespace;
        });

        type = type.join(' ');

        if (!selector) {
            $(element).on(type, fun);
        }
        else {
            $(element).on(type, selector, fun);
        }

        return this;
    },

    /**
     * unBindEvent 解绑绑定事件,添加了命名空间(type),好做回收使用
     *
     * @param {Element} element 元素
     * @param {Event} type 事件类型
     * @param {string} selector 代理使用的选择器
     * @param {Function} fun 绑定的函数
     */
    unBindEvent: function (element, type, selector, fun) {
        var me = this;
        var args = arguments;
        var namespace = me.type;


        if (args.length === 3) {
            fun = selector;
            selector = null;
        }

        if (lang.isString(fun)) {
            fun = me[fun];
        }

        fun = $.proxy(fun, me);

        type = type.split(',');

        type = array.map(type, function (item, i) {
            return item + '.' + namespace;
        });

        type = type.join(' ');

        if (!selector) {
            $(element).off(type, fun);
        }
        else {
            $(element).off(type, selector, fun);
        }

    },


    /**
     * dispose 析构函数
     * 析构时派发ondispose事件并调用Tangram的lang.Class.dispose来做销毁
     * @return
     */

    dispose: function () {
        debugger
        var me = this;
        var namespace = me.type;

        me.$el.off('.' + namespace);
        me.$el.find('*').off('.' + namespace);
        me.$el.removeData(me.prefix + '-options');

        me.fire('ondispose') && lang.Class.prototype.dispose.call(me);
    },

    /**
     * _setStatus 设置状态
     *
     * @param {boolen} key 是否禁用
     * @return {Object} this
     */
    /* eslint-disable fecs-camelcase */
    _setStatus: function (key) {
    /* eslint-enable fecs-camelcase */
        if (key) {
            this._disabledStatus = true;
            this.$el.addClass(this.type + '-disabled ui-state-disabled');
        }
        else {
            this._disabledStatus = false;
            this.$el.removeClass(this.type + '-disabled ui-state-disabled');
        }

        return this;
    },

    /**
     * setDisable 设置禁用
     *
     * @return {Object} this
     */
    setDisable: function () {
        this._setStatus(true);
        this.fire('disable');

        return this;
    },

    /**
     * setEnable 设置启用
     *
     * @return {Object} this
     */
    setEnable: function () {
        this._setStatus(false);
        this.fire('enable');

        return this;
    },

    /**
     * getStatus 获取状态
     *
     * @return {boolean}
     */
    getStatus: function () {
        return this._disabledStatus;
    },

    /**
     * refreshElements
     *
     * @param {Object} elements 需要获取的元素object
     * @return {Array} 返回获取后的jq wrap dom对象的map集合
     */
    refreshElements: function (elements) {
        var me = this;
        var ref = elements || me.elements;
        var results = [];
        var key;
        var value;

        for (key in ref) {
            if (ref.hasOwnProperty(key)) {
                value = ref[key];
                results.push(me.$elements[value] = $(key, this.$el));
            }
        }
        return results;
    },

    /**
     * getData 获取data
     *
     * @param {string} key 需要获取的键值
     * @return {Null}
     */
    getData: function (key) {
        var me = this;
        var prefix = me.prefix;
        var data = me.$el.data(prefix + '-options');

        if (data.hasOwnProperty(key)) {
            return data[key];
        }

        return null;
    },

    /**
     * setData 设置data
     *
     * @param {string} key 设置的键值
     * @param {*} val 设置的val
     * @return {Object} this
     */
    setData: function (key, val) {
        var me = this;
        var prefix = me.prefix;
        var data = me.$el.data(prefix + '-options') || {};

        data[key] = val;
        me.$el.data(prefix + '-options', data);

        return me;
    }

};

exports.widget = widget;

/**
 * register 插件注册器
 *
 * @param {Function} Class 类引用
 * @param {Function} constructorHook 构造函数hook
 * @param {Object} methods 注册到原型的对象
 */
var register = function (Class, constructorHook, methods) {
    var reg = Class.$$plugins || (Class.$$plugins = []);
    var method;
    reg[reg.length] = constructorHook;

    for (method in methods) {
        if (methods.haoOwnProperty(method)) {
            Class.prototype[method] = methods[method];
        }
    }
};

exports.register = register;
