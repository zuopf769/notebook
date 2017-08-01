## PC端画如何一颗三级树状结构图

最近要在PC端画一颗最多只有三层的三级树；以及只有一个节点，二级只有一个节点，
三级最多有三个节点。

### 需求要点
 
 + 最多三层
 + 左缩进表示一二三级
 + 文本节点字数超过20个字截断处理，文字节点的高度一致
 + 树结构整体在卡片中居中展现
 

效果图示意图如下：
![Alt text](/path/to/img.jpg)

### 技术选型

#### 1. SVG or Canvas

> IE8不支持

#### 2. SVG + VML

> 可以实现, 兼容IE8

#### 3. 纯DIV border

> 可以实现，无兼容性问题


其实难点在于画线。不过此次需求都是直线+ 90度折线，用div的border实现起来也不难，所有选定了方案三。


### 实现方案

#### 1. 确定树形结构的层级和类型

层级很好确定

```javascript
// 是否有父节点 1：含有父节点 0：不含父节点
this.hasParent = this.data.parent ? 1 : 0;
// 是否有子节点 1：含有子节点 0：不含子节点
this.hasChildren = this.data.children && this.data.children.length ? 1 : 0;
// 子节点的个数
this.childerenLength = this.hasChildren && this.data.children.length > 3 ? 3 : this.data.children.length;

// 树的层级 1：层  2：两层  3： 三层
this.level = 1 + this.hasParent + this.hasChildren;
```

确定树形结构类型

```javascript
/*
 * 初始化卡片类型
 * return {number}
 *     + 3: 当前卡片含有父节点、子节点、当前节点
 *     + 2：当前卡片含有父节点、当前节点
 *     + 1：当前卡片含有子节点、当前节点
 *     + 0：当前卡片只含有当前节点（此次业务应该不包含这种情况）
 */
initCardType: function () {
    var cardType = -1;
    switch (this.level) {
        case 3:
            cardType = 3;
            break;
        case 2:
            cardType = (me.hasParent === 1) ? 2 : 1;
            break;
        case 1:
            cardType = 0;
            break;
        default:
            break;
    }
    return cardType;
},
```
 
#### 2. 如何整体居中？

+ 每个节点的宽度是多少？怎么计算

思路一： 创建个1个汉字的div，字号、字体、padding、边框都按照实际的需求设置，然后计算一个汉字的宽度，然后根据字符数来算即可。

但是英文怎么办？可以根据字节来计算。哎太麻烦。

思路二：页面中弄个隐藏的DIV，dom结构样式和真实的文本节点都一样，每个节点都需要innerHTML到临时的dom容器内，就可以计算出来真实的宽度了

```javascript
<div class="text-node-temp">
    <a class="text-wrap">
        <span class="text-node">含有子节点含有子节点含有子节点含有子节点含有子节点</span>
    </a>
</div>
```


+ 要想实现整体居中，就需要计算每一层级的最大宽度，整体树形结构的最大宽度


第一层级的宽度 = 第一层级的文本节点的宽度
第二层级的宽度 = 第二层级与第一层级的缩进 + 第二层级的文本节点的宽度
第三层级的宽度 = 第二层级与第一层级的缩进 + 第三层级与第二层级的缩进 + 第三层级的文本节点的最大宽度



第三层级的文本节点的最大宽度

```javascript

// 含有子节点
var childrenNodeMaxWidth = 0;
if (this.hasChildren) {
    $.each(this.nodes.children, function(index, item) {
        var tempWidth = me.tempTextNode.text(item.ent_name).parent('.text-wrap').outerWidth();
        item.width = tempWidth;
        if (tempWidth > childrenNodeMaxWidth) {
            childrenNodeMaxWidth = tempWidth;
        }
    });
}
```

根据树形结构类型计算最终树形结构的最大宽度

