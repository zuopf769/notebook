
/**
 * 字符串截断
 * @param  {String} str           要被截断的字符串
 * @param  {Number} length        截断长度
 * @param  {String} replaceString 截断后附加的字符串
 * @return {String}               阶段后的字符串
 */

var cut = function (str, length, replaceString) {
    if(!str || typeof str != 'string')return '';
    if(!length)return str;
    replaceString = replaceString || '...';
    return str.length > length ? str.slice(0, length) + replaceString : str;
};

module.exports.cut = cut;

/**
 * 对目标字符串进行html解码
 * @name string.decodeHTML
 * @function
 * @grammar tring.decodeHTML(source)
 * @param {string} source 目标字符串
 * @shortcut decodeHTML
 * @meta standard
 * @see baidu.string.encodeHTML
 *
 * @returns {string} html解码后的字符串
 */
var decodeHTML = function (source) {
    var str = String(source)
                .replace(/&quot;/g,'"')
                .replace(/&lt;/g,'<')
                .replace(/&gt;/g,'>')
                .replace(/&amp;/g, "&");
    //处理转义的中文和实体字符
    return str.replace(/&#([\d]+);/g, function(_0, _1){
        return String.fromCharCode(parseInt(_1, 10));
    });
};

module.exports.decodeHTML = decodeHTML;

/**
 * 对目标字符串进行html编码
 * @name baidu.string.encodeHTML
 * @function
 * @grammar baidu.string.encodeHTML(source)
 * @param {string} source 目标字符串
 * @remark
 * 编码字符有5个：&<>"'
 * @shortcut encodeHTML
 * @meta standard
 * @see baidu.string.decodeHTML
 *
 * @returns {string} html编码后的字符串
 */
var encodeHTML = function (source) {
    return String(source)
                .replace(/&/g,'&amp;')
                .replace(/</g,'&lt;')
                .replace(/>/g,'&gt;')
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;");
};

module.exports.encodeHTML = encodeHTML;

/**
 * 将目标字符串中可能会影响正则表达式构造的字符串进行转义。
 * @name string.escapeReg
 * @function
 * @grammar string.escapeReg(source)
 * @param {string} source 目标字符串
 * @remark
 * 给以下字符前加上“\”进行转义：.*+?^=!:${}()|[]/\
 * @meta standard
 *
 * @returns {string} 转义后的字符串
 */
var escapeReg = function (source) {
    return String(source)
            .replace(new RegExp("([.*+?^=!:\x24{}()|[\\]\/\\\\])", "g"), '\\\x241');
};

module.exports.escapeReg = escapeReg;

/**
 * 对目标字符串进行格式化,支持过滤
 * @name string.filterFormat
 * @function
 * @grammar string.filterFormat(source, opts)
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象
 * @version 1.2
 * @remark
 *
在 string.format的基础上,增加了过滤功能. 目标字符串中的#{url|escapeUrl},<br/>
会替换成string.filterFormat["escapeUrl"](opts.url);<br/>
过滤函数需要之前挂载在string.filterFormat属性中.

 * @see string.format,string.filterFormat.escapeJs,string.filterFormat.escapeString,string.filterFormat.toInt
 * @returns {string} 格式化后的字符串
 */
var filterFormat = function (source, opts) {
    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
    if(data.length){
        data = data.length == 1 ?
            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var filters, replacer, i, len, func;
            if(!data) return '';
            filters = key.split("|");
            replacer = data[filters[0]];
            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(filters[0]/*key*/);
            }
            for(i=1,len = filters.length; i< len; ++i){
                func = baidu.string.filterFormat[filters[i]];
                if('[object Function]' == toString.call(func)){
                    replacer = func(replacer);
                }
            }
            return ( ('undefined' == typeof replacer || replacer === null)? '' : replacer);
        });
    }
    return source;
};

module.exports.filterFormat = filterFormat;

