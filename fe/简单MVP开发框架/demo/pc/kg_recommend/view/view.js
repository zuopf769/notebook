/**
 *  @file view.js
 *  知识图谱相关推荐模块——view层级
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */
var T = require('../widget/lib/tangram/base/base.js');
var W = require('../widget/ui/html_view/widget.js');
var page = require('../widget/ui/lib/page/page.js');
var widget = W.widget;
var Statistic = require('../widget/kg_recommend/view/statistic.js').Statistic;
var $ = require('../widget/ui/lib/jquery/jquery.js');
var doT = require('../widget/lib/doT/doT.min.js');
var Log = require('../widget/ui/js_core/log/log.js');
var Tab = require('../widget/kg_recommend/component/tab/tab.js').Tab;
var KGTree = require('../widget/kg_recommend/component/kgtree/kgtree.js').KGTree;
var Doclist = require('../widget/kg_recommend/component/doclist/doclist.js').Doclist;

var defaulOpt = {
    kgPadding: 24,
    kgTreeWrapWidth: 350,
    kgTreeWrapMr: 30
};

var View = widget({
    Options: {

    },
    elements: {
        '.kgrec-container': '$kgrecContainer',
        '.kgdocs-wrap': '$kgdocsWrap',
        '.text-node-temp .text-node': '$tempTextNode',
        '.kgtree-content': '$kgtreeContent'
    },
    _init: function () {
        this.Mediator = this.options.Mediator;
        this.tpl = doT.template(__inline('./view-tpl.tpl'));

    },
    _initEvents: function () {
        var me = this;

        me.on('onload', function () {
            // 监听阅读器缩放事件，重新计算右侧相关文档列表区宽度
            T.lang.eventCenter.addEventListener('Reader.zoomChange', $.proxy(me._resize, me));
        });

        me.on('onload', function () {
            var hasDot = false;
            function scrollHandler() {
                var elOffsetTop = me.$el.offset().top;
                var elHeight = me.$el.height();
                var wHeight = $(window).height();
                var scrollTop = $(window).scrollTop();
                if (scrollTop + wHeight >= elOffsetTop + elHeight) {
                    if (!hasDot) {
                        me.fire('moduleShow');
                    }
                    hasDot = true;
                }
            }
            // 知识图谱推荐模块展现PV/UV(模块底部露出页面视为被展现)
            $(window).on('scroll.kgrecommend', scrollHandler);
            // 先执行一遍
            scrollHandler();
        });

        me.on('ondispose', function () {

        });

        // 初始化第一个知识点的信息
        me.Mediator.on('v:initFirstKGInfo', function (opt) {
            me.$elements.$kgrecContainer.show();
            // 知识点tab页签
            me.tabItems = opt.items || [];
            // 知识点树状卡片
            me.cardItems = opt.carditems || [];
            // 第一个知识点
            me.doclist = opt.doclist || {};

            // 创建tab页签
            me._createTabItems();
            // 创建第一棵知识点树
            me._createKGTree(me.cardItems[0]);
            // 创建第一个知识点的相关推荐文档列表
            me._ceatDoclist({
                doclist: me.doclist,
                curent: {
                    ent_uuid: me.cardItems[0].ent_uuid,
                    ent_name: me.cardItems[0].ent_name
                }
            });

        });

        // 刷新当前知识点的知识卡和右侧相关推荐列表
        me.Mediator.on('v:refreshKGTreeDoclist', function (opt) {
            me._refreshKGTreeDoclist(opt);
        });

        // 刷新当前知识点的右侧相关推荐列表
        me.Mediator.on('v:refreshWholeDoclist', function (opt) {
            me._refreshWholeDoclist(opt);

        });
    },
    _render: function () {
        var me = this;
        this.$el.html(me.tpl());
    },
    // 创建tab页签
    _createTabItems: function () {
        var me = this;
        this.tabItemComp = new Tab({
            el: '.tab-items-wrap',
            Mediator: me.Mediator,
            data: me.tabItems
        });
    },
    // 创建tab页签
    _createKGTree: function (data) {
        var me = this;
        if (!data) {
            return;
        }
        if ($.isEmptyObject(data)) {
            return;
        }
        me.KGTree = new KGTree({
            el: '.kgtree-content',
            Mediator: me.Mediator,
            tempTextNode: me.$elements.$tempTextNode,
            data: data
        });

    },
    // 动态计算右侧文档列表的宽度
    _calDoclistWidth: function () {
        var wbWidth = $('.reader-container').width();
        this.$elements.$kgdocsWrap.width(wbWidth - defaulOpt.kgPadding * 2
             - defaulOpt.kgTreeWrapWidth - defaulOpt.kgTreeWrapMr);
    },
    // 放大缩小
    _resize: function () {
        var me = this;
        this._calDoclistWidth();
        this.Doclist && this.Doclist.resize({
            kgdocsWrapW: me.$elements.$kgdocsWrap.width()
        });
    },
    // 创建右侧相关推荐文档列表
    _ceatDoclist: function (data) {
        var me = this;
        if (me.Doclist) {
            me.Doclist.fire('ondispose');
        }
        me.Doclist = new Doclist({
            el: '.kgdocs-wrap',
            Mediator: me.Mediator,
            data: data
        });
    },
    // 刷新当前知识点的知识卡和右侧相关推荐列表
    _refreshKGTreeDoclist: function (opt) {
        var me = this;
        me.cardItems = opt.carditems || {};
        me.doclist = opt.doclist || [];
        me._createKGTree(me.cardItems);

        // 销毁已有的相关推荐列表
        me.$elements.$kgdocsWrap.html('');
        me._ceatDoclist({
            doclist: me.doclist,
            curent: {
                ent_uuid: me.cardItems.ent_uuid,
                ent_name: me.cardItems.ent_name
            }
        });

    },
    // 刷新右侧相关推荐列表
    _refreshWholeDoclist: function (opt) {
        var me = this;
        var curNode = opt.curNode;
        me.doclist = opt.doclist || [];
        // 销毁已有的相关推荐列表
        me.$elements.$kgdocsWrap.html('');
        me._ceatDoclist({
            doclist: me.doclist,
            curent: {
                ent_uuid: curNode.ent_uuid,
                ent_name: curNode.ent_name
            }
        });
    }
});

W.register(View, Statistic, Statistic.prototype);

exports.View = View;
