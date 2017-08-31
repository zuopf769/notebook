/**
 *  @file doclist.js
 *  知识图谱相关推荐模块——右侧相关文档推荐文档列表组件
 *  @author zuopengfei01
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */
/* eslint-disable */
var W = require('../widget/ui/html_view/widget.js');
var widget = W.widget;
var Statistic = require('../widget/kg_recommend/view/statistic.js').Statistic;
var $ = require('../widget/ui/lib/jquery/jquery.js');
var doT = require('../widget/lib/doT/doT.min.js');
var Log = require('../widget/ui/js_core/log/log.js');
var browser = require('../widget/ui/lib/browser/browser.js');
var Docitem = require('../widget/kg_recommend/component/doclist/docitem/docitem.js').Docitem;

var Doclist = widget({
    Options: {

    },
    elements: {
        '.switch': '$switchBtn',
        '.switch .icon': '$switchIcon',
        '.switch .icon': '$switchIcon',
        '.doclist-content': '$doclistContent'
    },
    _init: function () {
        this.Mediator = this.options.Mediator;
        this.data = this.options.data.doclist.data;
        // 第一页数据总量，如果小于5就不显示'换一批'按钮
        this.total = this.options.data.doclist.total;
        // 总页数
        this.totalPage = this.options.data.doclist.totalPage;
        this.curent = this.options.data.curent;
        // 当前第0页
        this.pn = 0;
        this.tpl = doT.template(__inline('./doclist-tpl.tpl'));

    },
    _initEvents: function () {
        var me = this;
        me.on('onload', function () {
            me._createItems(me.data);
        });

        // 资源列表区块打点
        me.on('onload', function () {
            me.bindEvent(me.$elements.$doclistContent, 'click', function (e) {
                if ($(e.target).hasClass('title')) {
                    // 打点
                    me.fire('doclistBlockClick');
                }
            });
        });

        // 换一批点击事件
        me.on('onload', function () {
            me.bindEvent(me.$elements.$switchBtn, 'mouseenter', function (e) {
                if (browser.ie && browser.ie <= 9) {
                    me.$elements.$switchBtn.addClass('hoverenter');
                }
            });

            me.bindEvent(me.$elements.$switchBtn, 'mouseleave', function (e) {
                if (browser.ie && browser.ie <= 9) {
                    me.$elements.$switchBtn.removeClass('hoverenter');
                }
            });

            me.bindEvent(me.$elements.$switchBtn, 'click', function (e) {
                me.$elements.$switchIcon.addClass('rotates');
                var ent_uuid = me.curent.ent_uuid;
                // 打点
                me.fire('switchClick', {
                    ent_uuid: ent_uuid
                });
                // 页码自增(最多是10页)
                // me.pn = (++ me.pn) % 10;
                me.pn = (++ me.pn) % me.totalPage;
                me.Mediator.fire('s:getDoclistBySwitch', {
                    pn: me.pn,
                    entUuid: ent_uuid
                });
            });
        });

        me.on('ondispose', function () {
            me.$el.html('');
            me.unBindEvent(me.$elements.$switchBtn, 'click');
            me.unBindEvent(me.$elements.$switchBtn, 'mouseenter');
            me.unBindEvent(me.$elements.$switchBtn, 'mouseleave');
        });

        // 换一批点击事件后刷新相关推荐列表
        me.Mediator.on('v:refreshDoclist', function (opt) {
            me.$elements.$doclistContent.html('');
            me.data = opt.doclist.data;
            me._createItems(me.data);
            // 加载动画
            me.$elements.$switchIcon.removeClass('rotates');
        });
    },
    _render: function () {
        var me = this;
        me.$el.html(me.tpl({
            cur_enname: me.curent.ent_name || '',
            total: me.total
        }));
    },
    // 创建相关推荐items
    _createItems: function (data) {
        // 先清空之前的列表内容
        var me = this;
        me.docitems = [];
        me.$elements.$doclistContent.html('');
        // 创建相关推荐
        $.each(data, function (index, item) {
            var docitem = new Docitem({
                el: '.doclist-content',
                Mediator: me.Mediator,
                data: item
            });
            me.docitems.push(docitem);
        });
    },
    // 监听页面
    resize: function (opt) {
        this._resizeDocItemsTitleWidth(opt);
    },
    // 计算相关推荐标题宽度
    _resizeDocItemsTitleWidth: function (opt) {
        var me = this;
        if (me.docitems) {
            $.each(me.docitems, function(index, item) {
                item.calTitleMaxWidth(opt);
            });
        }
    }

}, {
    type: 'doclist'
});

W.register(Doclist, Statistic, Statistic.prototype);

exports.Doclist = Doclist;
