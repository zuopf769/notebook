
/**
 * 打点相关逻辑（view层级）
 * @file statistic.js
 * @author zuopengfei01
 * @date 2017-08-02
 */

 /* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */

var Log = require('../widget/ui/js_core/log/log.js');

var Statistic = function () {
    var me = this;

    // 知识图谱推荐模块展现PV/UV(模块底部露出页面视为被展现)
    me.on('moduleShow', function (opt) {
        Log.xsend(1, 101197);
    });

    // tab页签切换
    me.on('changeTab', function (opt) {
        // index为1到6
        var index = opt.index + 1;
        var ent_uuid = opt.ent_uuid;
        Log.xsend(1, 101198, {
            index: index,
            ent_uuid: ent_uuid
        });
        // 区块整体点击
        Log.xsend(1, 101225);
    });

    // 资源列表区块打点
    me.on('doclistBlockClick', function (opt) {
        // 跳转点击已经在组件dom上绑定log-xsend打点了
        // 区块整体点击
        Log.xsend(1, 101225);
    });

    // 知识点树文本节点切换
    // 因为点击了文本节点会刷新右侧列表组件，static组件会重新初始化，所以在组件内部打点
    me.on('changeTreeNode', function (opt) {
        Log.xsend(1, 101199, {});
        // 区块整体点击
        Log.xsend(1, 101225);
    });

    // 换一批按钮点击
    me.on('switchClick', function (opt) {
        var ent_uuid = opt.ent_uuid;
        Log.xsend(1, 101201, {
            ent_uuid: ent_uuid
        });
        // 区块整体点击
        Log.xsend(1, 101225);

    });

};

exports.Statistic = Statistic;
