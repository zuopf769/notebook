## usage

```
//使用函数
$("#copy").on("tap",function(){
  var val = $("#textAreas").val();
  Clipboard.copy(val);
});

```

> 和插件Clipboard.js一样，不过代码不多，就直接拿来用好了。 这个获取的不是input对象，而是需要复制的内容。


## 代码地址

[代码]()

## 友情链接

[Clipboard.js](https://clipboardjs.com/)

[实现前端点击按钮自动复制剪贴板功能](https://juejin.im/post/5aefeb6e6fb9a07aa43c20af)