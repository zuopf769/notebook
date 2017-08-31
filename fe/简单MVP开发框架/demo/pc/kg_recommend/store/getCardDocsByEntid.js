/**
 * @file getCardDocsByEntid.js
 * @author zuopengfei01
 * @desc 通过entid获取该知识点下的知识卡和相关推荐
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var $ = require('../widget/ui/lib/jquery/jquery.js');
var getContent = require('../util/getContent.js').getContent;
var config = require('../util/config.js');
var cache = {};

var getCardDocsByEntid = function (Mediator, options) {

    /**
     * 接口查询
     * @param  {string} type     接口类型
     * @param  {Object} entUuid  知识点id
     * @return {Object}          promise对象
     */
    var flow = function (type, entUuid) {
        var dfd = new $.Deferred();
        var url = config.url[type];
        var params = {
            doc_id: options.doc_id,
            entUuid: entUuid
        };
        // 缓存
        if (cache[entUuid]) {
            dfd.resolve(cache[entUuid]);
        }
        else {
            getContent(url, params)
            .done(function (data) {
                cache[entUuid] = data;
                dfd.resolve(data);
            });
        }
        return dfd.promise();
    };

    Mediator.on('s:getCardDocsByEntid', function (opt) {
        var type = opt.type;
        var entUuid = opt.entUuid;
        var promise = opt.promise;
        flow(type, entUuid)
            .then(function (data) {
                promise.resolve(data);
            });
        return promise;
    });
};

exports.getCardDocsByEntid = getCardDocsByEntid;
