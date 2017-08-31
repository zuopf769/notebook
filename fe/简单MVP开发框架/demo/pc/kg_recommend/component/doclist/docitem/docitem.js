/**
 *  @file docitem.js
 *
 *  知识图谱相关推荐模块——右侧相关文档推荐文档列表组件
 *  @author zuopengfei01
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */
var W = require('../widget.js');
var widget = W.widget;
var Statistic = require('../view/statistic.js').Statistic;
var $ = require('../widget/ui/lib/jquery/jquery.js');
var doT = require('../widget/lib/doT/doT.min.js');
var Log = require('../widget/ui/js_core/log/log.js');

var tpl = doT.template(__inline('./docitem-tpl.tpl'));
var starTpl = doT.template(__inline('./star-tpl.tpl'));

var iconType = {
    word: 'doc',
    txt: 'txt',
    ppt: 'ppt',
    pdf: 'pdf',
    excel: 'xls',
    video: 'video'
};

var Docitem = widget({
    Options: {

    },
    elements: {
        '.score': '$scoreWrap',
        '.title-wrap': '$titleWrap'
    },
    _init: function () {
        this.mediator = this.options.mediator;
        this.data = this.options.data;
    },
    _initEvents: function () {
        var me = this;
        me.on('onload', function () {

        });

        me.on('ondispose', function () {

        });


    },
    _render: function () {
        var me = this;
        var data = me.data;
        data.type = iconType[data.type] || 'doc';
        data.scoreStr = me._createStarRate();
        if (!$.isNumeric(data.score)) {
            data.score = '0';
        };
        me.$el.append(tpl(data));
    },
    // 创建星级评分
    _createStarRate: function () {
        var me = this;
        var starStr = '';
        // 评分
        var score = me.data.score;
        var halfNum = 0;
        if (score && $.isNumeric(score)) {
            var onNum = Math.floor(score);
            var offNum = 5 - Math.ceil(score);
            if (onNum < score) {
                halfNum = 1;
            }
            starStr = starTpl({
                score: score,
                onNum: onNum,
                offNum: offNum,
                halfNum: halfNum
            });
        }
        else {
            starStr = '暂无评分';
        }

        return starStr;
    },
    calTitleMaxWidth: function (opt) {
        var kgdocsWrapW = opt.kgdocsWrapW;
        var titleWraps = this.$elements.$titleWrap;
        titleWraps && titleWraps.width(kgdocsWrapW - 167);
    }
}, {
    type: 'docitem'
});

W.register(Docitem, Statistic, Statistic.prototype);

exports.Docitem = Docitem;
