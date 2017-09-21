## CSS外边距(margin)重叠及防止方法


### 1. 什么是外边距(margin)重叠

外边距重叠是指两个或多个盒子(可能相邻也可能嵌套)的相邻边界(其间没有任何非空内容、补白、边框)重合在一起而形成一个单一边界。



### 2. 相邻marign重叠的问题


#### 2.1 示例

```
<style>
    *{
        margin:0;
        padding: 0;
    }
    .divout{
        width: 100px;
        height: 100px;
        background: yellow;
        margin-bottom: 50px;
        border: 1px solid black;
    }
    .divout1{
        width:50px;
        height: 50px;
        background: yellow;
        margin-top: 80px;
            /*float:left;*/
        /*position:absolute;*/
        border: 1px solid black;
    }
</style>
<body>
    <div class="divout">        
    </div>
    <div class="divout1">        
    </div>
</body>

```


#### 2.2 外边距重叠计算方式

+ 全部都为正值，取最大者；

![]()

+ 不全是正值，则都取绝对值，然后用正值的最大值减去绝对值的最大值；

![]()

+ 没有正值，则都取绝对值，然后用0减去最大值。

![]()

#### 2.3 解决办法

+ 底部元素设置为浮动 float:left;

![]()

+ 底部元素的position的值为absolute/fixed

![]()

+ 在设置margin-top/bottom值时统一设置上或下


### 3. 元素和父元素margin值问题

父元素无 border、padding、inline content 、 clearance时，子元素的margin-top/bottom会与父元素的margin产生重叠问题。

### 3.1 示例

```
<style>
    *{
        margin:0;
        padding: 0;
        color: black;
    }
    #parrent{
        width:300px;
        height:150px;
        margin-top: 20px;
        background:teal;
    }
    #box1{
        width:100px;
        height:100px;
        background:aqua;
        margin:100px 0;
    }
</style>
<body>
    <div id="parrent">
        <div id="box1">
        我是box1
        </div>
        我是内容
    </div>
</body>
```

### 3.2 解决办法

+ 外层元素添加padding
+ 外层元素 overflow:hidden;
+ 外层元素透明边框 border:1px solid transparent;
+ 内层元素绝对定位 postion:absolute:
+ 内层元素 加float:left;或display:inline-block;

