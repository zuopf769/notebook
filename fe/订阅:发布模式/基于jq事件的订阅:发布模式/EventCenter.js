/**
 * @file: 基于jq的事件订阅/发布
 */
var $ = require('../widget/ui/lib/jquery/jquery.js');


var EventCenter = function () {
    // this.listeners = {};
};

$.extend(EventCenter.prototype, {

    listeners: {},

    on: function (events, callback, context) {

        if (!events || !callback) {
            return false;
        }

        if (!this.listeners[events]) {
            this.listeners[events] = new $.Callbacks('unique');
        }

        if (!this.listeners[events].has(callback)) {
            this.listeners[events].add(callback);
            // this.listeners[events].callbackContext = context || window;
        }

        return this;
    },
    fire: function (events, options) {
        var opt = options || false;
        var dfd = new $.Deferred();
        var me = this;
        try {
            // var con = me.listeners[events].callbackContext;
            me.listeners[events].fire(opt);
            dfd.resolve();
        }
        catch (ex) {
            console.error(ex);
            dfd.reject();
            dfd.eorrEx = ex;
        }
        return dfd;
    },
    off: function (events, callback) {
        var ev = this.listeners[events];
        if (!callback) {
            ev.empty();
            return;
        }
        ev.remove(callback);
        return this;
    }
});

module.exports = EventCenter;
