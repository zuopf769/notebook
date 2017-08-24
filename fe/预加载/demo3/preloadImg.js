/**
 * @file preloadimg.js
 * 
 */


var isFunction = function (source) {
    return '[object Function]' === Object.prototype.toString.call(source);
};

/**
 * preloadImg
 *
 * @param  {Object} options 选项 {src:'', loading: function, onload: function, onerror: function}, src为必填
 * @return {element} 返回预加载后的img对象
 */
var preloadImg = function (options) {
    var img = new Image();

    var load = function (callback) {
        return function () {
            img.onload = img.onerror = img.onabout = null;
            callback(img, options);
        };
    };


    if (!options.src) {
        throw new Error('options.src is null');
    }

    isFunction(options.loading) && options.loading(options);
    isFunction(options.onload) && (img.onload = load(options.onload));
    isFunction(options.onerror) && (img.onerror = img.onabout = load(options.onerror));
    img.src = img.originalSrc = options.src;

    return img;

};

module.exports = preloadImg;
