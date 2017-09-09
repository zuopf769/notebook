    /**
     * orientationchange-fix
     * orientationchange修复实用库
     */
    ;
    (function(win) {
        var meta = {},
            timer;

        var eventType = 'orientationchange';
        // 是否支持orientationchange事件
        var isOrientation = ('orientation' in window && 'onorientationchange' in window);
        meta.isOrientation = isOrientation;

        // font-family
        var html = document.documentElement,
            hstyle = win.getComputedStyle(html, null),
            ffstr = hstyle['font-family'];
        meta.font = ffstr;

        // automatically load css script
        function loadStyleString(css) {
            var _style = document.createElement('style'),
                _head = document.head ? document.head : document.getElementsByTagName('head')[0];
            _style.type = 'text/css';
            try {
                _style.appendChild(document.createTextNode(css));
            } catch (ex) {
                // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
                _style.styleSheet.cssText = css;
            }
            _head.appendChild(_style);
            return _style;
        }

        // 触发原生orientationchange
        var isSupportCustomEvent = window.CustomEvent ? true : false,
            fireEvent;
        
        // https://github.com/krambuhl/custom-event-polyfill/blob/master/custom-event-polyfill.js
        // Polyfill for creating CustomEvents on IE9/10/11
        if (isSupportCustomEvent) {
            try {
                var ce = new window.CustomEvent('test');
                ce.preventDefault();
                if (ce.defaultPrevented !== true) {
                    // IE has problems with .preventDefault() on custom events
                    // http://stackoverflow.com/questions/23349191
                    throw new Error('Could not prevent default');
                }
            } catch (e) {
                var CustomEvent = function(event, params) {
                    var evt, origPrevent;
                    params = params || {
                        bubbles: false,
                        cancelable: false,
                        detail: undefined
                    };

                    evt = document.createEvent("CustomEvent");
                    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
                    origPrevent = evt.preventDefault;
                    evt.preventDefault = function() {
                        origPrevent.call(this);
                        try {
                            Object.defineProperty(this, 'defaultPrevented', {
                                get: function() {
                                    return true;
                                }
                            });
                        } catch (e) {
                            this.defaultPrevented = true;
                        }
                    };
                    return evt;
                };

                CustomEvent.prototype = window.Event.prototype;
                window.CustomEvent = CustomEvent; // expose definition to window
            }
        }

        fireEvent = isSupportCustomEvent ? function(element, eventName, params) {
            var evt = document.createEvent('CustomEvent');
            if (params) {
                evt.initCustomEvent(eventName, params.bubbles, params.cancelable, params.detail);
            } else {
                evt.initCustomEvent(eventName, false, false, void(0));
            }
            if (element.dispatchEvent) {
                element.dispatchEvent(evt);
            }
            return evt;
        } : function(element, eventName, params) {
            var evt = document.createEventObject();
            evt.type = eventName;
            if (params) {
                evt.bubbles = Boolean(params.bubbles);
                evt.cancelable = Boolean(params.cancelable);
                evt.detail = params.detail;
            } else {
                evt.bubbles = false;
                evt.cancelable = false;
                evt.detail = void(0);
            }
            // fire
            if (element[eventName]) {
                element[eventName](evt);
            } else if (element['on' + eventName]) {
                element['on' + eventName](evt);
            } else if (element.fireEvent && ('on' + eventName) in element) { //针对IE8及以下版本，fireEvent|attachEvent|detachEvent只能使用如下事件名
                element.fireEvent('on' + eventName, evt);
            }
            return evt;
        };


        // callback
        var orientationCB = function(e) {
            if (win.orientation === 180 || win.orientation === 0) {
                meta.init = 'portrait';
                meta.current = 'portrait';
            }
            if (win.orientation === 90 || win.orientation === -90) {
                meta.init = 'landscape';
                meta.current = 'landscape';
            }
            return function() {
                if (win.orientation === 180 || win.orientation === 0) {
                    meta.current = 'portrait';
                }
                if (win.orientation === 90 || win.orientation === -90) {
                    meta.current = 'landscape';
                }
                fireEvent(window, eventType);
            }
        };
        var resizeCB = function() {
            var pstr = "portrait, " + ffstr,
                lstr = "landscape, " + ffstr,
                cssstr = '@media (orientation: portrait) { .orientation{font-family:' + pstr + ';} } @media (orientation: landscape) {  .orientation{font-family:' + lstr + ';}}';

            // 载入样式     
            loadStyleString(cssstr);
            // 添加类
            html.className = 'orientation ' + html.className;
            if (hstyle['font-family'] === pstr) { //初始化判断
                meta.init = 'portrait';
                meta.current = 'portrait';
            } else {
                meta.init = 'landscape';
                meta.current = 'landscape';
            }
            resizeCB = function() {
                if (hstyle['font-family'] === pstr) {
                    if (meta.current !== 'portrait') {
                        meta.current = 'portrait';
                        fireEvent(window, eventType);
                    }
                } else {
                    if (meta.current !== 'landscape') {
                        meta.current = 'landscape';
                        fireEvent(window, eventType);
                    }
                }
            }
        };
        var callback = isOrientation ? orientationCB() : (function() {
            resizeCB();
            return function() {
                timer && win.clearTimeout(timer);
                timer = win.setTimeout(resizeCB, 300);
            }
        })();

        // 监听
        win.addEventListener(isOrientation ? 'orientationchange' : 'resize', callback, false);

        win.neworientation = meta;
    })(window);
