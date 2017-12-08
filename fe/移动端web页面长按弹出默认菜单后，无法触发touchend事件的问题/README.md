## 移动端web页面长按弹出默认菜单后，无法触发touchend事件的问题

> [左鹏飞](https://github.com/zuopf769)   2017.12.08


最近有个需求是实现长按按钮，动画一直播放的需求。但是原生js没有长按事件，zepto中的长按事件是两次touchstart之间的时间间隔是750毫秒认为是长按事件。

### 1. 如何实现长按

#### 1.1 思路

touchstart触发动画，touchend禁止掉动画

```
$('.citys-wrap .btn-start').on('touchstart', function (e) {
      e.stopPropagation();  

  cancelAnimationFrame(timer);
  timer = requestAnimationFrame(function fn() {
    speed += 4;
    if (speed >= getMaxTranslatex()) {
      speed = getMaxTranslatex();
      cancelAnimationFrame(timer);
    }
    $('.citysWrap')[0].style.webkitTransform = 'translate3d('+ - speed +'px, 0, 0)'; 
    timer = requestAnimationFrame(fn);
    showHelloOFO();
  });
  e.returnValue = false;
  return false;
});

$('.citys-wrap .btn-start').on('touchend', function () {
  cancelAnimationFrame(timer);
});

```
#### 1.2 存在问题

+ 长按会弹出系统菜单
+ 偶尔会出现touchend事件不触发，动画不能停下来，尤其是系统菜单弹出后


### 2. 如何禁止系统菜单

#### 2.1 css样式

```
  -webkit-touch-callout: none;
  -webkit-user-select:none;
  user-select:none; 
```
然鹅不起卵用

#### 2.2 系统菜单事件

```
// 禁止系统菜单
window.addEventListener('contextmenu', function(e){  
  e.preventDefault();  
});

```
然鹅不起卵用

#### 2.3 阻止body的touch事件

```
// 禁止系统菜单
    $('body').on('touchend', function () {
      return false;
    });

    $('body').on('touchstart', function () {
      return false;
    });

    $('body').on('touchcancel', function () {
      return false;
    });

```

+ 一定要分开写
+ 一定要加touchcancel事件（具体原因还真不知道）


### 3. 无法触发touchend事件

上面提到了偶尔会出现touchend事件不触发，动画不能停下来，尤其是系统菜单弹出后

其实应该是系统菜单的弹出阻断了touchend的触发，从而导致动画没有结束，这时候需要touchcancel来帮忙，大功告成。

```
$('.citys-wrap .btn-start').on('touchcancel', function () {
     cancelAnimationFrame(timer);
});
```

### 4. 参考文献

+ [移动端web页面长按弹出默认菜单后，无法触发touchend事件的问题？](https://www.zhihu.com/question/39714228/answer/103425211)