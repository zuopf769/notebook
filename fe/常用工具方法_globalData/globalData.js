/**
 * @fileOverview 数据模块，用于存储页面公用的数据
 */
(function(exports) {
    var _data = {};
    var __fisData = {};

    // for debug
    __fisData._data = _data;

    /**
     * 通过key获取存储的对象
     *
     * @function
     * @public
     * @name data.get
     * @grammar data.get(key)
     * @param {String} key,数据的id。
     * @version 1.0
     */
    __fisData.get = function(key) {
        return _data[key];
    };

    /**
     * 存储数据对象，可以传入单个值，也可以传一个object对象
     *
     * @function
     * @public
     * @name data.set
     * @grammar data.set( obj ) 或 data.set(key , value)
     * @param {String|Object} key,数据的id。
     * @param {All} value ,key对应的值。
     * @version 1.0
     * @example
     *
     * <code>
     *   F.use("fis/data",function(data){
     *       data.set("key","value");
     *       data.set({"obj1":"value1","obj2":"value2"});
     *    });
     * </code>

     */
    __fisData.set = function(key, value) {

        if("string" == typeof key) {
            _data[key] = value;
        } else {
            for(var k in key ) {
                if(key.hasOwnProperty(k)) {
                    _data[k] = key[k];
                }
            }
        }
    };

    exports.__fisData = __fisData;
}(window));