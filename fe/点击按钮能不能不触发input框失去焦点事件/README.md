## 点击按钮能不能不触发input框失去焦点事件？

> 左鹏飞  2017.12.19

### 1. 背景

```
<input type="text"/>
<button>按钮</button>
```

当前input设置了失去焦点事件; input在获得焦点状态，当我点击按钮能不能不触发input失去焦点事件？


### 2. 解决思路

当我们点击按钮的时候，文本框失焦，这是浏览器的默认事件。当你点击按钮的时候，会触发按钮的touchstart/mousedown事件，touchstart/mousedown事件的默认行为是使除了你点击的对象之外的有焦点的对象失去焦点。所以只要在touchstart/mousedown事件中阻止默认事件发生就可以了！


```
// html
<input type="text" autofocus="autofocus">
<button>点击我文本输入框不会失去焦点</button>

// javascript
var btn = document.querySelector('button')
btn.addEventListener('touchstart', function(event) {
	event.preventDefault()
})

```