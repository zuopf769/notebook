/**
 * form
 */
T.form = {};

var escapeSymbol = function(source) {
    return String(source).replace(/[#%&+=\/\\\ \u3000\f\r\n\t]/g, function(all) {
        return '%' + (0x100 + all.charCodeAt()).toString(16).substring(1).toUpperCase();
    });
};

T.form.serialize = function(form, replacer){
    var serialize = $(_g(form)).serializeArray();

    serialize = $.map(serialize, function(n, i){
        var item = [n.name,escapeSymbol(n.value)];

        if($.isFunction(replacer)) {
            item[1] = replacer(item[1], item[0]);
        }

        return item.join('=');
    });
    return serialize;
};

T.form.json = function(form, replacer){
    var serialize = $(_g(form)).serializeArray(),
        result = {};

    $.each(serialize, function(n, item){
        var name = item.name,
            value = escapeSymbol(item.value),
            oldValue;

        if(result.hasOwnProperty(name)) {
            if(!$.isArray(result[name])) {
                oldValue = result[name];
                result[name] = [];
                result[name].push(oldValue);
            }
            result[name].push(value);
        } else {
            result[name] = value;
        }

        if($.isFunction(replacer)) {
            result[name] = replacer(value, name);
        }

    });
    return result;
};