# 处理 Cookies 与 localStorage

异步抓取第三方页面，以单页面的方式把第三方的页面的内容区嵌入到我们自己页面的区块中；若直接第三方的js代码在我们自己的域名下操作 cookies 和 localStorage，会导致 cookies 丢失、冲突等问题。

开发者需要引入我们提供的 cookies / storage 操作库以操作相关对象。该操作库使用 iframe 引入目标域名的存储操作代理页面，使用 postMessage 实现跨域 cookies 和 localStorage 的操作。

该接口同时兼容同步页的 cookies，若接入方在自有域名下使用该接口进行操作，则不会创建 iframe 而是直接执行操作。

**注意，example 下的 proxy.html 文件需要部署到业务域名下。**

```javascript
require(["./crossdomain"], function (CrossDomain) {
  var domain = new CrossDomain('baike.baidu.com'); // 要操作的目标域名
  // -- 设置 cookies --
  domain.cookies.set('key', 'value', {
    expires: 1000*60*60*24*7, // milliseconds, -1, or Date object；默认为 -1
    domain: 'baike.baidu.com', // cookie domain, 默认为目标域名
    secure: true, // 是否仅在 https 时使用；默认为 false
    path: '/', // cookie path, 默认为 /
  })
  .then(function () {
    // 设置成功
  })
  .catch(function (err) {
    // 设置失败
    console.error('cookie set failed', err);
    setTimeout(function () {throw err;});
  });
  // -- 读取 cookies --
  domain.cookies.get('key')
  .then(function (value, options) {
    // value -> cookie 值
    // options -> cookie 选项
    // 若没有读取到，则两者为 null
  })
  .catch(function () {
    // 读取失败
  });
  // -- 写入 localStorage / sessionStorage --
  domain.localStroage.setItem('key', 'value the string') // 写入字符串
  domain.localStroage.set('key', {value: 'is a object'}) // 写入对象，会被 JSON.stringify
  .then(function (str) {
    // 写入成功
    // str -> 实际存入的字符串
  })
  .catch(function () {
    // 写入失败
  })
  // -- 读取 localStorage / sessionStorage --
  domain.localStroage.getItem('key') // 读取字符串
  domain.localStorage.get('key') // 读取时 JSON.parse
  .then(function (obj) {
    // 读取成功
    // 若没有读取到，obj = null
  })
  .catch(function () {
    // 读取失败
  });
  // -- 遍历 localStorage / sessionStorage --
  domain.localStorage.length() // 获取 ls 长度
  .then(f).catch(e);
  domain.localStorage.getKey(index) // 获取第 index 个 ls 的 key name
  .then(f).catch(e);
  // -- 检查 localStorage / sessionStorage 是否存在
  domain.localStorage.has(key)
  .then(function (isExists) {
    // 获取成功
  }).catch(e);
  // -- 检查浏览器是否支持跨域操作 localStorage / sessionStorage --
  domain.localStorage.isSupported()
  .then(f).catch(e);
})
```
