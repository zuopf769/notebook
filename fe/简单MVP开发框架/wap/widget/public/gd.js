/**
 * @file
 */
var Gd = {
    set: function () {
        var args = arguments;
        if (args.length === 1 && typeof args[0] === 'object') {
            $.extend(this, args[0]);
        }
        else if (args.legnth === 2 &&  typeof args[0] === 'string') {
            this[args[0]] = args[1];
        }
    }
};

module.exports = Gd;