/**
 * 对js片段的字符做安全转义,编码低于255的都将转换成\x加16进制数
 * @name string.filterFormat.escapeJs
 * @function
 * @grammar string.filterFormat.escapeJs(source)
 * @param {String} source 待转义字符串
 *
 * @see string.filterFormat,string.filterFormat.escapeString,string.filterFormat.toInt
 * @version 1.2
 * @return {String} 转义之后的字符串
 */
filterFormat.escapeJs = function(str){
    if(!str || 'string' != typeof str) return str;
    var i,len,charCode,ret = [];
    for(i=0, len=str.length; i < len; ++i){
        charCode = str.charCodeAt(i);
        if(charCode > 255){
            ret.push(str.charAt(i));
        } else{
            ret.push('\\x' + charCode.toString(16));
        }
    }
    return ret.join('');
};

filterFormat.js = filterFormat.escapeJs;
/**
 * 对字符串做安全转义,转义字符包括: 单引号,双引号,左右小括号,斜杠,反斜杠,上引号.
 * @name string.filterFormat.escapeString
 * @function
 * @grammar string.filterFormat.escapeString(source)
 * @param {String} source 待转义字符串
 *
 * @see string.filterFormat,string.filterFormat.escapeJs,string.filterFormat.toInt
 * @version 1.2
 * @return {String} 转义之后的字符串
 */
filterFormat.escapeString = function(str){
    if(!str || 'string' != typeof str) return str;
    return str.replace(/["'<>\\\/`]/g, function($0){
       return '&#'+ $0.charCodeAt(0) +';';
    });
};

filterFormat.e = filterFormat.escapeString;
/**
 * 对数字做安全转义,确保是十进制数字;否则返回0.
 * @name string.filterFormat.toInt
 * @function
 * @grammar string.filterFormat.toInt(source)
 * @param {String} source 待转义字符串
 *
 * @see string.filterFormat,string.filterFormat.escapeJs,string.filterFormat.escapeString
 * @version 1.2
 * @return {Number} 转义之后的数字
 */
filterFormat.toInt = function(str){
    return parseInt(str, 10) || 0;
};
filterFormat.i = filterFormat.toInt;
/**
 * 对目标字符串进行格式化
 * @name string.format
 * @function
 * @grammar string.format(source, opts)
 * @param {string} source 目标字符串
 * @param {Object|string...} opts 提供相应数据的对象或多个字符串
 * @remark
 *
opts参数为“Object”时，替换目标字符串中的#{property name}部分。<br>
opts为“string...”时，替换目标字符串中的#{0}、#{1}...部分。

 * @shortcut format
 * @meta standard
 *
 * @returns {string} 格式化后的字符串
 */
