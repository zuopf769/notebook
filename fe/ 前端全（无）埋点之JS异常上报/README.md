## 前端全（无）埋点之JS异常上报

> 左鹏飞 2017.11.29

### 相关阅读

[1]（https://github.com/zuopf769/notebook/blob/master/fe/%E5%89%8D%E7%AB%AF%E5%85%A8%EF%BC%88%E6%97%A0%EF%BC%89%E5%9F%8B%E7%82%B9%E4%B9%8B%E9%A1%B5%E9%9D%A2%E6%93%8D%E4%BD%9C%E8%B7%AF%E5%BE%84%E5%8F%AF%E8%A7%86%E5%8C%96/README.md）

### 1.前言

JS报错是比较常见的一个情景，但是有一些错误：例如后端接口字段发生变化了导致前端发生运行时错误；那么我们在本地测试的时候是测试不出来的，只有当发布到线上之后才可以发生异常。如果抢救及时，那还好，假如很晚才发现，那就可能造成很大的损失了。如果我们前端可以监控到这种报错，并及时上报的话，那我们的问题就比较好解决了。


### 2.什么是前端JS代码异常  

前端代码异常指的是以下两种情况：

+ JS脚本里边存着语法错误；

+ JS脚本在运行时发生错误。

### 3. 错误异常信息应该包括什么

+ message {String} 错误信息。直观的错误描述信息。

+ url {String} 发生错误对应的脚本路径，比如是你的http://a.js报错了还是http://b.js报错了。

+ lineNo {Number} 错误发生的行号。

+ columnNo {Number} 错误发生的列号。

+ error {Object} 具体的 error 对象，包含更加详细的错误调用堆栈信息，这对于定位错误非常有帮助。

### 4. try-catch捕获异常

+ try-catch能捕捉到被其内部代码运行时发生的错误
+ 如果有异步promise代码，不能正常捕获异常
+ 想捕获全局的错误事件,需要给整体的代码都包try-catch:通常的做法是打包后的整体JS外部包一个try-catch;每个方法内部都要包在try-catch里面
+ 通常需要借助工程化工具来实现包裹try-cath:例如：[babel-plugin-try-catch-wrapper](https://github.com/foio/babel-plugin-try-catch-wrapper/tree/master/src)


### 5. window.onerror事件捕获异常


#### 5.1 兼容性问题

+ 错误描述信息message，无法从这里面看出端倪，特别是压缩后脚本的报错信息。
+ 不同浏览器对同一个错误的message是不一样的。
+ IE10浏览器只能获取到message,url和lineNo，columnNo以及具体的error是获取不到的；不过 window.event 对象提供了errorLine和errorCharacter，以此来对应相应的行列号信息。

```
//不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
col = col || (window.event && window.event.errorCharacter) || 0;

```

+ 可以使用arguments.callee.caller 来递归出调用堆栈，这一类信息是最直接的错误信息信息

```
if (error && error.stack){
  //如果浏览器有堆栈信息，直接使用
  defaults.msg = error.stack.toString();

}else if (arguments.callee){
  //尝试通过callee拿堆栈信息
  var ext = [];
  var fn = arguments.callee.caller;
  var floor = 3;  //这里只拿三层堆栈信息
  while (fn && (--floor>0)) {
     ext.push(fn.toString());
     if (fn  === fn.caller) {
          break;//如果有环
     }
     fn = fn.caller;
  }
  ext = ext.join(",");
  defaults.msg = error.stack.toString();
}
```

#### 5.2 其他注意事项

+ window.onerror的脚本必须要放到所有代码的最前边，否则会导致有些异常信息捕获不到，因为发生异常了，js也就不会往下执行了

+ 对于跨域的JS资源（通常异常捕获代码内联在主域名下，其他静态资源在静态资源集群CDN上），默认情况下，在本域名下捕获到一个跨域脚本的错误信息时，只能获取到一条信息 Script error.，没有文件信息，没有行列号数据，更没有详细的错误对象。针对window.onerror拿不到详细的信息，需要往资源的请求添加额外的头部。静态资源请求需要加多一个Access-Control-Allow-Origin头部，也就是需要后台加一个Access-Control-Allow-Origin，同时script引入外链的标签需要加多一个crossorigin的属性。这样就可以获取准确的出错信息。

+ 目前大多数站点的静态脚本文件，上线时都要压缩混淆的。所以发生错误时，获取到的行号就是第 1 行，列号会是一个巨大无比的数。这时你只能依赖错误信息和文件路径来定位错误。好在我们有 sourcemap，有了它，我们可以定位到源代码的位置。关于 sourcemap, 阮大这篇 [详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html) 你可以去了解 sourcemap 的原理，mozilla 开源了一个 [sourcemap](https://github.com/mozilla/source-map/) 的工具，可以靠它来生成 sourcemap 或者根据 sourcemap 反算出变量名称和行列号。

+ 一个错误发生时，上报的数据量还是蛮大的。如果一个异常一直重复触发，连续不断的向服务器轰炸，既是数据冗余，也造成流量浪费。所以，对于异常信息的上报，从上报内容和上报频率上，应该加以限制。

```
//采用异步的方式,避免阻塞
  setTimeout(function() {

      //不一定所有浏览器都支持col参数，如果不支持就用window.event来兼容
      col = col || (window.event && window.event.errorCharacter) || 0;

      defaults.url = url;
      defaults.line = line;
      defaults.col =  col;

      if (error && error.stack){
          //如果浏览器有堆栈信息，直接使用
          defaults.msg = error.stack.toString();

      }else if (arguments.callee){
          //尝试通过callee拿堆栈信息
          var ext = [];
          var fn = arguments.callee.caller;
          var floor = 3;  //这里只拿三层堆栈信息
          while (fn && (--floor>0)) {
             ext.push(fn.toString());
             if (fn  === fn.caller) {
                  break;//如果有环
             }
             fn = fn.caller;
          }
          ext = ext.join(",");
          defaults.msg = error.stack.toString();
      }

  }, 0);
```

### 6.总结

QA不是万能的，用户的浏览环境非常复杂，很多情况无法靠测试用例去覆盖，所以最好建立一个前端错误日志，在真实用户端收集bug。


