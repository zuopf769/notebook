## 前端全（无）埋点之页面操作路径可视化

> [左鹏飞](https://github.com/zuopf769)  2017.11.22


全（无）埋点并不是完全不用写代码，而是尽可能的少写代码。开发者将SDK集成到项目中，配置并初始化SDK之后，就可以实现自动化采集用户行为数据。本文介绍了如何通过xpath来采集用户点击操作行为。


### 1. 什么是全（无）埋点？

首先全（无）埋点并不是完全不用写代码，而是尽可能的少写代码。开发者将SDK集成到项目中，配置并初始化SDK之后，就可以实现自动化采集用户行为数据。

### 2. 页面操作路径


#### 2.1 点击操作路径

页面操作路径是指用户在当前页面都点击了什么；比如用户在当前页面先点了按钮1，然后又点了按钮2，....；这里需要注意下和用户访问路径的区别，用户访问路径指的是一次会话中，用户访问的多个页面路径。


#### 2.2 滚动操作路径

滚动操作路径是指记录页面滚动的位置信息，以方便的统计用户在页面中从上往下滚动时，从哪儿跳出页面的几率高。


### 3. xpath

XPath是一门在XML文档中查找信息的语言。XPath用于在XML文档中通过元素和属性进行导航。全埋点需要把点击的目标对象在页面文档结构中的xpath路径记录下来。


### 4. 获取xpath的js库

```
function ellocate (el) {
    var locator = { xpath: '', css: ''};
    var eloc = {
        getClass: function(el) {
            var formatClass = '';
            var elementClass = el.className;
            if(typeof elementClass != 'undefined' && elementClass != ''){
                formatClass = '.' + elementClass.split(/[\s\n]+/).join('.');
            }
            return formatClass;
        },
        index: function(el) {
            var elements = el.parentNode.children;
            for (var i=0;i<elements.length;i++) {
                if( elements[i] == el){
                    return i;
                }   
            }
        }
    };
    for (; el && el.nodeType == 1; el = el.parentNode) {
        var idx = eloc.index(el);
        if(el.tagName.substring(0,1) != "/" && el.tagName.toLowerCase() !== 'body' && el.tagName.toLowerCase() !== 'html') { //IE oddity: some tagNames can begin with backslash.
            if(el.id != 'undefined' && el.id !='') {
                var idPath="[@id=" + "'" + el.id + "'" + "]";
                locator.xpath = '/' + el.tagName.toLowerCase() + idPath + locator.xpath;
                locator.css = el.tagName.toLowerCase() + '#' + el.id + ' > ' + locator.css;
            }
            else {
                idx='[' + idx + ']';
                locator.xpath = '/' + el.tagName.toLowerCase() + idx + locator.xpath;
                locator.css = el.tagName.toLowerCase() + eloc.getClass(el) + ' > ' + locator.css;
            }
        }
    }
    locator.xpath = '//html[1]/body[1]/' + locator.xpath;
    locator.css = locator.css.substr(0, locator.css.length-3);
    return locator;
};
```
上面的方法给定el元素可以返回CSS selectors和XPath expressions。


### 5. 总结

xpath可以获得用户点击目标对象的全路径，可以用来做用户点击行为的可视化。




