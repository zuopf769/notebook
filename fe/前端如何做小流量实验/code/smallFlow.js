
var _ = require('lodash');


function checkExpires(end, start) {
    var now = Date.now();

    if (end && now > end) {
        return false;
    }

    if (start && start > now) {
        return false;
    }

    return true;
}

function parseConf(conf) {

    try {
        var newconf = {};
        var type = conf.type;
        var start = Date.parse(conf.start);
        var end = conf.end ? Date.parse(conf.end) : 0;
        var total = conf.total;

        if (type !== 'XXXuid') {
            throw 'type error!';
        }

        if (!start || isNaN(end)) {
            throw 'time range error';
        }

        if (!checkExpires(end)) {
            throw 'expires';
        }

        var percent = 0;
        var newStrategy = [];
        _.each(conf.strategy, function (s, i) {
            var p = s.percent;
            var n = s.name;

            percent += p;

            while (p-- > 0) {
                newStrategy.push(n);
            }

        });

        if (percent !== total) {
            throw 'percent error: ' + percent;
        }
        newconf.type = type;
        newconf.start = start;
        newconf.end = end;
        newconf.total = total;
        newconf.strategy = newStrategy;
        return newconf;
    }
    catch (ex) {
        log.warning('smallFlow strategy parse error: '  + ex);
    }
}


function parsing(req, res, total) {

    var cookies = req.cookies || {};

    var xxxuId = cookies.XXXUID || '';

    if (!xxxuId) {
        return;
    }
    var index = (parseInt(xxxuId.substr(0, 6), 16) || 0) % total;

    return index;
}

module.exports = function (req, res, conf) {

    var parsedConf = parseConf(conf);
    var index = parsing(req, res, parsedConf.total);

    if (parsedConf && !isNaN(index)) {
        var smallFlowData = parsedConf.strategy[index];
    }

    if (smallFlowData) {
        return smallFlowData;
    }
};
