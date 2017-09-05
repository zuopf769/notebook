var CrossDomain = (function (Messenger, Promise) {
    var isLocalStorageSupported = false;
    var isSessionStorageSupported = false;
    try {
        isLocalStorageSupported = !!window.localStorage;
        isSessionStorageSupported = !!window.sessionStorage;
    }
    catch (e) {
    }
    // 同域操作函数
    var staticOps = {
        getCookie: function () {
            return document.cookie;
        },
        setCookie: function (cookie) {
            document.cookie = cookie;
        },
        getSupported: function () {
            return {
                localStorage: isLocalStorageSupported,
                sessionStorage: isSessionStorageSupported
            };
        },
        getLocalStorage: function (key) {
            return isLocalStorageSupported && window.localStorage[key];
        },
        setLocalStorage: function (key, value) {
            isLocalStorageSupported && (window.localStorage[key] = value);
        },
        localStorageLength: function () {
            return isLocalStorageSupported && window.localStorage.length;
        },
        localStorageKey: function (index) {
            return isLocalStorageSupported && window.localStorage.key(index);
        },
        localStorageHas: function (key) {
            return isLocalStorageSupported && window.localStorage.hasOwnProperty(key);
        },
        getSessionStorage: function (key) {
            return isSessionStorageSupported && window.sessionStorage[key];
        },
        setSessionStorage: function (key, value) {
            isSessionStorageSupported && (window.sessionStorage[key] = value);
        },
        sessionStorageLength: function () {
            return isSessionStorageSupported && window.sessionStorage.length;
        },
        sessionStorageKey: function (index) {
            return isSessionStorageSupported && window.sessionStorage.key(index);
        },
        sessionStorageHas: function (key) {
            return isSessionStorageSupported && window.sessionStorage.hasOwnProperty(key);
        }
    };
    // cookie 操作封装
    var cookieObj = {
        get: function (key) {
            return this.request('getCookie')
            .then(function (cookie) {
                var result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(cookie);
                var ret = {
                    value: null,
                    options: null
                };
                if (result) {
                    ret.value = decodeURIComponent(result[1]);
                    ret.options = {
                        raw: result[1]
                    };
                }
                return ret;
            });
        },
        set: function (key, value, options) {
            options = options || {};
            if (value === null || value === undefined) {
                options.expires = -1;
            }
            var time = options.expires;
            if (typeof options.expires === 'number') {
                var milliseconds = options.expires;
                time = options.expires = new Date();
                time.setTime(time.getTime() + milliseconds);
            }
            value = String(value);
            var cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join('');
            return this.request('setCookie', cookie);
        }
    };
    // storage 操作封装
    var storageObj = {
        getItem: function (key) {
            return this.request('get' + this.Name, key);
        },
        setItem: function (key, str) {
            return this.request('set' + this.Name, key, str);
        },
        get: function (key) {
            return this.getItem(key)
            .then(function (value) {
                return JSON.parse(value);
            });
        },
        set: function (key, obj) {
            var str = JSON.stringify(obj);
            return this.setItem(key, str)
            .then(function () {
                return str;
            });
        },
        isSupported: function () {
            var storage = this;
            return this.request('getSupported')
            .then(function (sup) {
                return sup[storage.name];
            })
            .catch(function (err) {
                console.warn(err);
                return false;
            });
        },
        getKey: function (index) {
            return this.request(this.name + 'Key', index);
        },
        length: function () {
            return this.request(this.name + 'Length');
        },
        has: function () {
            return this.request(this.name + 'Has');
        }
    };
    // 跨域操作类
    var CrossDomain = function (domain, proxyUrl) {
        this.domain = domain;
        if (domain === document.domain) {
            this.isLocal = true;
        }
        else {
            this.isLocal = false;
            this.proxyUrl = proxyUrl;
            this.iframe = document.createElement('iframe');
            this.iframe.name = parseInt(Math.random() * 100000, 10).toString(34);
            this.iframe.src = proxyUrl;
            this.iframe.style.display = 'none';
            var cd = this;
            this.iframeLoadPromise = new Promise(function (success, error) {
                cd.iframe.addEventListener('load', success);
                cd.iframe.addEventListener('error', error);
                document.body.appendChild(cd.iframe);
            });
            this.messenger = new Messenger({
                targetWindow: this.iframe,
                name: this.iframe.name
            });
        }
        // 创建操作工具
        // cookies
        this.cookie = Object.create(cookieObj);
        this.cookie.request = this.request.bind(this);
        // localStorage
        this.localStorage = Object.create(storageObj);
        this.localStorage.request = this.request.bind(this);
        this.localStorage.name = 'localStorage';
        this.localStorage.Name = 'LocalStorage';
        // sessionStorage
        this.sessionStorage = Object.create(storageObj);
        this.sessionStorage.request = this.request.bind(this);
        this.sessionStorage.name = 'sessionStorage';
        this.sessionStorage.Name = 'SessionStorage';
    };
    CrossDomain.prototype.request = function (eventName, arg1, arg2) {
        var crossdomain = this;
        if (this.isLocal) {
            return new Promise(function (success, error) {
                try {
                    success(staticOps[eventName](arg1, arg2));
                }
                catch (err) {
                    error(err);
                }
            });
        }
        return this.iframeLoadPromise
        .then(function () {
            return crossdomain.messenger.sendMessage(
                eventName, {opArgs: [arg1, arg2]}, true
            ).then(function (eventData) {
                if (eventData.error) {
                    throw eventData.error;
                }
                return eventData.result;
            });
        });
    };
    return CrossDomain;
})(Messenger, Promise);