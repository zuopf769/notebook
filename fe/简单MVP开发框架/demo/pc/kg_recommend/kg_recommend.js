/**
 *  @file kg_recommend.js
 *  xx模块——入口文件
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var Mediator = require('../widget/ui/pay/mediator.js').mediator;
var View = require('../widget/kg_recommend/view/view.js').View;
var getContentData = require('../widget/kg_recommend/store/getContentData.js').getContentData;
var getCardDocsByEntid = require('../widget/kg_recommend/store/getCardDocsByEntid.js').getCardDocsByEntid;
var getDoclistByPn = require('../widget/kg_recommend/store/getDoclistByPn.js').getDoclistByPn;
var config = require('../widget/kg_recommend/util/config.js');

function main(options) {

    var view = new View({
        el: options.el,
        docWrap: options.docWrap,
        Mediator: Mediator
    });

    view.on('onload', function () {

        getContentData(Mediator, {
            doc_id: options.docId
        });

        getCardDocsByEntid(Mediator, {
            doc_id: options.docId
        });

        getDoclistByPn(Mediator, {
            doc_id: options.docId
        });

        // 获取总接口数据
        // 根据文档id获取第一个知识点的知识卡和相关推荐书籍
        Mediator.fire('v:initFirstKGInfo', options.data || {});

        // 知识点页签切换后
        // 根据知识点id获取该知识点的知识卡和相关推荐列表
        Mediator.on('s:getDataByTabItem', function (opt) {
            // 知识点id
            var entUuid = opt && opt.ent_uuid;
            Mediator.fire('s:getCardDocsByEntid', {
                type: config.type['getCardDocsByEntid'],
                doc_id: options.docId,
                entUuid: entUuid
            })
            .then(function (data) {
                Mediator.fire('v:refreshKGTreeDoclist', data);
            });
        });

        // 换一批点击后
        // 根据知识点id和pn查询相关推荐(pn一直累加即可)
        Mediator.on('s:getDoclistBySwitch', function (opt) {
            var entUuid = opt.entUuid;
            var pn = opt.pn;
            Mediator.fire('s:getDoclistByPn', {
                type: config.type['getDoclistByPn'],
                pn: pn,
                entUuid: entUuid
            })
            .then(function (data) {
                Mediator.fire('v:refreshDoclist', data);
            });
        });

        // 切换知识点树的知识点文本节点后
        // 根据知识点id和pn查询相关推荐(pn为0第一页)
        Mediator.on('s:getDoclistByChangeTreeNode', function (opt) {
            var entUuid = opt.entUuid;
            var entName = opt.entName;
            var curNode = {
                ent_uuid: entUuid,
                ent_name: entName
            };
            var pn = opt.pn;
            Mediator.fire('s:getDoclistByPn', {
                type: config.type['getDoclistByPn'],
                pn: pn,
                entUuid: entUuid
            })
            .then(function (data) {
                data.curNode = curNode;
                Mediator.fire('v:refreshWholeDoclist', data);
            });
        });
    });
}

exports.main =  main;
