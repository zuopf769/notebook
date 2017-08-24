/**
 * query转换为json对象
 *
 * @method docType2Str
 * @param {string} search 符合url search格式的字符串
 * @return {Object} JSON对象
 */
query2JSON = function (search) {
    var query = search.substr(search.lastIndexOf('?') + 1);
    var params = query.split('&');
    var len = params.length;
    var result = {};
    var i = 0;
    var key;
    var value;
    var item;
    var param;

    for (; i < len; i++) {
        if (!params[i]) {
            continue;
        }

        param = params[i].split('=');
        key = param[0];
        value = param[1];

        item = result[key];
        if ('undefined' === typeof item) {
            result[key] = value;
        }
        else if ($.isArray(item)) {
            item.push(value);
        }
        else {
            result[key] = [item, value];
        }
    }
    return result;
};

// 更新query
function updateUrlQuery(name, value, url) {
    var queryObject = query2JSON(url);
    var origin = url.split('?')[0];
    var hash = url.split('#')[1];

    queryObject[name] = value;

    var searchArray = [];
    for (var key in queryObject) {
        searchArray.push(key + '=' + queryObject[key]);
    }
    var search = '?' + searchArray.join('&');

    var location = origin + search;
    if (hash) {
        location + '#' + hash;
    }

    return location;
}

// 删除query
function deleteUrlQuery(name, url) {
    var queryObject = query2JSON(url);
    var origin = url.split('?')[0];
    var hash = url.split('#')[1];

    delete queryObject[name];

    var searchArray = [];
    for (var key in queryObject) {
        searchArray.push(key + '=' + queryObject[key]);
    }
    var search = '?' + searchArray.join('&');

    var location = origin + search;
    if (hash) {
        location + '#' + hash;
    }

    return location;
}

// 获取query
function getQueryValue(url, key) {
    var reg = new RegExp(
                        '(^|&|\\?|#)'
                        + String(key).replace(new RegExp('([.*+?^=!:\x24{}()|[\\]\/\\\\])', 'g'), '\\\x241')
                        + '=([^&#]*)(&|\x24|#)',
                    '');
    var match = url.match(reg);
    if (match) {
        return match[2];
    }

    return null;
}