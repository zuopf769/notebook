/*global require:false module.exports:false*/

/**
 * @file preload.js
 * @description 预加载
 */

var T = require("widget/lib/tangram/base/base.js");

/**
 * preload 预加载
 * @desc http://www.phpied.com/preload-then-execute/
 * @param  {String|Array}   files    需要加载的文件可以是js\css\img
 * @param  {Function} callback 加载后的回调执行函数
 * @return {Undefined}
 */
 
var isGecko = document.documentElement.style.MozAppearance !== undefined;

var preload = function(files, callback){

    var body = document.body;

    if (T.lang.isString(files)) {
        files = [files];
    }

    T.array.each(files, function(item) {
        var o;
        if (!isGecko) {
            o = new Image();
        }else{
            o = document.createElement('object');
            o.style.position = "absolute";
            o.data = item;
        }
        
        o.width = o.height = 0;
        
        o.onerror = o.onload = function () {
            callback(item);
            if (isGecko) {
                T.dom.remove(o);
            }
            o.onerror = o.onload = o = null;
            
        };

        if (!isGecko) {
            o.src = item;
        }else{
            T.dom.ready(function(){ //domready 后在插入到节点
                body.appendChild(o);
            });
        }
    });
};

module.exports.preload = preload;

/**
 * note: chrome、safari下用object会解析里面的内容，会卡死。只有firefox用object 
 */