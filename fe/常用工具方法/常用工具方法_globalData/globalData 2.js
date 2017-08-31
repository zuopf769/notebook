var __globalData__ = __globalData__ || {};

var globalData = {
    set: function(key, val) {
        if (typeof key !== 'string') {
            for (var i in key) {
                if (key.hasOwnProperty(i)) {
                    __globalData__[i] = key[i];
                }
            }
        }
        else {
            __globalData__[key] = val;
        }
    },

    get: function(key) {
        return __globalData__[key];
    }
}