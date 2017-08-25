/**
 * @file mediator.js
 * @desc 中介者
 */

var lang = require('./lang.js');
var $ = require('../dep/zepto_extend.js');

var isArguments = function (obj) {
    return !!obj.hasOwnProperty('callee');
};

var Mediator = {

    isPromise: function (obj) {
        if (lang.isObject(obj) && obj.hasOwnProperty('promise')
            && lang.isFunction(obj.promise)) {
            return true;
        }

        return false;
    },

    getDeferred: function (arg) {

        if (!isArguments(arg)) {
            throw new Error('getDeferred arguments error.');
        }

        if (arg.callee.hasOwnProperty('_dfd')
            && !lang.isObject(arg.callee._dfd)) {

            throw new Error('getDeferred arguments have not deferred');
        }

        return arg.callee._dfd;
    },

    when: function (name) {
        var me = this;
        var args = [].slice.call(arguments, 0);
        var promises = [];

        $.each(args, function (i, item) {
            promises.push(me.fire.call(me, item));
        });

        return $.when.apply($, promises);
    },

    fire: function (event, options) {
        lang.isString(event) && (event = new lang.Event(event));

        !this.__listeners && (this.__listeners = {});

        // 20100603 添加本方法的第二个参数，将 options extend到event中去传递
        options = options || {};
        for (var i in options) {
            if (options.hasOwnProperty(i)) {

                event[i] = options[i];
            }
        }

        var n;
        var me = this;
        var t = me.__listeners;
        var p = event.type;
        var dfd = new $.Deferred();
        var cb;
        var result;
        var promise;

        event.target = event.target || (event.currentTarget = me);

        // 支持非 on 开头的事件名
        p.indexOf('on') && (p = 'on' + p);

        typeof me[p] === 'function' && me[p].apply(me, arguments);

        if (typeof t[p] === 'object') {
            for (i = 0, n = t[p].length; i < n; i++) {
                cb = t[p][i];
                cb._dfd = dfd;
                result = cb.apply(me, arguments);

                if (this.isPromise(result)) {
                    promise = result;
                }

            }
        }

        return promise || event.returnValue;
    }

};

exports.mediator = lang.createSingle(Mediator);

