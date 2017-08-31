/**
 * @file
 */
var Gd = {
    set: function () {
        var args = arguments;
        if (args.length === 1 && typeof args[0] === 'object') {
            if(args[0].set){
                throw new Error('gd设置的key不能为set');
            }
            $.extend(this, args[0]);
        }
        else if (args.length === 2 &&  typeof args[0] === 'string') {
            if(args[0] == 'set'){
                throw new Error('gd设置的key不能为set');
            }
            this[args[0]] = args[1];
        }
    }
};

module.exports = Gd;
