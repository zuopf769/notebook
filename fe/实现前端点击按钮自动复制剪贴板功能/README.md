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

[代码](https://github.com/zuopf769/notebook/blob/master/fe/%E5%AE%9E%E7%8E%B0%E5%89%8D%E7%AB%AF%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E5%89%AA%E8%B4%B4%E6%9D%BF%E5%8A%9F%E8%83%BD/Clipboard.js)

## 友情链接

[Clipboard.js](https://clipboardjs.com/)

[实现前端点击按钮自动复制剪贴板功能](https://juejin.im/post/5aefeb6e6fb9a07aa43c20af)
