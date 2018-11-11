## 语法

```
arr.reduce(function(prev,cur,index,arr){
...
}, init);

```


arr 表示将要原数组;

prev 表示上一次调用回调时的返回值；或者初始值init：当没有传入初始值时，prev是从数组中第一个元素开始的，当传入初始值init后,第一个prev将是init，cur将是数组中的第一个元素。

cur 表示当前正在处理的数组元素;

index 表示当前正在处理的数组元素的索引，若提供 init 值，则索引为0，否则索引为1;

init 表示初始值。

其实常用的参数只有两个：prev 和 cur。


## 实例

### 求数组项之和
```
var arr = [3,9,4,3,6,0,9];
```

```
var sum = arr.reduce(function (prev, cur) {
    return prev + cur;
},0);
```
由于传入了初始值0，所以开始时prev的值为0，cur的值为数组第一项3，相加之后返回值为3作为下一轮回调的prev值，然后再继续与下一个数组项相加，以此类推，直至完成所有数组项的和并返回。


### 求数组项最大值

```
var arr = [3,9,4,3,6,0,9];
```

```
var max = arr.reduce(function (prev, cur) {
    return Math.max(prev,cur);
});
```

由于未传入初始值，所以开始时prev的值为数组第一项3，cur的值为数组第二项9，取两值最大值后继续进入下一轮回调。


## 合并二维数组

```
var red = [[0, 1], [2, 3], [4, 5]].reduce(function(a, b) {
 return a.concat(b);
}, []);
console.log(red)
[0, 1, 2, 3, 4, 5]
```


### 数组去重
```
var arr = [3,9,4,3,6,0,9];
```

```
var newArr = arr.reduce(function (prev, cur) {
    prev.indexOf(cur) === -1 && prev.push(cur);
    return prev;
},[]);
```

初始化一个空数组

将需要去重处理的数组中的第1项在初始化数组中查找，如果找不到（空数组中肯定找不到），就将该项添加到初始化数组中

将需要去重处理的数组中的第2项在初始化数组中查找，如果找不到，就将该项继续添加到初始化数组中

……

将需要去重处理的数组中的第n项在初始化数组中查找，如果找不到，就将该项继续添加到初始化数组中

将这个初始化数组返回


### 数组去重二


```
var arr = ["apple","orange","apple","orange","pear","orange"];
function getWordCnt(){
  return arr.reduce(function(prev,next){
    prev[next] = (prev[next] + 1) || 1;
    return prev;
  },{});
}
console.log(getWordCnt());
{apple: 2, orange: 3, pear: 1}

```


## 其他方法

1. reduceRight()
该方法用法与reduce()其实是相同的，只是遍历的顺序相反，它是从数组的最后一项开始，向前遍历到第一项。

2. forEach()、map()、every()、some()和filter()
详情请戳→[简述forEach()、map()、every()、some()和filter()的用法](https://www.jianshu.com/p/b728253c90b5)


## 总结

reduce() 是数组的归并方法，与forEach()、map()、filter()等迭代方法一样都会对数组每一项进行遍历，但是reduce() 可同时将前面数组项遍历产生的结果与当前遍历项进行运算，这一点是其他迭代方法无法企及的




