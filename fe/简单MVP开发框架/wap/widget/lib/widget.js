/**
 * @file widget.js
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var $ = require('../dep/zepto_extend.js');
var lang = require('./lang.js');
var util = require('./util.js');

var emptyFn = function () {};

var widget = function (proto, method) {

    method = $.extend(true, {
        prefix: 'widget',
        // 类型，做禁用的class前缀
        type: '',
        // 继承
        superClass: lang.Class

    }, method || {});

    var $super = method.superClass;
    var $superProto = $super.prototype;

    proto = $.extend(true, {
        el: $superProto.el || '',
        elements: $superProto.elements || {},
        events: $superProto.events || {},
        // 默认选项
        Options: $superProto.Options || {}

    }, proto || {});

    var fn = function (options) {
        var me = this;
        var args = arguments;

        options = options || {};

        me.$el = null;
        me.$elements = {};

        me.options = $.extend(true, {}, proto.Options, options);

        me.type = method.type;
        me.prefix = method.prefix;
        // 元素创建的标志位
        me._created = false;
        // 禁用的标志位
        me._disabledStatus = false;

        me._hammerEventStack = [];

        // 在onload后将_created与_disabledStatus重置
        me.on('onload', function () {
            me._created = true;
            me._disabledStatus = true;

            if (!me.$el || me.$el.length < 1) {
                me.$el = $(me.options.el);
            }

            me.$el.data(me.prefix, this);

            var meta = me.$el.data(me.prefix + '-options');

            me.options = $.extend(true, me.options, meta);

            me.refreshElements();
            // 绑定evetns上的对象
            me._bindEvents(me.events);
        });


        // 执行构造器
        lang.isFunction(me._init) && me._init.apply(me, args);

        fn.$$plugins && $.each(fn.$$plugins, function (i, item) {
            item.apply(me, args);
        });

        me.$el = $(me.options.el);

        if (lang.isFunction(me._render)) {
            me._render();
            me._initEvents();
        }

        me._onloadTimer = util.requestAnimationFrame(function () {
            me.fire('onload');
        }, 16);

    };

    // 继承$super
    lang.inherits(fn, $super);

    // 改写_init函数
    var _init = lang.isFunction(proto._init) ? proto._init : emptyFn;
    var _superClassInit = $super === lang.Class ? lang.Class : $superProto._init;

    // _init执行父类构造函数
    proto._init = function () {
        var args = arguments;
        var me = this;

        lang.isFunction(_superClassInit) && _superClassInit.apply(me, args);
        lang.isFunction(_init) && _init.apply(me, args);
    };

    // 挂载默认的扩展原型
    fn.extend($.extend(true, {}, widget._method, proto));

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

        $.each(events, function (key, val) {
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
     * @param {HTMLElement} element 元素
     * @param {Event} type 事件类型
     * @param {string} selector 代理使用的选择器
     * @param {Function} fun 绑定的函数
     * @return {Object} this
     */
    bindEvent: function (element, type, selector, fun) {
        var me = this;
        var args = arguments;

        // 区分唯一性，防止添加货去除window上namespace冲突的组件
        var namespace = me.type + '_' + me.guid;

        if (args.length === 3) {
            fun = selector;
            selector = null;
        }

        if (lang.isString(fun)) {
            fun = me[fun];
        }

        fun = $.proxy(fun, me);

        type = type.split(',');

        type = $.map(type, function (item, i) {
            return item + '.' + namespace;
        });

        type = type.join(' ');

        if (!selector) {
            $(element)
                .on(type, fun);
        }
        else {
            $(element)
                .on(type, selector, fun);
        }

        return this;
    },

    /**
     * unBindEvent 解绑绑定事件,添加了命名空间(type),好做回收使用
     *
     * @param {HTMLElement} element 元素
     * @param {Event} type 事件类型
     * @param {string} selector 代理使用的选择器
     * @param {Function} fun 绑定的函数
     */
    unBindEvent: function (element, type, selector, fun) {
        var me = this;
        var args = arguments;

        // 区分唯一性，防止添加货去除window上namespace冲突的组件
        var namespace = me.type + '_' + me.guid;

        if (args.length === 3) {
            fun = selector;
            selector = null;
        }

        if (lang.isString(fun)) {
            fun = me[fun];
        }

        if (fun) {
            fun = $.proxy(fun, me);
        }

        type = type.split(',');

        type = $.map(type, function (item, i) {
            return item + '.' + namespace;
        });

        type = type.join(' ');

        if (!selector) {
            $(element)
                .off(type, fun);
        }
        else {
            $(element)
                .off(type, selector, fun);
        }

    },

    /**
     * dispose 析构函数
     * 析构时派发ondispose事件并调用Tangram的lang.Class.dispose来做销毁
     * @return
     */

    dispose: function () {
        var me = this;
        var namespace = me.type + '_' + me.guid;

        // 清除hammer实例
        $.each(me._hammerEventStack, function (i, item) {
            try {
                item.destroy();
            }
            catch (e) {}
        });

        me.$el.off('.' + namespace);
        me.$el.find('*')
            .off('.' + namespace);
        me.$el.removeData(me.prefix + '-options');

        me.fire('ondispose') && lang.Class.prototype.dispose.call(me);
    },

    /**
     * _setStatus 设置状态
     *
     * @private
     * @param {boolen} key 是否禁用
     * @return {Object} this
     */
    _setStatus: function (key) {
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
        var attrMatch;

        for (key in ref) {
            if (ref.hasOwnProperty(key)) {
                value = ref[key];
                attrMatch = key.match(/^@([-_\w]+)/);

                if (attrMatch && attrMatch.length > 1) {
                    results.push(me.$elements[value] = me.getHookElement(attrMatch[1]));
                }
                else {
                    results.push(me.$elements[value] = $(key, this.$el));
                }
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
        var namespace = me.prefix + '_' + me.guid;
        var data = me.$el.data(namespace + '-options');

        if (data.hasOwnProperty(key)) {
            return data[key];
        }

        return null;
    },

    /**
     * setData 设置data
     *
     * @param {string} key 设置的键值
     * @param {any} val 设置的val
     * @return {Object} this
     */
    setData: function (key, val) {
        var me = this;
        var namespace = me.prefix + '_' + me.guid;
        var data = me.$el.data(namespace + '-options') || {};

        data[key] = val;
        me.$el.data(namespace + '-options', data);

        return me;
    },

    /**
     * getHookElement 按自定义元素js-hook获取元素
     *
     * @param {string} selector 选择器
     * @return {Object} jquery element
     */
    getHookElement: function (selector) {
        return $('[js-hook=' + selector + ']', this.$el);
    },


    /**
     * createHammer 创建hammer实例
     *
     * @param {HTMLElement} element dom对象
     * @param {Object} options 选项
     * @return {Object} Hammer对象
     */
    createHammer: function (element, options) {
        var mc = new Hammer(element, options);
        this._hammerEventStack.push(mc);
        return mc;
    },


    /**
     * getEl 返回$el 对象
     *
     * @return {Element}  返回el对象
     */
    getEl: function () {
        return this.$el;
    },

    /**
     * _render 渲染接口
     *
     * @private
     */
    _render: function () {},

    /**
     * _initEvents 初始化事件接口
     *
     * @private
     */
    _initEvents: function () {},

    fireOnload: function () {
        util.cancelAnimationFrame(this._onloadTimer);
        this.fire('onload');
    }

};

// 混入zIndex管理器
widget._method = $.extend({}, widget._method, util.zIndexManager);

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
        if (methods.hasOwnProperty(method)) {
            Class.prototype[method] = methods[method];
        }

    }
};

exports.register = register;
