/**
 * @file getDocinfoData.js
 * @author zuopengfei01
 * @desc 获取文档相关知识点推荐总接口
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var $ = require('../widget/ui/lib/jquery/jquery.js');
var getContent = require('../util/getContent.js').getContent;
var config = require('../util/config.js');

var getContentData = function (Mediator, options) {

    /**
     * 接口查询
     * @param  {string} type     接口类型
     * @param  {Object} otherOpt 其他参数
     * @return {Object}          promise对象
     */
    var flow = function (type) {
        var dfd = new $.Deferred();
        var url = config.url[type];
        var params = {
            doc_id: options.doc_id
        };
        getContent(url, params)
        .done(function (data) {
            dfd.resolve(data);
        });
        return dfd.promise();
    };

    Mediator.on('s:getContentData', function (opt) {
        var type = opt.type || config.type.getrelinfo;
        var promise = opt.promise;
        flow(type)
            .then(function (data) {
                promise.resolve(data);
            });
        return promise;
    });
};

exports.getContentData = getContentData;
