/**
 * 遍历数组中所有元素
 * @name each 
 * @function
 * @grammar each(source, iterator[, thisObject])
 * @param {Array} source 需要遍历的数组
 * @param {Function} iterator 对每个数组元素进行调用的函数，该函数有两个参数，第一个为数组元素，第二个为数组索引值，function (item, index)。
 * @param {Object} [thisObject] 函数调用时的this指针，如果没有此参数，默认是当前遍历的数组
 * @remark
 * each方法不支持对Object的遍历,对Object的遍历使用object.each 。
 * @shortcut each
 * @meta standard
 *             
 * @returns {Array} 遍历的数组
 */
var each = function (source, iterator, thisObject) {
    var returnValue, item, i, len = source.length;
    
    if ('function' == typeof iterator) {
        for (i = 0; i < len; i++) {
            item = source[i];
            //TODO
            //此处实现和标准不符合，标准中是这样说的：
            //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
            returnValue = iterator.call(thisObject || source, item, i);
    
            if (returnValue === false) {
                break;
            }
        }
    }
    return source;
};

/**
 * 移除数组中的项
 * @name remove
 * @function
 * @grammar remove(source, match)
 * @param {Array} source 需要移除项的数组
 * @param {Any} match 要移除的项
 * @meta standard
 * @see removeAt
 *             
 * @returns {Array} 移除后的数组
 */
var remove = function (source, match) {
    var len = source.length;
        
    while (len--) {
        if (len in source && source[len] === match) {
            source.splice(len, 1);
        }
    }
    return source;
};

/**
 * 判断目标参数是否为function或Function实例
 * @name isFunction
 * @function
 * @grammar isFunction(source)
 * @param {Any} source 目标参数
 * @version 1.2
 * @meta standard
 * @returns {boolean} 类型判断结果
 */
var isFunction = function (source) {
    // chrome下,'function' == typeof /a/ 为true.
    return '[object Function]' == Object.prototype.toString.call(source);
};


/**
 *  队列
 */
var queue = function() {
    // 初始化队列
    this.q = [];
    this.paused = false;
    this._inProgress = false;
};

queue.prototype = {
    // 入对
    add: function() {
        var me = this;
        each(arguments, function(item) {
            if (isFunction(item)) {
                me.q.push(item);
            }
        });
        return this;
    },
    // 对尾删除
    dequeue: function() {
        if (!this.empty()) {
            this.q.pop();
        }
        return this;
    },
    // 下一个函数出队并且执行
    next: function() {
        if (this.empty() || this.paused) {
            return;
        }
        this._inProgress = true;
        this.q.shift().apply(this);
        return this;
    },
    // 全部函数出队并且一一执行
    flush: function() {
        while (!this.empty() && !this.paused) {
            this.next();
        }
        return this;
    },
    // 清空队列
    clear: function() {
        this.q.length = 0;
        return this;
    },
    // 判空
    empty: function() {
        if (this.q.length === 0) {
            this._inProgress = false;
            return true;
        }
        return false;
    },
    // 移除指定队列中的函数
    remove: function(fn) {
        remove(this.q, fn);
        return this;
    },
    // 把某函数移到对列头
    promote: function(fn) {
        this.remove(fn);
        this.q.unshfit(fn);
        return this;
    },
    // 暂停
    pause: function() {
        this.paused = true;
        return this;
    },
    // 执行下一个函数
    run: function() {
        this.paused = false;
        this.next();
        return this;
    }

};
