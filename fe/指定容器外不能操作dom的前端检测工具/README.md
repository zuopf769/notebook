### 在指定容器外部能操作dom的检测工具

#### 1. 背景

最近遇到个场景是我们自己的页面会以异步的形式被第三方的页面抓取，嵌入到他们的页面中，然后我们的js不能操作人家外面的dom，否则会引发问题


#### 2. HTML5 MutationObserver

MutationObserver给开发者们提供了一种能在某个范围内的DOM树发生变化时作出适当反应的能力


#### 3. HTML5 MutationObserver介绍

[MutationObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver#MutationObserverInit)

#### 4. 如何实现在指定容器外部能操作dom的检测工具

+ observer.observe(target, config)只能监听target内部的dom变化，而并不能实现外面的dom变化监听
+ 那我们就监听页面根元素`var target = document.documentElement;`
+ 然后用`!container.contains(node)`来判断监听到的node是否在container外面

#### 5. 代码地址

[代码](https://github.com/zuopf769/notebook/blob/master/fe/%E6%8C%87%E5%AE%9A%E5%AE%B9%E5%99%A8%E5%A4%96%E4%B8%8D%E8%83%BD%E6%93%8D%E4%BD%9Cdom%E7%9A%84%E5%89%8D%E7%AB%AF%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7/mutation.js)

