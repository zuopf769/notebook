var EventEmitter = (function () {
    function Emitter() {
        var e = Object.create(emitter);
        e.events = {};
        return e;
    }

    function Event(type) {
        this.type = type;
        this.timeStamp = new Date();
    }

    var emitter = {};

    emitter.on = function (type, handler) {
        if (this.events.hasOwnProperty(type)) {
            this.events[type].push(handler);
        } else {
            this.events[type] = [handler];
        }
        return this;
    };

    emitter.off = function (type, handler) {
        if (arguments.length === 0) {
            return this._offAll();
        }
        if (handler === undefined) {
            return this._offByType(type);
        }
        return this._offByHandler(type, handler);
    };

    emitter.trigger = function (event, args) {
        if (!(event instanceof Event)) {
            event = new Event(event);
        }
        return this._dispatch(event, args);
    };

    emitter._dispatch = function (event, args) {
        if (!this.events.hasOwnProperty(event.type)) return;
        args = args || [];
        args.unshift(event);

        var handlers = this.events[event.type] || [];
        handlers.forEach(function (handler) {
            return handler.apply(null, args);
        });
        return this;
    };

    emitter._offByHandler = function (type, handler) {
        if (!this.events.hasOwnProperty(type)) return;
        var i = this.events[type].indexOf(handler);
        if (i > -1) {
            this.events[type].splice(i, 1);
        }
        return this;
    };

    emitter._offByType = function (type) {
        if (this.events.hasOwnProperty(type)) {
            delete this.events[type];
        }
        return this;
    };

    emitter._offAll = function () {
        this.events = {};
        return this;
    };

    Emitter.Event = Event;

    Emitter.mixin = function (obj, arr) {
        var emitter = new Emitter();
        arr.map(function (name) {
            obj[name] = function () {
                return emitter[name].apply(emitter, arguments);
            };
        });
    };

    return Emitter;
})();

var wrapEvent = function (targetInstance) {
    EventEmitter.mixin(targetInstance, ['on', 'off', 'trigger']);
};
