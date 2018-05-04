## 利用rsync往线上测试机推送build后的代码

### 背景

在开发中我们通常会把前端的build后的代码推到测试环境供qa回归，

+ 通常的方案就是利用线上构造系统编译然后推送到测试环境；
+ 如果没有线上构造系统，也有人在本地编译构造提交到master，然后利用jekins拉去master的指定dist目录下的文件
+ 上面两种方案都比较正规军，如果只是用于qa完全可以直接推


### rsync

[rsync](https://www.npmjs.com/package/rsync)可以指定`source`和`destination`允许我们从本地往远程机器同步代码，正好能满足我们的需求


### 