```javascript
var kgTreeWidth = 0;
switch (this.cardType) {
    case 1:
        kgTreeWidth = Math.max(curNodeWidth, childrenNodeMaxWidth + this.offsetLeftLevel2);
    case 2:
        kgTreeWidth = Math.max(parentNodeWidth, curNodeWidth + this.offsetLeftLevel2);
    case 3:
        kgTreeWidth = Math.max(parentNodeWidth, curNodeWidth + this.offsetLeftLevel2, childrenNodeMaxWidth + this.offsetLeftLevel2 + this.offsetLeftLevel3);
    default:
        break;
}

return kgTreeWidth;
```


+ 要想实现整体居中，就需要整体的高度

```javascript
// 计算整体高度
calTreeHeight: function() {
    var kgTreeHeight = 0;
    switch (this.level) {
        case 2:
            kgTreeHeight =  this.textNodeHeight * 2 + this.levelOffsetHeight;
            break;
        case 3:
            kgTreeHeight =  this.textNodeHeight * 2 + this.levelOffsetHeight * 2 +  this.textNodeHeight * this.childerenLength + this.level3OffsetHeight * (this.childerenLength - 1);
            break;
        default:
            break;
    }
    return kgTreeHeight;
},
```

由于文本节点的高度是固定的，此外层级之间的间隔是知道的，所以计算很方便。


+ 要想实现整体居中，就需要整体的高度

```javascript
// 容器宽高
this.containerWidth = this.container.innerWidth();
this.containerHeight = this.container.innerHeight();
// 计算树内容区的宽度
this.contentWidth = this.calTreeWidth();
// 计算树内容区的高度
this.contentHeight = this.calTreeHeight();
debugger;
this.contentOffsetLeft = (this.containerWidth - this.contentWidth) / 2;
this.contentOffsetTop = (this.containerHeight - this.contentHeight) / 2;
```
知道容器的宽高、刚才也计算出来了树形结构的宽高，那就知识树形结构的偏移量了。


#### 3. 画文本节点

画文本节点就需要知道相对于容器的偏移量

```javascript
// 画文本节点
drawTextNodes: function () {
    var me = this;
    $.each(me.nodes, function (index, item) {
        switch (index) {
            case 'parent':
                me.drawParentTextNode(item); 
                break;
            case 'cur':
                me.drawCurTextNode(item); 
                break;
            case 'children':
                me.drawChildrenTextNode(item); 
                break;
            default:
                break;
        }
    });
    this.container.append(this.textNodes);
}
```
如果有父亲节点则父亲节点都在第一层

横坐标X: 即居中内容区左偏移量
纵坐标Y: 即居中内容区顶部偏移量

---

```javascript
// 画父节点(父亲节点肯定是在第一层)
drawParentTextNode: function (data) {
    var parentNode = data;
    parentNode.height = this.textNodeHeight;
    parentNode.X = this.contentOffsetLeft;
    parentNode.Y = this.contentOffsetTop;
    parentNode.coords = this.setFiveCoords(parentNode);
    
    this.textNodes += this.createTextNodeStr(parentNode);

},
```

当前节点则要根据树形结构类型来区分

如果没有父节点时，那么当前节点就在第一层，原理同上
如果存在父节点时，那么当前节点在第二层

横坐标X: 即居中内容区左偏移量 + 第二层级与第一层级的缩进
纵坐标Y: 即居中内容区顶部偏移量 + 第二层级与第一层级的缩进

```javascript
// 画当前节点
drawCurTextNode: function (data) {
    var curNode = data;
    curNode.height = this.textNodeHeight;
    if (this.cardType === 1) {
        curNode.X = this.contentOffsetLeft;
        curNode.Y = this.contentOffsetTop;
    }
    else if (this.cardType === 2 || this.cardType === 3) {
        curNode.X = this.contentOffsetLeft + this.offsetLeftLevel2;
        curNode.Y = this.contentOffsetTop + this.textNodeHeight + this.levelOffsetHeight;
    }
    curNode.coords = this.setFiveCoords(curNode);
    this.textNodes += this.createTextNodeStr(curNode);

},
```
---

子节点不是在第二层就是在第三层，而且都是左对齐的



如果有三层

