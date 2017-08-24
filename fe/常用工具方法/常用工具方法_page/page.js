/**
 * 需要引入jquery
 */

var $ = require('widget/ui/lib/jquery/jquery.js');

/**
 * 获取页面高度
 * @name page.getHeight
 * @function
 * @grammar page.getHeight()
 * @see page.getWidth
 *
 * @returns {number} 页面高度
 */
var getHeight = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollHeight, body.scrollHeight, client.clientHeight);
};

module.exports.getHeight = getHeight;
/**
 * 获取纵向滚动量
 * @name page.getScrollTop
 * @function
 * @grammar page.getScrollTop()
 * @see page.getScrollLeft
 * @meta standard
 * @returns {number} 纵向滚动量
 */
var getScrollTop = function () {
    var d = document;
    return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
};

module.exports.getScrollTop = getScrollTop;

/**
 * 获取横向滚动量
 * @name page.getScrollLeft
 * @function
 * @grammar page.getScrollLeft()
 * @see page.getScrollTop
 *
 * @returns {number} 横向滚动量
 */
/**
 * 获取横向滚动量
 *
 * @return {number} 横向滚动量
 */
var getScrollLeft = function () {
    var d = document;
    return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
};

module.exports.getScrollLeft = getScrollLeft;

/**
 * 取得当前页面里的目前鼠标所在的坐标（x y）
 *
 * @return  {JSON}  当前鼠标的坐标值({x, y})
 */

var getMousePosition = function(){
    return {
        x : baidu.page.getScrollLeft() + xy.x,
        y : baidu.page.getScrollTop() + xy.y
    };
};

var xy = {x:0, y:0};
// 监听当前网页的 mousemove 事件以获得鼠标的实时坐标
$(document).bind('mousemove', function(e){
    xy.x = e.clientX;
    xy.y = e.clientY;
});

module.exports.getMousePosition = getMousePosition;



/**
 * 获取页面视觉区域高度
 * @name page.getViewHeight
 * @function
 * @grammar baidu.page.getViewHeight()
 * @see page.getViewWidth
 * @meta standard
 * @returns {number} 页面视觉区域高度
 */
var getViewHeight = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientHeight;
};

module.exports.getViewHeight = getViewHeight;

/**
 * 获取页面视觉区域宽度
 * @name age.getViewWidth
 * @function
 * @grammar baidu.page.getViewWidth()
 * @see page.getViewHeight
 *
 * @returns {number} 页面视觉区域宽度
 */
var getViewWidth = function () {
    var doc = document,
        client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;

    return client.clientWidth;
};

module.exports.getViewWidth = getViewWidth;

/**
 * 获取页面宽度
 * @name page.getWidth
 * @function
 * @grammar page.getWidth()
 * @see page.getHeight
 * @meta standard
 * @returns {number} 页面宽度
 */
var getWidth = function () {
    var doc = document,
        body = doc.body,
        html = doc.documentElement,
        client = doc.compatMode == 'BackCompat' ? body : doc.documentElement;

    return Math.max(html.scrollWidth, body.scrollWidth, client.clientWidth);
};

module.exports.getWidth = getWidth;



/**
 * 动态在页面上加载一个外部css文件
 * @name page.loadCssFile
 * @function
 * @grammar page.loadCssFile(path)
 * @param {string} path css文件路径
 * @see page.loadJsFile
 */

var loadCssFile = function (path) {
    var element = document.createElement("link");

    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", path);

    document.getElementsByTagName("head")[0].appendChild(element);
};

module.exports.loadCssFile = loadCssFile;

/**
 * 动态在页面上加载一个外部js文件
 * @name page.loadJsFile
 * @function
 * @grammar baidu.page.loadJsFile(path)
 * @param {string} path js文件路径
 * @see page.loadCssFile
 */
var loadJsFile = function (path) {
    var element = document.createElement('script');

    element.setAttribute('type', 'text/javascript');
    element.setAttribute('src', path);
    element.setAttribute('defer', 'defer');

    document.getElementsByTagName("head")[0].appendChild(element);
};

module.exports.loadJsFile = loadJsFile;

