var Messenger = (function (wrapEvent, Promise) {
    var extend = (function () {
        var hasProp = {}.hasOwnProperty;
        return function (child, parent) {
            for (var key in parent) {
                if (hasProp.call(parent, key)) {
                    child[key] = parent[key];
                }
            }
        };
    })();
    var messageTypes = {
        twoWay: 'two-way'
    };
    var messageSentinels = {
        request: 'PM_REQUEST',
        response: 'PM_RESPONSE'
    };
    function getSessionId() {
        return ((new Date()).getTime() * 1000 + Math.ceil(Math.random() * 1000)).toString(36);
    }
    var messengerInstances = {};

    /**
     * iframe - window 单双向通信组件
     *
     * @constructor
     * @exports iframe-shell/messenger
     * @param {Object} config 实例参数
     * @param {Window} config.targetWindow  通信对端窗口（iframe; parent; top）
     * @param {string} config.targetOrigin  通信对端允许接收的 Origin
     * @param {string} config.sourceOrigins 允许的通信来源 Origin 列表
     * @param {number} config.timeout       双向通信回复超时(ms)
     * @param {string} config.name          若对端为 iframe，则填写 iframe.name；若对端为 parent，则填写 window.name(即父窗口的 iframe.name)
     */
    var Messenger = function (config) {
        wrapEvent(this);
        this.targetWindow = config.targetWindow || top;
        this.targetOrigin = config.targetOrigin || '*';
        this.sourceOrigins = config.sourceOrigins || ['*'];
        this.timeout = config.timeout || 500;
        this.name = config.name || window.name;

        /**
         * 存放回调处理函数 sessionId -> Object
         *
         * @private
         * @type    {Object}
         * @example {resolve: function, reject: function, timer: timerId}
         */
        this.defers = {};

        /**
         * 存放双向通信处理函数 eventName -> function
         *
         * @private
         * @type {Object}
         */
        this.handlers = {};

        if (messengerInstances[this.name]) {
            console.warn(
                'The old messenger created for target %O will be replaced by the new one.',
                this.name
            );
        }
        messengerInstances[this.name] = this;
        Messenger.bindHandler();
        return this;
    };
    var messageReciver = function (event) {
        // 寻找对应的 messenger 实例
        var messenger = messengerInstances[event.data.name];
        if (!messenger) {
            // console.warn('A window with no messengers is sending message', event);
            // 兼容老 mip，没有给名字
            for (var x in messengerInstances) {
                messengerInstances[x].processMessageEvent(event);
            }
        }
        else {
            messenger.processMessageEvent(event);
        }
    };
    Messenger.bindHandler = function () {
        window.removeEventListener('message', messageReciver);
        window.addEventListener('message', messageReciver);
    };
    Messenger.prototype = {

        /**
         * 处理消息事件
         *
         * @protected
         * @param  {MessageEvent} event 收到的 message event
         */
        processMessageEvent: function (event) {
            var origin = event.origin || event.originalEvent.origin;
            var messenger = this;
            // 检查 origin 是否安全
            var isSafe = false;
            for (var i = 0; i < messenger.sourceOrigins.length; i++) {
                var safeOrigin = messenger.sourceOrigins[i];
                if (safeOrigin === '*') {
                    isSafe = true;
                    break;
                }
                if (safeOrigin === origin) {
                    isSafe = true;
                    break;
                }
            }
            if (!isSafe) {
                console.warn('Origin ' + origin + ' is not safe, ignore event', event);
                return;
            }
            // 检查单双向
            var eventData = event.data;
            if (!eventData) {
                console.warn('Event data %O is invalid, missing data.', event);
                return;
            }
            // console.log(eventData);
            if (eventData.type === messageTypes.twoWay) {
                if (!eventData.sentinel || !eventData.sessionId) {
                    console.warn('Event data %O is invalid, missing sentinel or/and sessionId.', eventData);
                    return;
                }
                // 检查请求 or 回复
                if (eventData.sentinel === messageSentinels.request) {
                    // 检查是否有对应的 handler
                    var response = {};
                    if (messenger.handlers[eventData.event]) {
                        try {
                            response = messenger.handlers[eventData.event].call(messenger, eventData);
                        }
                        catch (err) {
                            response = {
                                error: err
                            };
                        }
                    }
                    else {
                        console.warn('Event ' + eventData.event + ' has no handler.');
                    }
                    var send = function (response) {
                        response = response || {};
                        extend(response, {
                            type: messageTypes.twoWay,
                            sentinel: messageSentinels.response,
                            sessionId: eventData.sessionId,
                            name: messenger.name
                        });
                        messenger.getWindow().postMessage(response, messenger.targetOrigin);
                    };
                    // 检查 promise
                    if (response && (typeof response.then) === 'function') {
                        response.then(function (response) {
                            send(response);
                        })
                        .catch(function (err) {
                            send({
                                error: err
                            });
                        });
                    }
                    else {
                        send(response);
                    }
                }
                else if (eventData.sentinel === messageSentinels.response) {
                    // 回复
                    // console.log('response!', eventData);
                    var d = messenger.defers[eventData.sessionId];
                    delete messenger.defers[eventData.sessionId];
                    if (!d) {
                        console.warn('Event session is not found for two-way communication', eventData.sessionId);
                        return;
                    }
                    clearTimeout(d.timer);
                    if (eventData.error) {
                        d.reject(eventData.error);
                    }
                    else {
                        d.resolve(eventData);
                    }
                }
                else {
                    console.warn('Event sentinel is invalid ', eventData.sentinel);
                }
            }
            else {
                // 单向
                if (!eventData || !eventData.event) {
                    console.warn('Event data %O is invalid, missing event name.', eventData);
                    return;
                }
                messenger.trigger(eventData.event, [eventData]);
                messenger.trigger('recivemessage', [eventData]);
            }
        },

        /**
         * 给绑定的窗口发送消息
         *
         * @public
         * @param  {string}  eventName    消息名
         * @param  {Object}  data         消息数据；必须为 object
         * @param  {boolean} waitResponse 是否为双向消息（等待回复）
         * @return {Promise}              若为双向消息，则返回后 resolve；否则直接 resolve
         */
        sendMessage: function (eventName, data, waitResponse) {
            var messenger = this;
            return new Promise(function (resolve, reject) {
                var requestData = {
                    name: messenger.name,
                    event: eventName
                };
                var sessionId = getSessionId();
                if (waitResponse) {
                    extend(requestData, {
                        type: messageTypes.twoWay,
                        sentinel: messageSentinels.request,
                        sessionId: sessionId
                    });
                    messenger.defers[sessionId] = {
                        resolve: resolve.bind(this),
                        reject: reject.bind(this),
                        timer: setTimeout(function () {
                            delete messenger.defers[sessionId];
                            reject(new Error('timeout'));
                        }, messenger.timeout)
                    };
                }
                else {
                    setTimeout(resolve, 0);
                }
                extend(requestData, data);
                // 对于单向通信：requestData = {event, ...}
                // 对于双向通信：requestData = {event, type, sentinel, sessionId, ...}
                messenger.getWindow().postMessage(requestData, messenger.targetOrigin);
            });
        },

        /**
         * 设置双向消息处理函数
         *
         * @public
         * @param {string}   eventName 消息名字
         * @param {Function} fn        处理函数（return object or promise which solves with object）
         */
        setHandler: function (eventName, fn) {
            if ((typeof fn) !== 'function') {
                throw new Error('Invalid handler for event ' + eventName);
            }
            this.handlers[eventName] = fn;
        },

        /**
         * 移除双向消息处理函数
         *
         * @public
         * @param  {string}   eventName 消息名字
         */
        removeHandler: function (eventName) {
            this.handlers[eventName] = undefined;
        },

        /**
         * 销毁消息处理器
         *
         * @public
         */
        destory: function () {
            delete messengerInstances[this.name];
        },

        getWindow: function () {
            if (this.targetWindow instanceof HTMLIFrameElement) {
                return this.targetWindow.contentWindow;
            }
            return this.targetWindow;
        }
    };
    Messenger.prototype.constructor = Messenger;
    return Messenger;
})(wrapEvent, Promise);
