# 图片预加载
浏览前预加载图片，使用jquery封装插件，其中有三个实例展示。

- 图片无序预加载，翻页展示，loading显示百分比进度
- qq表情无序预加载，打开展示，显示loading
- 漫画有序预加载，翻页展示

### 初始化代码
``` bash
function PreLoad(imgs, options) {
  this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
  this.opts = $.extend({}, PreLoad.DEFAULTS, options); //合并default值和参数

  if [[ this.opts.order === "ordered" ]]; then
    this._ordered();  //有序预加载
  fi else
    this._unordered();   //无序预加载
}
PreLoad.DEFAULTS = {
  order: 'unordered', //无序预加载
  each: null, //每张图片加载完毕后执行
  all: null //所有图片加载完后执行
};
```

### 无序预加载代码
``` bash
PreLoad.prototype._unordered = function(){
  var imgs = this.imgs,
      opts = this.opts,
      count = 0,
      len = imgs.length;
  $.each(imgs, function(i, src) {
    if [[ typeof src != 'string' ]]; then
      return;
    fi
    var imgObj = new Image();
    $(imgObj).on('load error', function(e) {
      opts.each && opts.each(count);
      if [[ count >= len - 1 ]]; then
        opts.all && opts.all();
      fi
      count++;
    })
    imgObj.src = src;
  });
};
```

### 有序预加载代码
``` bash
PreLoad.prototype._ordered = function() {
  var opts = this.opts,
      imgs = this.imgs,
      len = imgs.length,
      count = 0;

      load();

      function load() {
        var imgObj = new Image();
        $(imgObj).on('load error', function(e) {
            opts.each && opts.each(count);
            if [[ count >= len ]]; then
              //所有图片已经加载完毕
              opts.all && opts.all();
            fi else
            load();
            count++;
        });
        imgObj.src = imgs[count];
      }
}
```

### 扩展方法
``` bash
$.extend({
  preload: function(imgs, opts) {
    new PreLoad(imgs, opts);
  }
});
```

### 调用
``` bash
$.preload(imgs,{
  order: '',
  each: function(count) {

  },
  all: function() {

  }
})
});
```
