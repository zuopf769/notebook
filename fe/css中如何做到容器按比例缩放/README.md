## css中如何做到容器按比例缩放

### 1. 背景


如何设置元素高度与宽度成特定比例。宽度改变，高度自动按比例改变。 </br>


一般在响应式中，我们会要求视频的宽高比为16：9或4：3，这么一来就比较头大了。当用户改变浏览器宽度的时候（改变高度不考虑），视频的宽度变了，那么高度也得根据我们要求的16：9或4：3改变。


### 2. 题目

如何设置content容器的宽高比为16:9

```
//HTML代码片段
<div class="container">
  <div class="wrapper">
     <div class="content">content</div>
  </div>
</div>

```

### 4. 核心思想

提供一个容器，设置容器的高度为0，再设置padding-bottom或者padding-top为56.25%（因为padding的百分比是按照容器宽度计算的，所以由padding来撑开容器高度，而不是height，保证了容器的宽高比例），最后设置视频绝对定位，其宽高为容器的100%。


### 5. 代码示例

```
* {
	padding: 0;
	margin: 0;
}

div {
    border: 1px solid green;
}

.container { 
    width:100%; 
}

.wrapper {
    position:relative;
    padding-top: 25px;
    padding-bottom: 56.25%;   // 16/9 = 0.5625;
    height:0;
    border: 1px solid red;
}

.content {
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height:100%;
    background:gray;
}

```

我们看到先设置.container容器宽度为400.这个值可以使任意的宽度，也可以是一个百分比。

.wrapper容器设置了padding-bottom为56.25%。 这个百分比是16/9的值，这里设置padding-bottom为父容器.container的宽度的百分之56.25.

另外。设置padding-top 为25px，这里在实际中也比较有用。 比如我们要设置一个视频播放器播放界面的宽高比为16:9。我们还希望播放界面上面留下25px的高度来放置播放控制的按钮。

通过padding-bottom和padding-top撑起了.wrapper容器的高度。并且设置height为0;

接下来是.comtent元素。我们设置这个元素绝对定位。top:0,left:0; width:100%;height:100%;因为它的父元素.wrapper的宽度和高度已经成比例了，所以使用width:100%;height:100%;就让content容器达到目的了。通过改变.container的宽度，.content元素的高宽也能成比例的改变。


### 6. 扩展

根据上述思想，我们再将其扩展下，应用到其他地方

![](https://github.com/zuopf769/notebook/blob/master/fe/css%E4%B8%AD%E5%A6%82%E4%BD%95%E5%81%9A%E5%88%B0%E5%AE%B9%E5%99%A8%E6%8C%89%E6%AF%94%E4%BE%8B%E7%BC%A9%E6%94%BE/FpgWGNJUFL3RLGdOTtm3KzKIgpHL)

这是一个移动端页面的一部分，要求全屏里面正好三张图片，左右图片宽度是相等的，第一个图片和第三个图片下面要对齐，图片之间的间距为10px。鉴于移动端的屏幕大小不等，所以使用定宽不合适。


```
*{
  box-sizing: border-box;
}

.wrap{
  overflow:hidden;
  background-color: #efefef;
}

// 实现左右两边各50%
.left,.right{
  float: left;
  width: 50%;
  padding: 10px;
}

.left{
  padding-right: 5px;
}
.right{
  padding-left: 5px;
}

// 实现高和宽度相等
// padding-top: 100%; 是相对于容器宽度的100%，即撑满了整个容器，高度由padding-top撑满，正好也是宽度
.inner{
  padding-top: 100%;
  position:relative;  
}

img{
  width: 100%;
  vertical-align: middle;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
}

.right-top{
  height:67%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.right-bottom{
  height:33%;
  position: absolute;
  top: 67%;
  width: 100%;
  padding-top: 10px;
}

.bottom-inner{
  height:100%;
  position:relative;
}
```

### 7. 其他方法考虑

+ 是不是可以用rem、em；让宽和高正好比例是16：9

+ 是不是可以用vw单位

### 8. demo

[demo]()

### 8. 总结

padding的百分比是按照容器宽度计算

### 9.参考资料

[css中如何做到容器按比例缩放](http://imweb.io/topic/555a92f76da9e441601d6e94)

[Creating Intrinsic Ratios for Video](https://alistapart.com/article/creating-intrinsic-ratios-for-video)

[demo](http://output.jsbin.com/boyuzo/1/)




