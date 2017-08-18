# 队列

## api

### 入对

 `add`
 
### 对尾删除

`dequeue`

### 下一个函数出队并且执行

`next`

### 全部函数出队并且一一执行

`flush`


### 清空队列

`clear`

### 判空

`empty`

### 移除指定队列中的函数

`remove`

### 把某函数移到对列头

`promote`

### 暂停

`pause`

### 执行下一个函数

`run`

## 实例： ajaxQueue

```
var ajaxQueue = (function() {
    var ajax = T.ajax.request,
        q = new queue(),
        o = ['onsuccess', 'onfailure'];
    return function(url, options) {
        T.array.each(o, function(item) {
            var r = options[item];
            if (r) {
                options[item] = function() {
                    var args = [].slice.call(arguments, 0);
                    r.apply(null, args);
                    // q.paused = false;
                    // q.next();
                    q.run();
                };
            }
        });
        options.noCache = false;
        q.add(function() {
            q.pause();
            ajax(url, options);
        });
        q.flush();
        return arguments.callee;
    };
})();

```