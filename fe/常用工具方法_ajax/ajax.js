var noop = $.noop;

// ajax
T.ajax = {};

var wrapCallback = function(type, callback, errorCallback) {

    callback = $.isFunction(callback) ? callback : noop;

    return function(data, textStatus, jqXHR) {

        var globelHandler = T.ajax[type];

        switch (type) {

        case 'onsuccess':
            callback(jqXHR, jqXHR.responseText);
            break;

        case 'ontimeout':
            if (textStatus === 'timeout') {
                callback(data);
                $.isFunction(globelHandler) && globelHandler(data);
            } else {
                errorCallback(data);
            }
            break;

        default:
            callback(data);
            $.isFunction(globelHandler) && globelHandler(data);
        }
    };

};

var statusMatch = /^on(\d+)$/i; //解析http状态码
var request = T.ajax.request = function(url, opt_options) {

    var options = opt_options || {},
        data = options.data || "",
        async = !(options.async === false),
        username = options.username || "",
        password = options.password || "",
        type = (options.method || "GET").toUpperCase(),
        headers = options.headers || {},
        timeout = options.timeout || 0,
        cache = options.noCache === undefined ? true : !options.noCache,
        onerror = wrapCallback('onfailure', options.onfailure),
        onsuccess = wrapCallback('onsuccess', options.onsuccess),
        onbeforeSend = wrapCallback('onbeforerequest', options.onbeforerequest),
        onerror = wrapCallback('ontimeout', options.ontimeout, onerror),
        //兼容超时ontimeout处理
        statusCode = {};

    $.each(opt_options, function(key, val) {

        var result = statusMatch.exec(key);

        if (result) {
            statusCode[result[1]] = wrapCallback(result[1], val);
        }
    });

    return $.ajax(url, {
        async: async,
        cache: cache,
        data: data,
        error: onerror,
        success: onsuccess,
        username: username,
        password: password,
        type: type,
        headers: headers,
        beforeSend: onbeforeSend,
        statusCode: statusCode,
        timeout: timeout,
        dataType : 'text'
    });
};

T.ajax.get = function(url, onsuccess) {

    return request(url, {
        'onsuccess': onsuccess
    });
};

T.ajax.post = function(url, data, onsuccess) {

    return request(url, {
        'onsuccess': onsuccess,
        'method': 'POST',
        'data': data
    });
};

T.ajax.form = function(form, options) {

    options = options || {};

    var el = $(form),
        method = el.attr('method'),
        url = el.attr('action'),
        replacer = options.replacer ||
        function(value, name) {
            return value;
        },
        serializeArray = el.serializeArray(),
        serialize = [];

    serializeArray = $.map(serializeArray, function(item) {
        return {
            name: item.name,
            value: replacer(item.value, item.name)
        };
    });

    //serialize = $.param(serializeArray);
    $.each(serializeArray, function(i, item) { //tangram的没有进行encodeURIComponent
        serialize[i] = item.name + '=' + item.value;  
    });
    
    return request(url, $.extend(options, {
        method: method,
        data: serialize.join('&')
    }));
};