横坐标X: 即居中内容区左偏移量 + 第二层级与第一层级的缩进 +  第三层级与第二层级的缩进
纵坐标Y: 即居中内容区顶部偏移量 + 文本节点的高度 * 2 + 层级之间的间距*2 + (me.textNodeHeight + me.level3OffsetHeight) * index)


```javascript
// 画子节点
drawChildrenTextNode: function(data) {
    var me = this;
    var childrenNode = data;
    var childLength = childrenNode.length;
    var X = this.contentOffsetLeft;
    var Y = this.contentOffsetTop;
    if (this.cardType === 1) {
        X += this.offsetLeftLevel2;
        Y += this.textNodeHeight;
    }
    else if (this.cardType === 3) {
        X += (this.offsetLeftLevel2 + this.offsetLeftLevel3);
        Y += (this.textNodeHeight *2 + this.levelOffsetHeight * 2);
    }

    $.each(childrenNode, function(index, item) {
        item.X = X;
        item.Y = Y + ((me.textNodeHeight + me.level3OffsetHeight) * index);
        item.height = me.textNodeHeight;
        item.coords = me.setFiveCoords(item);
        me.textNodes += me.createTextNodeStr(item);
    });
}
```
#### 4. 给文本节点打坐标

影响坐标的因素包括：绝对偏移量X,Y；文本节点高度； 文本节点宽度

```


/*
 * setFourCoords: 给每一个文本节点打上五个坐标点（画线条的时候会需要这些坐标点）
 * + 从上顺时针转分别为：c0,c1,c2,c3,c4
 */
setFiveCoords: function (obj) {
    var c0 = [Math.floor(obj.X) + obj.width / 2, obj.Y];
    var c1 = [Math.floor(obj.X) + obj.width - 1, Math.floor(obj.Y) + obj.height / 2];
    var c2 = [Math.floor(obj.X) + obj.width / 2, obj.Y + obj.height];
    var c3 = [Math.floor(obj.X) + this.level1NodePathoutOffset, obj.Y + obj.height];
    var c4 = [obj.X, Math.floor(obj.Y) + obj.height / 2];
    return {
        c0: c0,
        c1: c1,
        c2: c2,
        c3: c3,
        c4: c4
    };
},
```

#### 5. 给文本节点连线

+ 把线条分为了两类： 竖横   横
+ 用div的border来实现包括两个class border-left-bottom和border-bottom
+ 文本节点的线条out出口坐标都已经计算好了，是 c3
+ in入口坐标也已经计算好了，是 c4
+ 宽度也可以通过out出口坐标和入口坐标计算而得

```javascript
// 画路径
drawPaths: function () {
    debugger;
    if (this.hasParent) {// 从父亲节点出来的路径
        this.drawParentPath();
    }
    if (this.hasChildren) {// 从当前节点出来的路径
        this.drawCurPath();
    }
    this.container.append(this.paths);
},
```

父节点的连线肯定是连到了当前节点上

```javascript
// 画父节点到当前节点的线条路径
drawParentPath: function () {
    var parentNode = this.nodes.parent;
    var curNode = this.nodes.cur;

    this.paths += this.createPathStr(parentNode, curNode, 'border-left-bottom');
}
```

当前节点的连线思路是：先和最后一个三级节点连一个border-left-bottom，其他层级的连一个border-bottom

```javascript
// 画当前节点到各子节点的线条路径
drawCurPath: function () {
    var curNode = this.nodes.cur;
    var me = this;
    var childrenLength = me.nodes.children.length;
    var borderType = 'border-bottom';
    $.each(me.nodes.children, function(index, item) {
        if (index === childrenLength - 1) {
            borderType = 'border-left-bottom';
        }
        me.paths += me.createPathStr(curNode, item, borderType);
    });
},
```

### 总结：

+ 采用了给div添加border的思路画线条
+ 给每个文本节点打好坐标，用于后续的连线
+ 给一个飘到屏幕外面的容器来计算每个文本节点的实际宽高
+ 想要居中就需要计算树整体的宽高



 














