/**
 * @desc 减少执行频率, 在指定的时间内, 多次调用，只会执行一次。
 * **options:**
 * - ***func***: 被稀释的方法
 * - ***wait***: 延时时间
 * - ***immediate***: 指定是在开始处执行，还是结束是执行, true:start, false:end
 *
 * 非at_begin模式
 * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
 *                         X                                X</code>
 * at_begin模式
 * <code type="text">||||||||||||||||||||||||| (空闲) |||||||||||||||||||||||||
 * X                                X                        </code>
 *
 * @grammar debounce(func, delay[, at_begin]) ⇒ function
 * @name debounce
 * @example var touchmoveHander = function(){
 *     //....
 * }
 * //绑定事件
 * $(document).bind('touchmove', debounce(touchmoveHander, 250));//频繁滚动，只要间隔时间不大于250ms, 在一系列移动后，只会执行一次
 *
 * //解绑事件
 * $(document).unbind('touchmove', touchmoveHander);//注意这里面unbind还是touchmoveHander,而不是$.debounce返回的function, 当然unbind那个也是一样的效果
 */

function debounce(func, delay, immediate) {

    var timer;
    var delay = delay || 250;
    
    // 否是立刻执行: 
    // true则不用等delay后才执行，而是立即执行； 然后每隔delay后再执行一次
    // false则表示一开始不执行，等delay后才执行第一次；然后每隔delay后再执行一次
    var immediate = immediate || false;

    // func执行后的返回值
    // 但是当immediate为false的时候，因为使用了setTimeout，我们将 func.apply(context, args)的返回值赋给变量，最后再 return 的时候，值将会一直是 undefined，
    // 所以我们只在 immediate为true 的时候返回函数的执行结果。
    var result;

    var debounced = function () {

        // 上下文
        var context = this;
        // 参数
        // JavaScript在事件处理函数中会提供事件对象event
        var args = arguments;

        // 如果有定时器未执行就清空，保证只执行最后一个定时器
        if (timer) clearTimeout(timer);

        // 立即执行
        if (immediate) {
            // 如果已经执行过，不再执行
            var callNow = !timer;
            timer = setTimeout(function(){
                timer = null;
            }, delay);
            if (callNow) result = func.apply(context, args);
        }
        else {
            timer = setTimeout(function(){
                func.apply(context, args);
                // 保证最后一次函数执行完毕清空定时器
                time= null;
            }, delay);
        }

        return result;
    };

    // 取消 debounce 函数
    debounced.cancel = function() {
        clearTimeout(timer);
        timer = null;
    };

    return debounced;
};