var format = function (source, opts) {
    source = String(source);
    var data = Array.prototype.slice.call(arguments,1), toString = Object.prototype.toString;
    if(data.length){
        data = data.length == 1 ?
            /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data)
            : data;
        return source.replace(/#\{(.+?)\}/g, function (match, key){
            var replacer = data[key];
            // chrome 下 typeof /a/ == 'function'
            if('[object Function]' == toString.call(replacer)){
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return source;
};

module.exports.format = format;


/**
 * 将各种浏览器里的颜色值转换成 #RRGGBB 的格式
 * @name string.formatColor
 * @function
 * @grammar string.formatColor(color)
 * @param {string} color 颜色值字符串
 * @version 1.3
 *
 * @returns {string} #RRGGBB格式的字符串或空
 */
(function(){
    // 将正则表达式预创建，可提高效率
    var reg1 = /^\#[\da-f]{6}$/i,
        reg2 = /^rgb\((\d+), (\d+), (\d+)\)$/,
        keyword = {
            black: '#000000',
            silver: '#c0c0c0',
            gray: '#808080',
            white: '#ffffff',
            maroon: '#800000',
            red: '#ff0000',
            purple: '#800080',
            fuchsia: '#ff00ff',
            green: '#008000',
            lime: '#00ff00',
            olive: '#808000',
            yellow: '#ffff0',
            navy: '#000080',
            blue: '#0000ff',
            teal: '#008080',
            aqua: '#00ffff'
        };

    var formatColor = function(color) {
        if(reg1.test(color)) {
            // #RRGGBB 直接返回
            return color;
        } else if(reg2.test(color)) {
            // 非IE中的 rgb(0, 0, 0)
            for (var s, i=1, color="#"; i<4; i++) {
                s = parseInt(RegExp["\x24"+ i]).toString(16);
                color += ("00"+ s).substr(s.length);
            }
            return color;
        } else if(/^\#[\da-f]{3}$/.test(color)) {
            // 简写的颜色值: #F00
            var s1 = color.charAt(1),
                s2 = color.charAt(2),
                s3 = color.charAt(3);
            return "#"+ s1 + s1 + s2 + s2 + s3 + s3;
        }else if(keyword[color])
            return keyword[color];

        return "";
    };

    module.exports.formatColor = formatColor;

})();


/**
 * 获取目标字符串在gbk编码下的字节长度
 * @name string.getByteLength
 * @function
 * @grammar string.getByteLength(source)
 * @param {string} source 目标字符串
 * @remark
 * 获取字符在gbk编码下的字节长度, 实现原理是认为大于127的就一定是双字节。如果字符超出gbk编码范围, 则这个计算不准确
 * @meta standard
 * @see baidu.string.subByte
 *
 * @returns {number} 字节长度
 */
var getByteLength = function (source) {
    return String(source).replace(/[^\x00-\xff]/g, "ci").length;
};

module.exports.getByteLength = getByteLength;

/**
 * 去掉字符串中的html标签
 * @function
 * @grammar string.stripTags(source)
 * @param {string} source 要处理的字符串.
 * @return {String}
 */
var stripTags = function(source) {
    return String(source || '').replace(/<[^>]+>/g, '');
};

module.exports.stripTags = stripTags;

/**
 * 对目标字符串按gbk编码截取字节长度
 * @name string.subByte
 * @function
 * @grammar string.subByte(source, length)
 * @param {string} source 目标字符串
 * @param {number} length 需要截取的字节长度
 * @param {string} [tail] 追加字符串,可选.
 * @remark
 * 截取过程中，遇到半个汉字时，向下取整。
 * @see string.getByteLength
 *
 * @returns {string} 字符串截取结果
 */
var subByte = function (source, length, tail) {
    source = String(source);
    tail = tail || '';
    if (length < 0 || getByteLength(source) <= length) {
        return source + tail;
    }

    //thanks 加宽提供优化方法
    source = source.substr(0,length).replace(/([^\x00-\xff])/g,"\x241 ")//双字节字符替换成两个
        .substr(0,length)//截取长度
        .replace(/[^\x00-\xff]$/,"")//去掉临界双字节字符
        .replace(/([^\x00-\xff]) /g,"\x241");//还原
    return source + tail;

};

module.exports.subByte = subByte;

/**
 * 将目标字符串进行驼峰化处理
 * @name string.toCamelCase
 * @function
 * @grammar string.toCamelCase(source)
 * @param {string} source 目标字符串
 * @remark
 * 支持单词以“-_”分隔
 * @meta standard
 *
 * @returns {string} 驼峰化处理后的字符串
 */

 //todo:考虑以后去掉下划线支持？
var toCamelCase = function (source) {
    //提前判断，提高getStyle等的效率 thanks xianwei
    if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
        return source;
    }
    return source.replace(/[-_][^-_]/g, function (match) {
        return match.charAt(1).toUpperCase();
    });
};

module.exports.toCamelCase = toCamelCase;

/**
 * 将目标字符串中常见全角字符转换成半角字符
 * @name string.toHalfWidth
 * @function
 * @grammar string.toHalfWidth(source)
 * @param {string} source 目标字符串
 * @remark
 *
将全角的字符转成半角, 将“&amp;#xFF01;”至“&amp;#xFF5E;”范围的全角转成“&amp;#33;”至“&amp;#126;”, 还包括全角空格包括常见的全角数字/空格/字母, 用于需要同时支持全半角的转换, 具体转换列表如下("空格"未列出)：<br><br>

！ => !<br>
＂ => "<br>
＃ => #<br>
＄ => $<br>
％ => %<br>
＆ => &<br>
＇ => '<br>
（ => (<br>
） => )<br>
＊ => *<br>
＋ => +<br>
， => ,<br>
－ => -<br>
． => .<br>
／ => /<br>
０ => 0<br>
１ => 1<br>
２ => 2<br>
３ => 3<br>
４ => 4<br>
５ => 5<br>
６ => 6<br>
７ => 7<br>
８ => 8<br>
９ => 9<br>
： => :<br>
； => ;<br>
＜ => <<br>
＝ => =<br>
＞ => ><br>
？ => ?<br>
＠ => @<br>
Ａ => A<br>
Ｂ => B<br>
Ｃ => C<br>
Ｄ => D<br>
Ｅ => E<br>
Ｆ => F<br>
Ｇ => G<br>
Ｈ => H<br>
Ｉ => I<br>
Ｊ => J<br>
Ｋ => K<br>
Ｌ => L<br>
Ｍ => M<br>
Ｎ => N<br>
Ｏ => O<br>
Ｐ => P<br>
Ｑ => Q<br>
Ｒ => R<br>
Ｓ => S<br>
Ｔ => T<br>
Ｕ => U<br>
Ｖ => V<br>
Ｗ => W<br>
Ｘ => X<br>
Ｙ => Y<br>
Ｚ => Z<br>
［ => [<br>
＼ => \<br>
］ => ]<br>
＾ => ^<br>
＿ => _<br>
｀ => `<br>
ａ => a<br>
ｂ => b<br>
ｃ => c<br>
ｄ => d<br>
ｅ => e<br>
ｆ => f<br>
ｇ => g<br>
ｈ => h<br>
ｉ => i<br>
ｊ => j<br>
ｋ => k<br>
ｌ => l<br>
ｍ => m<br>
ｎ => n<br>
ｏ => o<br>
ｐ => p<br>
ｑ => q<br>
ｒ => r<br>
ｓ => s<br>
ｔ => t<br>
ｕ => u<br>
ｖ => v<br>
ｗ => w<br>
ｘ => x<br>
ｙ => y<br>
ｚ => z<br>
｛ => {<br>
｜ => |<br>
｝ => }<br>
～ => ~<br>

 *
 * @returns {string} 转换后的字符串
 */

var toHalfWidth = function (source) {
    return String(source).replace(/[\uFF01-\uFF5E]/g,
        function(c){
            return String.fromCharCode(c.charCodeAt(0) - 65248);
        }).replace(/\u3000/g," ");
};

module.exports.toHalfWidth = toHalfWidth;

/**
 * 删除目标字符串两端的空白字符
 * @name string.trim
 * @function
 * @grammar string.trim(source)
 * @param {string} source 目标字符串
 * @remark
 * 不支持删除单侧空白字符
 * @shortcut trim
 * @meta standard
 *
 * @returns {string} 删除两端空白字符后的字符串
 */

var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");

var trim = function (source) {
    return String(source)
            .replace(trimer, "");
};

module.exports.trim = trim;

/**
 * 为目标字符串添加wbr软换行
 * @name string.wbr
 * @function
 * @grammar string.wbr(source)
 * @param {string} source 目标字符串
 * @remark
 *
1.支持html标签、属性以及字符实体。<br>
2.任意字符中间都会插入wbr标签，对于过长的文本，会造成dom节点元素增多，占用浏览器资源。
3.在opera下，浏览器默认css不会为wbr加上样式，导致没有换行效果，可以在css中加上 wbr:after { content: "\00200B" } 解决此问题

 *
 * @returns {string} 添加软换行后的字符串
 */
var wbr = function (source) {
    return String(source)
        .replace(/(?:<[^>]+>)|(?:&#?[0-9a-z]{2,6};)|(.{1})/gi, '$&<wbr>')
        .replace(/><wbr>/g, '>');
};

module.exports.wbr = wbr

