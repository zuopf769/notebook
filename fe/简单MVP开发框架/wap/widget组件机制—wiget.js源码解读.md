# widget组件机制—wiget.js源码解读

[代码地址]（https://github.com/zuopf769/notebook/blob/master/fe/%E7%AE%80%E5%8D%95MVP%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6/wap/widget/lib/widget.js）

```
method = $.extend(true, {
     prefix: 'widget',
     // 类型，做禁用的class前缀
     type: '',
     // 继承
     superClass: lang.Class
}, method || {});
```

- method 是个对象，定义widget类时可以传，也可以不传
- prefix值默认是`widget`，最好不要覆盖
-  prefix的用途：`me.$el.data(me.prefix, this);` `var meta = me.$el.data(me.prefix + '-options');` 作为通过元素传值用的，类似我们通常的data-xxx属性，来设置和取值
- type 是组件类型，最好设置为组件的构造函数的名字
- superClass 是组件的父类，默认是lang.Class

---

```
var $super = method.superClass;
var $superProto = $super.prototype;

proto = $.extend(true, {
    el: $superProto.el || '',
    elements: $superProto.elements || {},
    events: $superProto.events || {},
    // 默认选项
    Options: $superProto.Options || {}

}, proto || {});
```

+  这段代码主要是当有继承父类的时候，用子类的proto上面的`el`、`elements`、`events`、`Options` 覆盖父类的，如果子类没有就用父类的
+ `el`是组件的wrap 或者 container
+ `elements`是用来配置挂载到`this.$elements上`的dom对象的
+ `Options`使用来配置默认配置项的

