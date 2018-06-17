
[左鹏飞](https://github.com/zuopf769) 2018.6.17

## 什么是外边距重叠

外边距重叠指的是，当两个垂直外边距相遇时，他们将合并形成一个外边距。


## 垂直相领的两个盒子外边距合并的规则

+ 如果两个外边界值都为正，则两个盒子垂直方向的距离是两个外边距值中的最大的值。

+ 如果一正一负，则是正边界值减去负边距值中的绝对值。

+ 如果都是负数，则用零减去绝对值最大的负边距（只有外边距才可以为负值，内边距不允许为负值）。


## 嵌套盒子（父子盒子）的外边距合并

一个元素包含在一个元素中时(假设没有内边距或边框把外边距分隔开)，他们的上、下外边距也会发生合并

```html
.div1 {
	width: 200px;
	height: 200px;
	background-color: red;
}

.div2 {
	width: 200px;
	height: 30px;
	background-color: blue;
	margin-top: 200px;
}

<div class="div1">
	<div class="div2"></div>
</div>
```
> + 在控制台修改div2的margin-top会发现 div1会跟着div2的位置而移动，就是因为div1和div的上边距和div2的上边距发生了合并，他的上外边距也成了相应的值
> + 其实上面的div1的上外边距是取了它和div2中的最大值


## 单个空元素的顶边距和底边距重叠

假设有一个空元素，它有外边距，但是没有边框和填充；在这种情况下，顶边距和底边距就碰到了一起，他们也会发生重叠。

![](https://github.com/zuopf769/notebook/blob/master/fe/%E4%BB%80%E4%B9%88%E6%98%AF%E5%A4%96%E8%BE%B9%E8%B7%9D%E9%87%8D%E5%8F%A0%EF%BC%9F%E9%87%8D%E5%8F%A0%E7%9A%84%E7%BB%93%E6%9E%9C%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F/1529219277351.jpg)

## 外边距不重叠的情况


+ 水平margin永远不会重叠
+ 设置了overflow属性（visible除外）的元素和他的子元素之间的margin不会重叠
+ 设置了绝对定位（position:absolute）的盒模型，垂直margin不会被重叠，和子元素之间也不会重叠
+ 设置了display: inline-block的元素，垂直margin不会重叠，和子元素之间也不会重叠
+ 根元素（html）与body的margin不会重叠


## 防止外边距重叠的方法

+ 元素绝对定位，一般用在内层元素
+ 内层元素加float:left或者display:inline-block
+ 外层元素用padding加边距
+ 外层元素设置overflow:hidden
+ 内层元素透明边框 border: 1px solid transparent



##  相关推荐

[CSS外边距(margin)重叠及防止方法](https://github.com/zuopf769/notebook/tree/master/fe/CSS%E5%A4%96%E8%BE%B9%E8%B7%9D(margin)%E9%87%8D%E5%8F%A0%E5%8F%8A%E9%98%B2%E6%AD%A2%E6%96%B9%E6%B3%95)













