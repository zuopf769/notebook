## 前端全局变量检测工具

### 背景

在前端开法中向全局对象window上挂载变量，是坚决不允许的；如何避免呢？


### 全局变量检测工具使用方法


#### 1. 断点停住查找全局变量

+ 找不到的全局变量可以把名字设置到这里， 然后打开控制台， 刷新页面， 会自动在设置值的地方断点停住
+ 多个变量用空格分割即可

```
比如想找 varA  varB 这两个变量， 下面就配置为： var globalJsName = 'varA varB';
var globalJsName = 'a';
```

#### 2. 在控制台也可以测试 window.a = 1，也可以断点停住


#### 3. 控制台打印

```
console.error('globalDetect: window下有全局变量 ' + k + ' : ' + window[k]);
```

### 全局变量检测工具实现原理

#### 1. 利用Object.defineProperty来断点停住，只要window.xxx =  yyy全局变量，就会调到set处

```
function defineProperty(name) {
    if (!name) {
        return;
    }
    var vv;
    Object.defineProperty(window, name, {
        set: function (v) {
            vv = v;
            console.log('set window.' + name + ': ' + vv);
            debugger;
        },
        get: function () {
            console.log('get window.' + name + ': ' + vv);
            debugger;
            return vv;
        }
    });
}
```

#### 2. 变量window上的对象，只要不在白名单就认为是全局变量

```
 for (k in window) {
    // 不是window上的默认属性
    if (!map[k] && !whiteListMap[k] && !globalMap[k]) {
        // 不在白名单中
        if (inWhiteList(k, whiteList)) {
            // 记录命中白名单
            whiteListMap[k] = true;
            continue;
        }
        // 记录已经命中了全局变量
        globalMap[k] = true;
        console.error('globalDetect: window下有全局变量 ' + k + ' : ' + window[k]);
    }
}
```

### 4. 案例

[代码](https://github.com/zuopf769/notebook/blob/master/fe/%E5%89%8D%E7%AB%AF%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F%E6%A3%80%E6%B5%8B%E5%B7%A5%E5%85%B7/detectGlobalJs.js)