![图片](http://bos.nj.bpc.baidu.com/v1/agroup/5e52f7da537137e3efdadecda6b61d0d0da7ef86)

+ `Options` 的值最终会mrege到`this.options`上

---

```
var fn = function (options) {
    var me = this;
    var args = arguments;
    
	// new你自己wiget组件时，传入的参数配置项
    options = options || {};
	
    // 挂载自己wiget组件的容器
    me.$el = null;
    // 挂载自己wiget组件的容器下的dom元素
    me.$elements = {};
	// mergenew自己的wiget传入的配置项和默认的Options
    me.options = $.extend(true, {}, proto.Options, options);
	
	// 组件类型，最好是自己的组件构造函数的名字
    me.type = method.type;
    // 前缀，后面setData方法会用到
    me.prefix = method.prefix;
    // 元素创建的标志位
    me._created = false;
    // 禁用的标志位
    me._disabledStatus = false;
	
	// new出来的hammer对象都会push到这个数组中，方便dispose时，统一销毁
    me._hammerEventStack = [];

    // 在onload后将_created与_disabledStatus重置
    me.on('onload', function () {
        me._created = true;
        me._disabledStatus = true;
		
		// 挂载$el
        if (!me.$el || me.$el.length < 1) {
            me.$el = $(me.options.el);
        }
		
		// 当前对象绑定到el元素的data属性上
        me.$el.data(me.prefix, this);
        // 取el上的data-widget-options，主要用于通过dom配置初始化值
        var meta = me.$el.data(me.prefix + '-options');
        // me.options和上步的merge
        me.options = $.extend(true, me.options, meta);
		
		// 挂载elements上的dom元素
        me.refreshElements();
        // 绑定evetns上的对象
        me._bindEvents(me.events);
    });


    // 执行构造器
    lang.isFunction(me._init) && me._init.apply(me, args);
	
	// 注入插件（插件是通过wiget.register方法注入的constructorHook）
    fn.$$plugins && $.each(fn.$$plugins, function (i, item) {
        item.apply(me, args);
    });
	
	// 挂载$el
    me.$el = $(me.options.el);
	
    if (lang.isFunction(me._render)) {
	    // 钩子函数_render
        me._render();
        // 钩子函数_initEvents
        me._initEvents();
    }
	
	// 触发内置事件onload
    me._onloadTimer = util.requestAnimationFrame(function () {
        me.fire('onload');
    }, 16);
};
```

- fn 是真正的组件的构造函数
- 生命周期（钩子）函数执行的顺序是_init() >  fn.$$plugins  > _render()  > _initEvents >  me.on('onload')
- 插件是通过wiget.register方法注入的constructorHook，可能会注册多个函数
-  _hammerEventStack用于放置new 的hammer对象，用hammer注册事件，不要用zepto
-  onload事件是在_render后 delay 16ms后触发的， 然后refreshElements也是在onload里面调用的，所以如果自己取dom的话一定要注意时间

---

```
// 继承$super
lang.inherits(fn, $super);
```
+ $super为要继承的父构造函数
+ fn为本组件构造函数

----

inherits的源码如下：
```
var inherits = function (subClass, superClass, type) {	// empty函数用于继承
    var key;
    // 新的proto对象
    var proto;
    // 子类原型对象
    var selfProps = subClass.prototype;

	// empty函数用于继承
    var Clazz = new Function();
    
    // empty构造函数的prototype对象指向superClass.prototype
    Clazz.prototype = superClass.prototype; 
    
    // empty构造函数的prototype对象指向superClass的prototype对象
    // subClass的prototype对象指向empty构造函数的实例
    // empty构造函数的实例的_proto_指针指向其自己的prototype对象
    // subClass的prototype对象就指向了superClass的prototype对象
    // subClass.prototype不直接指向superClass的prototype对象是因为：不想让subClass的prototype上的方法污染superClass的prototype对象，否则subClass的prototype上的方法，父的prototype也就有了，和继承的机制（子类有的父不一定有就违背了）
    // 所以通过一个中间变量：空函数的对象来避免，子类prototype方法不会污染父类prototype对象
    proto = subClass.prototype = new Clazz();

	// 子类自身的prototype上的属性merge到新的proto变量上
    for (key in selfProps) {
        proto[key] = selfProps[key];
   
    // 重新将subClass的prototype对象的constructor指回自身的构造函数
    // 不重新指回的话会指向了父类的构造函数
    subClass.prototype.constructor = subClass;
	   
	// subClass添加静态属性superClass，指向superClass的prototype
	// 比如直接可以在子类中调用父的原型方法(因为子类以及覆写了父类的方法，如果想调用父的方法，只能通过下面的方式去调用)
	// `Select.superClass._initEvents.call(this);` 
    subClass.superClass = superClass.prototype;

    // 类名标识，兼容Class的toString，基本没用
    typeof type === 'string' && (proto.__type = type);
	
	// 提供一个工具静态方法，方便merge属性
    subClass.extend = function (json) {
        for (var i in json) {
            proto[i] = json[i];
        }
        return subClass;
    };

    return subClass;
};

module.exports.inherits = inherits;
```

```
// 改写_init函数
 var _init = lang.isFunction(proto._init) ? proto._init : emptyFn;
 var _superClassInit = $super === lang.Class ? lang.Class : $superProto._init;

  // _init执行父类构造函数
  proto._init = function () {
      var args = arguments;
      var me = this;

      lang.isFunction(_superClassInit) && _superClassInit.apply(me, args);
      lang.isFunction(_init) && _init.apply(me, args);
  };
```

+ 如果继承了父类，子类就会覆盖父亲的同名_init方法
+ 为了不覆盖，所以重写了子类的_init
+ 这样在_init执行时，也会执行的父类构造函数_init
+ 其实这里说的构造函数不是真正的构造函数，如果真正的构造函数继承，只需要执行下父类的构造函数即可

```
// 挂载默认的扩展原型
fn.extend($.extend(true, {}, widget._method, proto));
```

+ 挂载默认的扩展原型
+ widget._method即默认的原型扩展
+ $.extend(true, {}, widget._method, proto)， 会把widget._method、proto merge到一个新的对象上
+ fn.extend上面的对象mrege到本类的prototype上


```
return fn;
```
+ 最终的wiget方法会返回fn，最为最终的组件的构造函数

```
/**
  * _bindEvents 绑定events对象的事件
   * 支持4种写法:
   * {
   *     '$hd click,mouseover .item': 'clickHandle',
   *     '$hd click': 'clickHandle',
   *     'click .item': 'clickHandle',
   *     'click': 'clickHandle'
   * }
   *
   * @private
   * @param {Object} events 绑定的事件对象map
   * @return {undefined}
   */
  _bindEvents: function (events) {
      var me = this;
      events = events || me.events;

      if (!lang.isObject(events)) {
          return false;
      }
 事件委托容器
      $.each(events, function (key, val) {
	      // 用空格分割key
          var parseKey = key.split(/\s+/);
          // 绑定事件的元素
          var element;
          // 事件类型
          var type;
          // 有事件委托容器
          var selector;

          if (!(val in me)) {
              throw new Error('缺少' + val + '事件函数');
          }

          switch (parseKey.length) {
	          、
             case 3:
	               // 取得是挂载到me.$elements上的dom元素，对应上面在elements配置的key
                element = me.$elements[parseKey[0]];
                 type = parseKey[1];
                  selector = parseKey[2];
                 break;
              case 2:
                      // 'click .item': 'clickHandle',
                  if (parseKey[0].match(/^\$/)) {
                       element = me.$elements[parseKey[0]];
                      type = parseKey[1];
                      // 委托容器为parseKey[1]，应用场景为：比如组件是是list组件里面的一个item，就需要把me.$el上的事件委托到外层指定的某个容器上
                }
                 else {
                       element = me.$el;
                      type = parseKey[0];
                       selector = parseKey[1];
                  }
                  break;
			// 默认是给me.$el绑定事件
             case 1:
                  element = me.$el;
                   type = parseKey[0];
                   break;

               default:
                   break;
          }

           if (!selector) {
              me.bindEvent(element, type, val);
          }
          else {
              me.bindEvent(element, type, selector, val);
          }
      });
  },
```
+来绑定events 对象map上绑定的事件

```
/**
  * bindEvent 绑定事件,添加了命名空间(type),好做回收使用
   *
   * @param {HTMLElement} element 元素
   * @param {Event} type 事件类型
   * @param {string} selector 代理使用的选择器
   * @param {Function} fun 绑定的函数
   * @return {Object} this
   */
  bindEvent(element, type, selector, me.xxxfun)
     var me = this;
      var args = arguments;

      // 区分唯一性，防止添加或去除window上namespace冲突的组件
      var namespace = me.type + '_' + me.guid;

      if (args.length === 3) {
          fun = selector;
          selector = null;
       }

		// 指定作用域
     if (lang.isString(fun)) {
          fun = me[fun];
      }
	
	// 如果fun是字符串，那么必须是挂载在me上的一个原型方法的名字
	// 比如可以使用 me.bindEvent: function (element, type, selector, fun) {
    fun = $.proxy(fun, me);
      
	// 可以注册多个事件如： `click, mouseenter`
    type = type.split(',');

	// 给每个事件加命名空间
      type = $.map(type, function (item, i) {
          return item + '.' + namespace;
      });

      type = type.join(' ');

      if (!selector) {
          $(element)
             .on(type, fun);
      }
      else {
          $(element)
               .on(type, selector, fun);
      }

      return this;
  },
```
+ 如果需要手动绑定dom事件就需要采用该方法

```
/**
   * unBindEvent 解绑绑定事件,添加了命名空间(type),好做回收使用
   *
   * @param {HTMLElement} element 元素
   * @param {Event} type 事件类型
   * @param {string} selector 代理使用的选择器
   * @param {Function} fun 绑定的函数
   */
  unBindEvent: function (element, type, selector, fun) {
      var me = this;
      var args = arguments;

      // 区分唯一性，防止添加或去除window上namespace冲突的组件
      var namespace = me.type + '_' + me.guid;

      if (args.length === 3) {
          fun = selector;
          selector = null;
      }

      if (lang.isString(fun)) {
          fun = me[fun];
      }

      if (fun) {
          fun = $.proxy(fun, me);
      }

      type = type.split(',');
		
	 // 给每个事件加命名空间和上面的bind对应
      type = $.map(type, function (item, i) {
          return item + '.' + namespace;
      });

      type = type.join(' ');

      if (!selector) {
          $(element)
              .off(type, fun);
      }
      else {
          $(element)
              .off(type, selector, fun);
      }

  },
```
- 解绑绑定事件时注意命名空间(type)
- 用了命名空间后off('.xxxx')很方便就off了该命名空间下的所有事件，通常就是某个组件下的所有事件

```
/**
  * dispose 析构函数
  * 析构时派发ondispose事件并调用lang.Class.dispose来做销毁
  * @return
  */

 dispose: function () {
     var me = this;
     var namespace = me.type + '_' + me.guid;

     // 清除hammer实例
     $.each(me._hammerEventStack, function (i, item) {
         try {
	         // 调用hammer的destroy方法，这里需要注意hammer的版本，有的版本里面没有destroy方法，是另外的名字
             item.destroy();
         }
         catch (e) {}
     });
	
	 // 解绑me.$el的事件
     me.$el.off('.' + namespace);
     // 解绑me.$el下的子dom元素的事件
     me.$el.find('*')
         .off('.' + namespace);
     // 删掉data-me.prefix + '-options'上的值
     me.$el.removeData(me.prefix + '-options');
	
	// fire dispose内置事件，你自己注册的dispose事件就会执行
	// 调用lang.Class.dispose来做销毁
     me.fire('ondispose') && lang.Class.prototype.dispose.call(me);
 },
```
```
Class.prototype.dispose = function () {
    // 删除全局实例对象的对象
    // this.guid为组件的guid
    delete $$._instances[this.guid];

    // this.__listeners && (for (var i in this.__listeners) delete this.__listeners[i]);
	
	// 删除原型对象上的属性
    for (var property in this) {
        typeof this[property] !== 'function' &&
        delete this[property];
    }
    this.disposed = true; // 20100716
};

```

```
/**
     * _setStatus 设置状态
     *
     * @private
     * @param {boolen} key 是否禁用
     * @return {Object} this
     */
    _setStatus: function (key) {
        if (key) {
            this._disabledStatus = true;
            this.$el.addClass(this.type + '-disabled ui-state-disabled');
        }
        else {
            this._disabledStatus = false;
            this.$el.removeClass(this.type + '-disabled ui-state-disabled');
        }

        return this;
    },

    /**
     * setDisable 设置禁用
     *
     * @return {Object} this
     */
    setDisable: function () {
        this._setStatus(true);
        this.fire('disable');

        return this;
    },

    /**
     * setEnable 设置启用
     *
     * @return {Object} this
     */
    setEnable: function () {
        this._setStatus(false);
        this.fire('enable');

        return this;
    },

    /**
     * getStatus 获取状态
     *
     * @return {boolean}
     */
    getStatus: function () {
        return this._disabledStatus;
    },
```

+ 设置启用、禁用
+ 通常的应用场景为： 一个按钮可点击还是置灰不可点击

```
/**
   * refreshElements
   *
   * @param {Object} elements 需要获取的元素object
   * @return {Array} 返回获取后的jq wrap dom对象的map集合
   */
  refreshElements: function (elements) {
      var me = this;
      var ref = elements || me.elements;
      var results = [];
      var key;
      var value;
      var attrMatch;

      for (key in ref) {
          if (ref.hasOwnProperty(key)) {
              value = ref[key];
              attrMatch = key.match(/^@([-_\w]+)/);
			  // 以@开头
              if (attrMatch && attrMatch.length > 1) {
                  results.push(me.$elements[value] = me.getHookElement(attrMatch[1]));
              }
              else {
                  results.push(me.$elements[value] = $(key, this.$el));
              }
          }

      }
      return results;
  },
```

+ 该方法主要用于将elements配置项上的dom对象map，挂载到me.$elements
+ 以@开头是js-hook的方式，用js-hook的好处是，别人即使改了class选择器，也不会影响dom的选取。

```
/**
  * getHookElement 按自定义元素js-hook获取元素
   *
   * @param {string} selector 选择器
   * @return {Object} jquery element
   */
  getHookElement: function (selector) {
      return $('[js-hook=' + selector + ']', this.$el);
  },
```
+ 通过属性选择器获取jq dom

```
/**
     * getData 获取data
     *
     * @param {string} key 需要获取的键值
     * @return {Null}
     */
    getData: function (key) {
        var me = this;
        var namespace = me.prefix + '_' + me.guid;
        var data = me.$el.data(namespace + '-options');

        if (data.hasOwnProperty(key)) {
            return data[key];
        }

        return null;
    },

    /**
     * setData 设置data
     *
     * @param {string} key 设置的键值
     * @param {any} val 设置的val
     * @return {Object} this
     */
    setData: function (key, val) {
        var me = this;
        var namespace = me.prefix + '_' + me.guid;
        var data = me.$el.data(namespace + '-options') || {};

        data[key] = val;
        me.$el.data(namespace + '-options', data);

        return me;
    },
```
+ setData和getData方法主要是用来在me.$el上通过data-me.prefix + '_' + me.guid的方法传递值

```
/**
  * createHammer 创建hammer实例
  *
  * @param {HTMLElement} element dom对象
  * @param {Object} options 选项
  * @return {Object} Hammer对象
  */
 createHammer: function (element, options) {
     var mc = new Hammer(element, options);
     this._hammerEventStack.push(mc);
     return mc;
 },
```

+ 创建hammer实例
+ 把hammer实例统一push到_hammerEventStack中，统一管理，在dispose析构函数中可以统一销毁

```
/**
   * getEl 返回$el 对象
   *
   * @return {Element}  返回el对象
   */
  getEl: function () {
      return this.$el;
  },

```

+ 返回$el 对象即组件的容器dom

```
/**
     * _render 渲染接口
     *
     * @private
     */
    _render: function () {},

```
+ 用于实现模板的渲染，通常用法是：
+ `this.$el.html(xxx)或者（xxx）.appendTo(this.$el)`

```
/**
 * _initEvents 初始化事件接口
   *
   * @private
   */
  _initEvents: function () {},

```

+ 通常用来自己绑定事件，没有用events对象来配置事件

```
fireOnload: function () {
     util.cancelAnimationFrame(this._onloadTimer);
     this.fire('onload');
 }
```
+ 手动触发组件的onload内置事件
+ 通常的场景是：需要再次刷新elements和events时

```
// 混入zIndex管理器
widget._method = $.extend({}, widget._method, util.zIndexManager);
```

```
var zIndexManager = (function () {
    var base = 9000;
    var attr = 'ZIndexDefaultValue';
    var stack = [];

    return {
        bringToFront: function (el) {
            var defaultZIndex;
            var $el = $(el);

            if ($el.data(attr) === null) {
                defaultZIndex = $el.css('z-index');
                $el.data(attr, defaultZIndex);
            }

            $el.css('z-index', base++);

            if (!el.id) {
                el.id = uniqueId('Zuniqueid__');
            }

            arrayRemove(stack, el.id);
            stack.push(el.id);
        },

        sendToBack: function (el) {
            var $el = $(el);
            var defaultZIndex = $el.data(defaultZIndex) || 0;

            if (!el.id) {
                el.id = uniqueId('Zuniqueid__');
            }

            $el.css('z-index', defaultZIndex);
            arrayRemove(stack, el.id);
        },

        getActive: function () {
            if (stack.length > 0) {
                return stack[stack.length - 1];
            }

            return null;
        }

    };
})();

exports.zIndexManager = zIndexManager;
```

+ bringToFront方法用于置顶
+ sendToBack恢复默认值

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

exports.register = register;
```
+ 用来实现出了继承之外的扩展对象的方式
+ 类似于mixin、include机制
+ 构造函数hook， 会在构造函数执行时执行，通常的打点机制就是写个函数，然后监听打点的自定义事件，此函数的上下文为组件本身
+ methods就是对象了，可以是字面量对象也可以是某个组件的prototype对象
