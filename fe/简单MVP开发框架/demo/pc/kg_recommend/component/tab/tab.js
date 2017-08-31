/**
 *  @file tab.js
 *  知识图谱相关推荐模块——tab页签组件
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */
/* eslint-disable */
var W = require('../widget/ui/html_view/widget.js');
var widget = W.widget;
var Statistic = require('../widget/kg_recommend/view/statistic.js').Statistic;
var $ = require('../widget/ui/lib/jquery/jquery.js');
var doT = require('../widget/lib/doT/doT.min.js');
var Log = require('../widget/ui/js_core/log/log.js');


var Tab = widget({
    Options: {

    },
    elements: {
        '.tab-item': '$tabItems'
    },
    _init: function () {
        this.Mediator = this.options.Mediator;
        this.data = this.options.data;
        this.tpl = doT.template(__inline('./tab-tpl.tpl'));

    },
    _initEvents: function () {
        var me = this;
        me.on('onload', function () {
            // 阻止重复触发mouseover事件
            var isLoading = false;
            // 定时器
            var timer;
            var leaveTime = 0;
            // tab页签鼠标滑入
            $.each(me.$elements.$tabItems, function (index, item) {
                me.bindEvent(item, 'mouseenter', function (e) {

                    var enterTime = new Date().getTime();
                    var curItem = $(e.currentTarget);

                    if (curItem.hasClass('active')) {
                        return;
                    }

                    if (isLoading) {
                        return;
                    }
                    isLoading = true;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    // 延迟20ms否则会和知识点树的onload事件的延迟16ms冲突，导致重叠
                    timer = setTimeout(function () {

                        if (leaveTime - enterTime > 0 && leaveTime - enterTime < 50) {
                            return;
                        }

                        me.$elements.$tabItems.removeClass('active');
                        curItem.addClass('active');
                        // 知识点id
                        var ent_uuid = curItem.find('.tab-item-title').attr('data-id');
                        // 根据知识点id去加载知识点卡片和当前知识点的相关文档
                        me.Mediator.fire('s:getDataByTabItem', {
                            ent_uuid: ent_uuid
                        });

                        // 打点
                        me.fire('changeTab', {
                            index: curItem.index(),
                            ent_uuid: ent_uuid
                        });

                        timer = null;
                    }, 50);
                });

                me.bindEvent(item, 'mouseleave', function (e) {
                    isLoading = false;
                    leaveTime = new Date().getTime();
                });
            });
        });

        me.on('ondispose', function () {

        });


    },
    _render: function () {
        var me = this;
        me.$el.html(me.tpl({
            items: me.data
        }));
    }

}, {
    type: 'tab-items'
});

W.register(Tab, Statistic, Statistic.prototype);

exports.Tab = Tab;
