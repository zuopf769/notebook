# 有了white-space:nowrap；妈妈再也不担心我不会横向滚动布局了


## 1. 背景

对于多个元素同在同一行的布局，比较常见的是轮播：

![轮播]()

还有就是二级分类菜单：

![例子一]()

![例子二]()


下面我将探讨这这一布局的做法：首先约定html结果如下：

```
div.wrap
	div.row
	  div.col
	  div.col
	  div.col
  ...
```

## 2. 计算宽度


设定`div.row`的宽度为`div.col`宽度`*``div.col`的个数，然后设置`div.col`为`float:left`或`display:inline-block`


### 2.1 `float`大法

对于 `float:left`, `div.row` 需要清除浮动。

+ 优点：兼容性好，无须清除`div.col`直接的间隙，因为浮动后的元素会一直与当前行框（line box）顶部对齐，vertical-align对齐无效。
+ 缺点：要计算div.row的宽度。

### 2.2 `inline-block`大法


对于`display:inline-block`，需要压缩html或者为`div.row`设置`font-size:0`以去除`div.col`之间的水平间隙，后者也顺便去除了垂直方向的间隙（line-height为相对单位时，其最终值为line-height值*font-size）。对于前者，还有垂直方面的间隙未去除，我们可以为`div.col`设置 `vertical-align:top` 或为`div.row`设置 `line-height:0`。推荐前者（即vertical-align），因为当 `div.col` 高度不相等时，会按顶部对齐，当然你也可以bottom或middle。

当然，如果`div.col`内有行内元素或`inline-block`元素，它们会继承父元素的`font-size`与`line-height`，因此需要重新设置`font-size`和`line-height`，以覆盖`div.row`对应的值。



## 3. white-space:nowrap

```
*{
    margin: 0;
    padding: 0;
}

.wrap {
	width: 200px;
	height: 100px;
	overflow-x: auto;
	overflow-y: hidden;
}
.row{
    white-space: nowrap; // 让div.col放置在同一行
    background-color: rgb(0,0,0); // 背景色，以方便观察
    font-size: 0; // 去除水平+垂直间隙
}
.col{
    display: inline-block;
    *display: inline; // 兼容IE 6/7，模拟inline-block效果
    *zoom: 1; // 兼容IE 6/7，模拟inline-block效果
    width: 20px; 
    margin-right: 30px;
    height: 100px;
    background-color: red;
    font-size: 14px; // 覆盖父元素的font-size
    vertical-align: top; // 向上对齐，同时去除垂直间隙
}
```

黑色背景是div.row，红色背景是 div.col。

可看出这与与应用了white-space:nowrap的文本容器效果一样。

做法二的好处：兼容性好（IE5都正常），无须计算宽度，可任意放多个 div.col，而 div.row 的宽度等于其父元素的宽度。




