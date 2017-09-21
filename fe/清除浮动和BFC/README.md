## 清除浮动和BFC


> [左鹏飞](https://github.com/zuopf769) 2017.09.21


### 1. 为什么BFC能达到“清浮动”效果

BFC有三个特性

+ BFC会阻止垂直外边距（margin-top、margin-bottom）折叠

> 按照BFC的定义，只有同属于一个BFC时，两个元素才有可能发生垂直Margin的重叠，这个包括相邻元素，嵌套元素，只要他们之间没有阻挡(例如边框，非空内容，padding等)就会发生margin重叠。

> 因此要解决margin重叠问题，只要让它们不在同一个BFC就行了，但是对于两个相邻元素来说，意义不大，没有必要给它们加个外壳，但是对于嵌套元素来说就很有必要了，只要把父元素设为BFC就可以了。这样子元素的margin就不会和父元素的margin发生重叠了。

+ BFC不会重叠浮动元素

+ BFC可以包含浮动


我们可以利用BFC的第三条特性来“清浮动”，这里其实说清浮动已经不再合适，应该说包含浮动。也就是说只要父容器形成BFC就可以，简单看看如何形成BFC

+ float为 left|right
+ overflow为 hidden|auto|scroll
+ display为 table-cell|table-caption|inline-block
+ position为 absolute|fixed

我们可以对父容器添加这些属性来形成BFC达到“清浮动”效果

### 2. BFC清除浮动的后果


+ 利用float来使父容器形成BFC,父容器高度没有塌陷，但是长度变短了，因为div应用float后会根据内容来改变长度


+ overflow属性会影响滚动条


+ position会改变元素的定位方式，这是我们不希望的


+ display这几种方式依然没有解决低版本IE问题


### 3. IE上的BFC——hasLayout

在IE6、7内有个hasLayout的概念，很多bug正式由hasLayout导致的，当元素的hasLayout属性值为false的时候，元素的尺寸和位置由最近拥有布局的祖先元素控制。当元素的hasLayout属性值为true的时候会达到和BFC类似的效果，元素负责本身及其子元素的尺寸设置和定位。


怎么使元素hasLayout为true

+ position: absolute 
+ float: left|right
+ display: inline-block
+ width: 除 “auto” 外的任意值
+ height: 除 “auto” 外的任意值
+ zoom: 除 “normal” 外的任意值
+ writing-mode: tb-rl
+ 在IE7中使用overflow: hidden|scroll|auto 也可以使hasLayout为true


### 4.清除浮动的终极方案

+ 在IE+、现代浏览器上使用伪元素
+ 在IE6、7使用hasLayout


具体应该使用哪种方式来使元素hasLayout为true呢？相对而言zoom：1比较好，因为不会造成其它影响。


```
.floatfix{
    *zoom:1;
}
.floatfix:after{
    content:"";
    display:table;
    clear:both;
}
```


### 5. 总结


虽然我们得出了一种浏览器兼容的靠谱解决方案，但这并不代表我们一定得用这种方式，很多时候我们的父容器本身需要position：absolute等形成了BFC的时候我们可以直接利用这些属性了，大家要掌握原理，活学活用。总而言之清理浮动两种方式

+ 利用 clear属性，清除浮动
+ 使父容器形成BFC

