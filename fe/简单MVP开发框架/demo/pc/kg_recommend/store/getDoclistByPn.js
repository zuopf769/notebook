/**
 * @file getDoclistByPn.js
 * @author zuopengfei01
 * @desc 通过entid和pn获取该知识点下的相关推荐列表，支持分页
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var $ = require('../widget/ui/lib/jquery/jquery.js');
var getContent = require('../util/getContent.js').getContent;
var config = require('../util/config.js');

var getDoclistByPn = function (Mediator, options) {

    /**
     * 接口查询
     * @param  {string} type     接口类型
     * @param  {Object} entUuid  知识点id
     * @param  {number} pn       pn
     * @return {Object}          promise对象
     */
    var flow = function (type, entUuid, pn) {
        var dfd = new $.Deferred();
        var url = config.url[type];
        var params = {
            entUuid: entUuid,
            doc_id: options.doc_id,
            pn: pn
        };

        getContent(url, params)
        .done(function (data) {
            dfd.resolve(data);
        });

        return dfd.promise();
    };

    Mediator.on('s:getDoclistByPn', function (opt) {
        var type = opt.type;
        var entUuid = opt.entUuid;
        var pn = opt.pn;
        var promise = opt.promise;
        flow(type, entUuid, pn)
            .then(function (data) {
                promise.resolve(data);
            });
        return promise;
    });
};

exports.getDoclistByPn = getDoclistByPn;
