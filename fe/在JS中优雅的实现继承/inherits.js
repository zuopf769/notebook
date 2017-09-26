/**
 * 
 * @file  inherits
 * @author  zuopengfei01
 * 
 */

/**
 * 为类型构造器建立继承关系
 *
 * @param {Function} subClass 子类构造器
 * @param {Function} superClass 父类构造器
 * @return {Function}
 */
function inherits(subClass, superClass) {
    var Empty = function () {};
    Empty.prototype = superClass.prototype;
    // 采用空函数的形式避免new superClass的实例时，产生更大的内存开销
    var proto = subClass.prototype = new Empty();

    var selfPrototype = subClass.prototype;
    for (var key in selfPrototype) {
        if (selfPrototype.hasOwnProperty(key)) {
            proto[key] = selfPrototype[key];
        }
    }
    subClass.prototype.constructor = subClass;

    return subClass;
}






