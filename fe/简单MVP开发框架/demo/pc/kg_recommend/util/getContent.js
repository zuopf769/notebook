/**
 * @file getContent.js
 * @author zuopengfei01
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var $ = require('../widget/ui/lib/jquery/jquery.js');
var config = require('./config.js');

var getContent = function (url, options) {
    var url = url + '?callback=?';
    return $.getJSON(url, options);
};

exports.getContent = getContent;
