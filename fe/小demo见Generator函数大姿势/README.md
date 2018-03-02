## 小demo见Generator函数大姿势

### 1. 小demo

```
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

```
上面代码中，Generator函数封装了一个异步操作，该操作先读取一个远程接口，然后从JSON格式的数据解析信息。这段代码非常像同步操作，除了加上了yield命令。

```
var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});

```
上面代码中，首先执行Generator函数，获取遍历器对象，然后使用next方法（第二行），执行异步任务的第一阶段。由于 Fetch模块返回的是一个 Promise 对象，因此要用then方法调用下一个next方法。


### 2. 几个疑点

+ 在`then`中`return data.json();`后为啥还能接着下一个`then `？
+ `var result = yield fetch(url);`中`result`是如何获得的？`g.next(data);`的作用是什么？


#### 2.1 在`then`中`return data.json();`后为啥还能接着下一个`then `？

因为then总是返回Promise，xxx.then(a => a) 的效果实际上是 return new Promise(resolve => resolve(a))，这个过程由引擎隐式完成的

#### 2.2 `var result = yield fetch(url);`中`result`是如何获得的？`g.next(data);`的作用是什么？

 `var g = gen();var result = g.next();`执行`g.next()`后，只是执行了`fetch(url)`，并没有把返回值赋值给`result`

```
function* gen(x){
 	var y = yield x + 2;
  	console.log(y);
  	return y;
}
```

```
var a = gen(1);
a.next();
```

返回值是`{value: 3, done: false}`，每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句后面表达式的值，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。


并没有打印`console.log(y);`，因为程序碰到`yield`后就暂停执行了，所以不会赋值给`y`,所以`var y = yield x + 2;`不会执行


`
g.next(2) // { value: 2, done: true }
`

第二个next方法带有参数2，这个参数可以传入Generator函数，作为上个阶段异步任务的返回结果，被函数体内的变量 y 接收。因此，这一步的 value 属性，返回的就是2（变量 y 的值）。


对于传值下面这个demo最经典：

```

var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```

```
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
})
```

### 3. 总结
+ 调用 Generator 函数，会返回一个内部指针（即遍历器 ）g
+ Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象
+ 调用指针 g 的 next 方法，会移动内部指针
+ 每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句后面表达式的值，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。
+ 程序遇到yield命令就暂停，等到执行权返回，再从暂停的地方继续往后执行
+ next方法返回值的value属性，是Generator函数向外输出数据
+ next 方法还可以接受参数，这是向Generator函数体内输入数据


### 4. 后续思考——Generator 函数的自动执行

总不能手动的一步一步的调用`next`来执行`Generator `，tj大神的`co`解决了这个问题





