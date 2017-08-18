/**
 * @author harttle(yangjvn@126.com)
 * @file underscore.js
 */

// eslint-disable-next-line
define(function (require) {
    /**
     * A lightweight underscore implementation.
     * 包括字符串工具、对象工具、函数工具、语言增强等。设计原则：
     * 1. 与 Lodash 重合的功能与其保持接口一致，
     *     文档: https://github.com/exports/exports
     * 2. Lodash 中不包含的部分，如有需要可联系 yangjvn14 (Hi)
     *     文档：本文件中函数注释。
     * @namespace underscore
     */

    var assert = require('./assert');
    var arrayProto = Array.prototype;
    var stringProto = String.prototype;
    var exports = {};

    /**
     * Get deep property by path
     *
     * @param {Object} obj The object to query with
     * @param {string} path A dot-delimited path string
     * @return {any} the value assiciated with path
     */
    function get(obj, path) {
        var ret = obj;
        (path || '').split('.').forEach(function (key) {
            ret = ret ? ret[key] : undefined;
        });
        return ret;
    }

    /**
     * Parse arguments into Array
     *
     * @private
     * @param {Array-like-Object} args the arguments to be parsed
     * @return {Array} argument as array
     */
    function getArgs(args) {
        args = toArray(args);
        args.shift();
        return args;
    }

    /**
     * 公有函数
     */

    /**
     * Creates an array of the own and inherited enumerable property names of object.
     *
     * @param {Object} object The object to query.
     * @return {Array} Returns the array of property names.
     * @memberof underscore
     */
    function keysIn(object) {
        return Object.keys(object);
    }

    /**
     * Iterates over own enumerable string keyed properties of an object and invokes iteratee for each property.
     * The iteratee is invoked with three arguments: (value, key, object).
     * Iteratee functions may exit iteration early by explicitly returning false.
     *
     * @param {Object} object The object to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @return {Object} Returs object.
     * @memberof underscore
     */
    function forOwn(object, iteratee) {
        object = object || {};
        for (var k in object) {
            if (object.hasOwnProperty(k)) {
                if (iteratee(object[k], k, object) === false) {
                    break;
                }
            }
        }
        return object;
    }

    /**
     * Converts value to an array.
     *
     * @param {any} value The value to convert.
     * @return {Array} Returns the converted array.
     * @memberof underscore
     */
    function toArray(value) {
        if (!value) {
            return [];
        }
        return arrayProto.slice.call(value);
    }

    /**
     * Iterates over elements of collection and invokes iteratee for each element.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     *
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @return {undefined} Just like Array.prototype.forEach
     * @memberof underscore
     */
    function forEach(collection, iteratee) {
        var args = getArgs(arguments);
        return arrayProto.forEach.apply(collection || [], args);
    }

    /**
     * Creates an array of values by running each element in collection thru iteratee.
     * The iteratee is invoked with three arguments: (value, index|key, collection).
     *
     * @param {Array|Object} collection The collection to iterate over.
     * @param {Function} iteratee The function invoked per iteration.
     * @return {Array} Returns the new mapped array.
     * @memberof underscore
     */
    function map(collection, iteratee) {
        if (isObject(collection)) {
            var ret = [];
            forOwn(collection, function () {
                ret.push(iteratee.apply(null, arguments));
            });
            return ret;
        }
        var args = getArgs(arguments);
        return arrayProto.map.apply(collection || [], args);
    }

    /**
     * Creates a slice of array from start up to, but not including, end.
     *
     * @param {Array} collection The array to slice.
     * @param {number} start The start position.
     * @param {number} end The end position.
     * @return {Array} Returns the slice of array.
     * @memberof underscore
     */
    function slice(collection, start, end) {
        var args = getArgs(arguments);
        return arrayProto.slice.apply(collection || [], args);
    }

    /**
     * This method is based on JavaScript Array.prototype.splice
     *
     * @param {Collection} collection the collection to be spliced
     * @return {Array} the spliced result
     * @memberof underscore
     */
    function splice(collection) {
        var args = getArgs(arguments);
        return arrayProto.splice.apply(collection || [], args);
    }

    /**
     * This method is based on JavaScript String.prototype.split
     *
     * @param {string} str the string to be splited.
     * @return {Array} Returns the string segments.
     * @memberof underscore
     */
    function split(str) {
        var args = getArgs(arguments);
        return stringProto.split.apply(str || '', args);
    }

    /**
     * Find and return the index of the first element predicate returns truthy for instead of the element itself.
     *
     * @param {Array} array The array to inspect.
     * @param {Function} [predicate=_.identity] The function invoked per iteration.
     * @param {number} [fromIndex=0] The index to search from.
     * @return {number} Returns the index of the found element, else -1.
     * @memberof underscore
     */
    function findIndex(array, predicate, fromIndex) {
        for (var i = fromIndex || 0; i < array.length; i++) {
            if (predicate(array[i], i, array)) {
                return i;
            }
        }
        return -1;
    }

    /**
     * The missing string formatting function for JavaScript.
     *
     * @param {string} fmt The format string (can only contain "%s")
     * @return {string} The result string.
     * @memberof underscore
     * @example
     * format("foo%sfoo", "bar");   // returns "foobarfoo"
     */
    function format(fmt) {
        return getArgs(arguments).reduce(function (prev, cur) {
            return prev.replace('%s', cur);
        }, fmt);
    }

    /**
     * Assigns own and inherited enumerable string keyed properties of source objects to
     * the destination object for all destination properties that resolve to undefined.
     * Source objects are applied from left to right.
     * Once a property is set, additional values of the same property are ignored.
     *
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @memberof underscore
     * @return {Object} Returns object.
     */
    function defaults() {
        return assign.apply(null, slice(arguments, 0).reverse());
    }

    /**
     * Checks if value is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, new Number(0), and new String(''))
     *
     * @param {any} value The value to check.
     * @return {boolean} Returns true if value is an object, else false.
     * @memberof underscore
     */
    function isObject(value) {
        var type = typeof value;
        return value != null && (type === 'object' || type === 'function');
    }

    /**
     * Checks if value is classified as a String primitive or object.
     *
     * @param {any} value The value to check.
     * @return {boolean} Returns true if value is a string, else false.
     * @memberof underscore
     */
    function isString(value) {
        return value instanceof String || typeof value === 'string';
    }

    /**
     * Uses indexOf internally, if list is an Array. Use fromIndex to start your search at a given index.
     * http://underscorejs.org/#contains
     *
     * @param {Array|string} list the list of items in which to find
     * @param {any} value the value to find
     * @param {number} fromIndex Optional, default to 0
     * @return {number} Returns true if the value is present in the list, false otherwise.
     * @memberof underscore
     */
    function contains(list, value, fromIndex) {
        if (fromIndex === undefined) {
            fromIndex = 0;
        }
        return list.indexOf(value, fromIndex) > -1;
    }

    /**
     * Checks if value is classified as a RegExp object.
     *
     * @param {any} value The value to check.
     * @return {boolean} Returns true if value is a RegExp, else false.
     * @memberof underscore
     */
    function isRegExp(value) {
        return value instanceof RegExp;
    }

    /**
     * Assigns own enumerable string keyed properties of source objects to the destination object.
     * Source objects are applied from left to right.
     * Subsequent sources overwrite property assignments of previous sources.
     *
     * Note: This method mutates object and is loosely based on Object.assign.
     *
     * @param {Object} object The destination object.
     * @param {...Object} source The source objects.
     * @return {Object} Returns object.
     * @memberof underscore
     */
    function assign(object, source) {
        object = object == null ? {} : object;
        var srcs = slice(arguments, 1);
        forEach(srcs, function (src) {
            assignBinary(object, src);
        });
        return object;
    }

    function assignBinaryDeep(dst, src) {
        if (!dst) {
            return dst;
        }
        forOwn(src, function (v, k) {
            if (isObject(v) && isObject(dst[k])) {
                return assignBinaryDeep(dst[k], v);
            }
            dst[k] = v;
        });
    }

    function assignBinary(dst, src) {
        if (!dst) {
            return dst;
        }
        forOwn(src, function (v, k) {
            dst[k] = v;
        });
        return dst;
    }

    /**
     * This method is like `_.defaults` except that it recursively assigns default properties.
     *
     * @param {Object} object The destination object.
     * @param {...Object} sources The source objects.
     * @return {Object} Returns object.
     * @memberof underscore
     */
    function defaultsDeep() {
        var ret = {};
        var srcs = slice(arguments, 0).reverse();
        forEach(srcs, function (src) {
            assignBinaryDeep(ret, src);
        });
        return ret;
    }

    /**
     * The inverse of `_.toPairs`; this method returns an object composed from key-value pairs.
     *
     * @param {Array} pairs The key-value pairs.
     * @return {Object} Returns the new object.
     * @memberof underscore
     */
    function fromPairs(pairs) {
        var object = {};
        map(pairs, function (arr) {
            var k = arr[0];
            var v = arr[1];
            object[k] = v;
        });
        return object;
    }

    /**
     * Checks if value is classified as an Array object.
     *
     * @param {any} value The value to check.
     * @return {boolean} Returns true if value is an array, else false.
     * @memberof underscore
     */
    function isArray(value) {
        return value instanceof Array;
    }

    /**
     * Checks if value is an empty object, collection, map, or set.
     * Objects are considered empty if they have no own enumerable string keyed properties.
     *
     * @param {any} value The value to check.
     * @return {boolean} Returns true if value is an array, else false.
     * @memberof underscore
     */
    function isEmpty(value) {
        return isArray(value) ? value.length === 0 : !value;
    }

    /**
     * Creates a function that negates the result of the predicate func.
     * The func predicate is invoked with the this binding and arguments of the created function.
     *
     * @param {Function} predicate The predicate to negate.
     * @return {Function} Returns the new negated function.
     * @memberof underscore
     */
    function negate(predicate) {
        return function () {
            return !predicate.apply(null, arguments);
        };
    }

    /**
     * Creates a function that invokes func with partials prepended to the arguments it receives.
     * This method is like `_.bind` except it does not alter the this binding.
     *
     * @param {Function} func  The function to partially apply arguments to.
     * @param {...any} partials The arguments to be partially applied.
     * @return {Function} Returns the new partially applied function.
     * @memberof underscore
     */
    function partial(func) {
        return func.bind.apply(func, slice(arguments));
    }

    /**
     * This method is like `_.partial` except that partially applied arguments are appended to the arguments it receives.
     *
     * @param {Function} func  The function to partially apply arguments to.
     * @param {...any} partials The arguments to be partially applied.
     * @return {Function} Returns the new partially applied function.
     * @memberof underscore
     */
    function partialRight(func) {
        var placeholders = slice(arguments);
        placeholders.shift();
        return function () {
            var args = slice(arguments);
            var spliceArgs = [args, arguments.length, 0].concat(placeholders);
            splice.apply(null, spliceArgs);
            return func.apply(null, args);
        };
    }

    /**
     * Creates a function that provides value to wrapper as its first argument.
     * Any additional arguments provided to the function are appended to those provided to the wrapper. The wrapper is invoked with the this binding of the created function.\
     *
     * @param  {*}        value    The value to wrap.
     * @param  {Function} wrapper  The wrapper function.
     * @return {Function}          Returns the new function.
     * @memberof underscore
     */
    function wrap(value, wrapper) {
        assert((typeof wrapper === 'function'), 'wrapper should be a function');
        return function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(value);
            return wrapper.apply(this, args);
        };
    }

    /**
     * 为类型构造器建立继承关系
     *
     * @param {Function} subClass 子类构造器
     * @param {Function} superClass 父类构造器
     * @return {Function}
     * @memberof underscore
     */
    function inherits(subClass, superClass) {

        /**
         * Temperary class
         *
         * @private
         * @class
         */
        var Empty = function () {};
        Empty.prototype = superClass.prototype;
        var selfPrototype = subClass.prototype;
        var proto = subClass.prototype = new Empty();

        for (var key in selfPrototype) {
            if (selfPrototype.hasOwnProperty(key)) {
                proto[key] = selfPrototype[key];
            }
        }
        subClass.prototype.constructor = subClass;

        return subClass;
    }

    // objectect Related
    exports.keysIn = keysIn;
    exports.get = get;
    exports.forOwn = forOwn;
    exports.assign = assign;
    exports.merge = assign;
    exports.extend = assign;
    exports.defaults = defaults;
    exports.defaultsDeep = defaultsDeep;
    exports.fromPairs = fromPairs;

    // Array Related
    exports.slice = slice;
    exports.splice = splice;
    exports.forEach = forEach;
    exports.map = map;
    exports.toArray = toArray;
    exports.findIndex = findIndex;

    // String Related
    exports.split = split;
    exports.format = format;

    // Lang Related
    exports.isArray = isArray;
    exports.isEmpty = isEmpty;
    exports.isString = isString;
    exports.isObject = isObject;
    exports.isRegExp = isRegExp;
    exports.inherits = inherits;
    exports.contains = contains;

    // Function Related
    exports.partial = partial;
    exports.partialRight = partialRight;
    exports.negate = negate;
    exports.wrap = wrap;

    return exports;
});