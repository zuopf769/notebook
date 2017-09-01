### widget ui组件基类


### 用法示意

```
var W = require('wkview:widget/ui/html_view/widget.js');
var page = require('wkcommon:widget/ui/lib/page/page.js');
var widget = W.widget;

var defaulOpt = {
    kgPadding: 24,
    kgTreeWrapWidth: 350,
    kgTreeWrapMr: 30
};

var View = widget({
    Options: {

    },
    elements: {
        '.kgrec-container': '$kgrecContainer',
        '.kgdocs-wrap': '$kgdocsWrap',
        '.text-node-temp .text-node': '$tempTextNode',
        '.kgtree-content': '$kgtreeContent'
    },
    _init: function () {
        this.Mediator = this.options.Mediator;
        this.tpl = doT.template(__inline('./view-tpl.tpl'));

    },
    _initEvents: function () {
        var me = this;

        me.on('onload', function () {
          
            
        });

        me.on('onload', function () {
            var hasDot = false;
            function scrollHandler() {
                var elOffsetTop = me.$el.offset().top;
                var elHeight = me.$el.height();
                var wHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                if (scrollTop + wHeight >= elOffsetTop + elHeight) {
                    if (!hasDot) {
                        me.fire('moduleShow');
                    }
                    hasDot = true;
                }
            }
            // 知识图谱推荐模块展现PV/UV(模块底部露出页面视为被展现)
            $(window).on('scroll.kgrecommend', scrollHandler);
            // 先执行一遍
            scrollHandler();
        });

        me.on('ondispose', function () {

        });

        // 初始化第一个知识点的信息
        me.Mediator.on('v:initFirstKGInfo', function (opt) {
            

        });

        // 刷新当前知识点的知识卡和右侧相关推荐列表
        me.Mediator.on('v:refreshKGTreeDoclist', function (opt) {
            me._refreshKGTreeDoclist(opt);
        });

        // 刷新当前知识点的右侧相关推荐列表
        me.Mediator.on('v:refreshWholeDoclist', function (opt) {
            me._refreshWholeDoclist(opt);

        });
    },
    _render: function () {
        var me = this;
        this.$el.html(me.tpl());
    },
    // 创建tab页签
    _createTabItems: function () {
        var me = this;
        this.tabItemComp = new Tab({
            el: '.tab-items-wrap',
            Mediator: me.Mediator,
            data: me.tabItems
        });
    }
});

W.register(View, Statistic, Statistic.prototype);

exports.View = View;
```

### 参数说明

+ el
> 组件的容器
> 会挂载到this.$el上，子元素dom都是通过this.$el find到

+ Options: 
> 默认配置参数
> 会merge到this.options上
> `me.options = mix(proto.Options, options, true);`
> 使用时：this.options.Mediator

+ elements
> 用于统一管理dom节点的选择，并且统一挂载到me.$elements上
> `refreshElements()`方法：返回获取后的jq wrap dom对象的map集合


+  events
> `_bindEvents`方法 把events对象上注册的事件绑定

### 方法说明

#### 生命周期方法

+ _init方法： 默认属性的初始化
+ _initEvents方法： 绑定事件
+ _render方法： 视图层渲染
+ dispose方法： 析构

#### 内置事件

+ onload事件，组件渲染完事件

`me.on('onload', function () {`

可以绑定多个onload事件，用于处理不同的逻辑

#### 绑定事件方法

+ bindEvent绑定dom事件
+ unBindEvent解绑dom事件


#### 父类

+ 默认是lang
+ 通过第二个参数传递
```
var widget = function (proto, method) {
    method = mix(method || {}, {
        prefix: 'widget',
        // 类型，做禁用的class前缀
        type: '',
        // 继承
        superClass: lang.Class
    });

    var $super = method.superClass;
```

#### 原型方法

+ 通过第一个参数挂载到返回的构造函数的prototype上


#### 插件机制

```
/**
 * register 插件注册器
 *
 * @param {Function} Class 类引用
 * @param {Function} constructorHook 构造函数hook
 * @param {Object} methods 注册到原型的对象
 */
var register = function (Class, constructorHook, methods) {
    var reg = Class.$$plugins || (Class.$$plugins = []);
    var method;
    reg[reg.length] = constructorHook;

    for (method in methods) {
        if (methods.hasOwnProperty(method)) {
            Class.prototype[method] = methods[method];
        }
    }
};
```






