## 基于用户行为预测的无延迟菜单切换

### 需求一

1. 在一级菜单中上下快速滑动，能快速切换一级菜单相应的二级菜单


2. 从一级菜单中滑入弹出的相应二级菜单中时，不能触发其他一级菜单的切换；因为两点之间的距离，肯定是斜着移入二级菜单中；而不是先平移，移入二级菜单中，再找到相应的二级子菜单


### 解决思路

1. 延迟执行二级菜单的show, 如果移入二级菜单，那么就不show相应的一级菜单的二级菜单


延迟执行二级菜单的show

```
setTimeout(function(){
   	
   activeRow.removeClass('active')
   activeMenu.addClass('none')

   activeRow= $(e.target)
   activeRow.addClass('active')
   activeMenu=$('#'+activeRow.data('id'))
   activeMenu.removeClass('none')
   
   
   },300)

```

记录一个变量来控制，鼠标是否在二级子菜单中

```
	var mouseInSub = false;
	sub.on("mouseenter",function(e){
		mouseInSub = true;
	}).on('mouseleave',function(e){
		mouseInSub = false;
	})

```

如果鼠标在二级子菜单中，则return掉之前的延迟timmer， 不执行
```
setTimeout(function(){

   	if(mouseInSub){
   		return
   	}
   	
   activeRow.removeClass('active')
   activeMenu.addClass('none')

   activeRow= $(e.target)
   activeRow.addClass('active')
   activeMenu=$('#'+activeRow.data('id'))
   activeMenu.removeClass('none')
   
   
   },300)
```

### 需求二

1. 在一级菜单中上下快速滑动，只show最后一次鼠标位置处的一级菜单的二级菜单

2. 从一级菜单中滑入弹出的相应二级菜单中时，不能触发其他一级菜单的切换；因为两点之间的距离，肯定是斜着移入二级菜单中


### 解决思路

debounce去抖技术

先清除上次未执行的定时器，保证只执行最后一个定时器

```
//setTimeout设置延迟
//debounce去抖技术
if(timer){
   	clearTimeout(timer);
}
```

最后一个定时器执行完时，清除自己

```
timer =setTimeout(function () {
   	if(mouseInSub){
   		return
   	}
    activeRow.removeClass('active')
    activeMenu.addClass('none')

    activeRow= $(e.target)
    activeRow.addClass('active')
    activeMenu=$('#'+activeRow.data('id'))
	activeMenu.removeClass('none')
	
    timer=null;
}, 300);
```

### 需求三

上面引入了延迟，会导致在一级菜单中上下快速滑动，不能迅速的切换相应的二级菜单

那咋办呢？

能既能保证从一级菜单中滑入弹出的相应二级菜单中时，不能触发其他一级菜单的切换；又能保证一级菜单中上下快速滑动，迅速的切换相应的二级菜单么？



#### 基于用户行为预测的切换技术

+ 跟踪鼠标的移动

在document上绑定mousemove事件，记录最近三次次的坐标, 大于三个记录，出队列。

```
var mouseTrack = []
var moveHanlder=function(e){
    mouseTrack.push({
    	x: e.pageX,
    	y: e.pageY
    })

    if(mouseTrack.length>3){
    	mouseTrack.shift()
    }
}
```
+ 用鼠标当前位置，和鼠标上一次位置与子菜单上下边缘形成的三角形区域进行比较。

如果当期位置在三角形区域内，则表明用户向去点击二级菜单，否则就是向上下切换一级菜单

如图所示：


+ 如何比较
	+ 向量：Vab=Pb-Pa
	向量即为点b和点a的x、y的差

	```
	function vector(a,b) {
		return {
			x:b.x-a.x,
			y:b.y-a.y
		}
	}
	```
	+ 二维向量叉乘公式：
	  a(x1,y1)*b(x2,y2)=x1*y2-x2*y1
	  
	  ```
	  function vectorProduct(v1,v2) {
			return v1.x * v2.y-v2.x * v1.y;
	  }
	  
	  ```
	+ 用叉乘法判断点在三角形内
	
	计算当前鼠标的坐标、上次鼠标的坐标、二级菜单的顶部和底部坐标的向量的差乘

	```
	function isPointInTrangle(p,a,b,c){
		var pa=vector(p,a);
		var pb=vector(p,b);
		var pc=vector(p,c);
		
		var t1=vectorProduct(pa,pb);
		var t2=vectorProduct(pb,pc);
		var t3=vectorProduct(pc,pa);
		// t1  t2 t3的结果符号相同，证明点在三角形内部
		return sameSign(t1,t2)&&sameSign(t2,t3);
	}
	```
	
	a异或b，二进制数的首位表示符号位; 如果a和b的符号位相同那么就得0，及为正。
	
	```
	按位运算符 异或
	0 ^ 1 得 1
	1 ^ 1 得 0
	0 ^ 0 得 0
	1 ^ 0 得 1
	```
	
	```
	function sameSign(a, b) {
		return (a ^ b) >= 0;
	}
	```













