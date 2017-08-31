/**
 *  @file kgtree.js
 *  知识图谱相关推荐模块——知识点树
 *  @author zuopengfei01
 *  @date 2017.08.07
 */

/* eslint quotes:[0],fecs-camelcase:[0,{"ignore":["/_/"]}] */
/* eslint-disable */
var W = require('../widget/ui/html_view/widget.js');
var widget = W.widget;
var Statistic = require('../widget/kg_recommend/view/statistic.js').Statistic;
var $ = require('../widget/ui/lib/jquery/jquery.js');
var doT = require('../widget/lib/doT/doT.min.js');
var Log = require('../widget/ui/js_core/log/log.js');


var KGTree = widget({
    Options: {
        offsetLeftLevel2: 48, //第二层级与第一层级之间的缩进为48
        offsetLeftLevel3: 48, //第三层级与第二层级之间的缩进为48
        textNodePathoutOffset: 15, //文本节点底部线条出口处的左偏移量
        textNodeHeight: 32, // 每个节点的高度
        levelOffsetHeight: 8 // 层与层之间的间距
    },
    elements: {
    },
    _init: function () {
        this.Mediator = this.options.Mediator;
        this.data = this.options.data;

        // 是否有父节点 1：含有父节点 0：不含父节点
        this.hasParent = this.data.parent ? 1 : 0;
        // 是否有子节点 1：含有子节点 0：不含子节点
        this.hasChildren = this.data.children && this.data.children.length ? 1 : 0;
        // 子节点的个数
        this.childrenLength = 0;
        if (this.data.children) {
            var childrenSize = this.data.children.length;
            childrenSize = childrenSize > 3 ? 3 : childrenSize;
            this.childrenLength = childrenSize;

        }

        // 树的层级 1：层  2：两层  3： 三层
        this.level = 1 + this.hasParent + this.hasChildren;
        // 卡片类型
        this.cardType = this._initCardType();

        // 存放需要绘制的文本节点
        this.textNodes = '';
        // 存放需要绘制的线条
        this.paths = '';

        // 重新设计节点数据结构
        this._initNodes();

    },
    _initEvents: function () {
        var me = this;
        me.on('onload', function () {
            // 用来计算文本节点宽度的临时容器
            me.tempTextNode = me.options.tempTextNode;
            // 计算容器、树型结构的宽高
            me._calWithAndHeight();

        });

        // 知识点树文本节点hover
        me.on('onload', function () {
            var textNodes = me.$el.find('.text-wrap');
            // 阻止重复触发mouseover事件
            var isLoading = false;
            // 定时器
            var timer;
            var leaveTime = 0;
            me.bindEvent(textNodes, 'mouseenter', function(e) {
                var currentTarget = $(e.currentTarget);
                if (!currentTarget.hasClass('text-wrap'))  {
                    return;
                }

                if (currentTarget.hasClass('current'))  {
                    return;
                }

                var enterTime = new Date().getTime();

                if (isLoading) return;
                isLoading = true;

                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {

                    if (leaveTime - enterTime > 0 && leaveTime - enterTime < 50) return;

                    textNodes.removeClass('current');
                    currentTarget.addClass('current');

                    // 切换右侧相关推荐列表事件
                    var entUuid = currentTarget.attr('data-id');
                    var entName = currentTarget.attr('title');
                    var type = currentTarget.attr('data-type');

                    // 打点（因为点击了文本节点会刷新右侧列表组件，static组件会重新初始化，所以先这样打点了）
                    Log.xsend(1, 101199, {
                        ent_uuid: entUuid,
                        type: type
                    });
                    // 区块整体点击
                    Log.xsend(1, 101225);

                    me.Mediator.fire('s:getDoclistByChangeTreeNode', {
                        entUuid: entUuid,
                        entName: entName,
                        pn: 0
                    });
                    // 清除掉最后一个定时器
                    timer = null;

                }, 80);

            });

            me.bindEvent(textNodes, 'mouseleave', function(e) {
                isLoading = false;
                leaveTime = new Date().getTime();
            });
        });

        me.on('ondispose', function () {
            me.$el.html('');
        });
    },
    _render: function () {
        var me = this;
    },
    /*
     * 初始化卡片类型
     * return {number}
     *     + 3: 当前卡片含有父节点、子节点、当前节点
     *     + 2：当前卡片含有父节点、当前节点
     *     + 1：当前卡片含有子节点、当前节点
     *     + 0：当前卡片只含有当前节点（此次业务应该不包含这种情况）
     */
    _initCardType: function () {
        var cardType = -1;
        switch (this.level) {
            case 3:
                cardType = 3;
                break;
            case 2:
                cardType = (this.hasParent === 1) ? 2 : 1;
                break;
            case 1:
                cardType = 0;
                break;
            default:
                break;
        }
        return cardType;
    },
    // 初始化节点数据结构
    _initNodes: function () {
        var me = this;
        this.nodes = {
            cur: {
                ent_uuid: me.data.ent_uuid,
                ent_name: me.data.ent_name
            }
        };
        if (this.hasParent) {
            this.nodes.parent = this.data.parent;
        }
        if (this.hasChildren) {
            this.nodes.children = this.data.children;
        }
    },
    // 计算宽高(容器、树)
    _calWithAndHeight: function () {
        // 容器宽高
        this.containerWidth = this.$el.innerWidth();
        this.containerHeight = this.$el.innerHeight();
        // 计算树内容区的宽度
        this.contentWidth = this._calTreeWidth();
        // 计算树内容区的高度
        this.contentHeight = this._calTreeHeight();

        // 居中坐标
        this.contentOffsetLeft = (this.containerWidth - this.contentWidth) / 2;
        this.contentOffsetTop = (this.containerHeight - this.contentHeight) / 2;

        // 先销毁再绘制新的树和列表
        this.fire('ondispose');
        // 画文本节点
        this._drawTextNodes();
        // 画路径
        this._drawPaths();

    },
    // 计算树内容区的宽度
    _calTreeWidth: function () {
        var me = this;

        // 当前节点
        var curNodeWidth = this.tempTextNode.text(this.nodes.cur.ent_name).parent('.text-wrap').outerWidth();
        me.nodes.cur.width = curNodeWidth;

        // 含有父亲节点
        var parentNodeWidth = 0;
        if (this.hasParent) {
            parentNodeWidth = this.tempTextNode.text(this.nodes.parent.ent_name).parent('.text-wrap').outerWidth();
            me.nodes.parent.width = curNodeWidth;
        }

        // 含有子节点
        var childrenNodeMaxWidth = 0;
        if (this.hasChildren) {
           $.each(me.nodes.children, function(index, item) {
               var tempWidth = me.tempTextNode.text(item.ent_name).parent('.text-wrap').outerWidth();
               item.width = tempWidth;
               if (tempWidth > childrenNodeMaxWidth) {
                   childrenNodeMaxWidth = tempWidth;
               }
           });
        }

        var kgTreeWidth = 0;
        switch (this.cardType) {
           case 1:
               kgTreeWidth = Math.max(curNodeWidth, childrenNodeMaxWidth + this.options.offsetLeftLevel2);
               break;
           case 2:
               kgTreeWidth = Math.max(parentNodeWidth, curNodeWidth + this.options.offsetLeftLevel2);
               break;
           case 3:
               kgTreeWidth = Math.max(parentNodeWidth, curNodeWidth + this.options.offsetLeftLevel2, childrenNodeMaxWidth + this.options.offsetLeftLevel2 + this.options.offsetLeftLevel3);
               break;
           default:
               break;
        }
       return kgTreeWidth;
   },
   // 计算树内容区的高度
   _calTreeHeight: function () {
        var kgTreeHeight = 0;
        switch (this.cardType) {
            case 1:
                kgTreeHeight =  this.options.textNodeHeight + this.options.levelOffsetHeight
                                + this.options.textNodeHeight * this.childrenLength
                                + this.options.levelOffsetHeight * (this.childrenLength - 1);;
                break;
            case 2:
                kgTreeHeight =  this.options.textNodeHeight * 2 + this.options.levelOffsetHeight;
                break;
            case 3:
                kgTreeHeight =  this.options.textNodeHeight * 2 + this.options.levelOffsetHeight * 2
                                + this.options.textNodeHeight * this.childrenLength
                                + this.options.levelOffsetHeight * (this.childrenLength - 1);
                break;
            default:
                break;
        }
        return kgTreeHeight;
   },
   // 画文本节点
   _drawTextNodes: function () {
       var me = this;
       $.each(me.nodes, function (index, item) {
           switch (index) {
               case 'parent':
                   me._drawParentTextNode(item);
                   break;
               case 'cur':
                   me._drawCurTextNode(item);
                   break;
               case 'children':
                   me._drawChildrenTextNode(item);
                   break;
               default:
                   break;
           }
       });
       this.$el.append(me.textNodes);
   },
   // 画父节点(父亲节点肯定是在第一层)
   _drawParentTextNode: function (data) {
       var parentNode = data;
       parentNode.type = 'parent';
       parentNode.height = this.options.textNodeHeight;
       parentNode.X = this.contentOffsetLeft;
       parentNode.Y = this.contentOffsetTop;
       parentNode.coords = this._setFiveCoords(parentNode);

       this.textNodes += this._createTextNodeStr(parentNode);
   },
   // 画当前节点
   _drawCurTextNode: function (data) {
       var curNode = data;
       curNode.isCur = 1;
       curNode.type = 'current';
       curNode.height = this.options.textNodeHeight;
        if (this.cardType === 1) {
            curNode.X = this.contentOffsetLeft;
            curNode.Y = this.contentOffsetTop;
        }
        else if (this.cardType === 2 || this.cardType === 3) {
            curNode.X = this.contentOffsetLeft + this.options.offsetLeftLevel2;
            curNode.Y = this.contentOffsetTop + this.options.textNodeHeight + this.options.levelOffsetHeight;
        }
        curNode.coords = this._setFiveCoords(curNode);
        this.textNodes += this._createTextNodeStr(curNode);

   },
    // 画子节点
    _drawChildrenTextNode: function (data) {
        var me = this;
        var childrenNode = data;
        var childLength = childrenNode.length;
        var X = this.contentOffsetLeft;
        var Y = this.contentOffsetTop;
        if (this.cardType === 1) {
            X += this.options.offsetLeftLevel2;
            Y += this.options.textNodeHeight + this.options.levelOffsetHeight;
        }
        else if (this.cardType === 3) {
            X += (this.options.offsetLeftLevel2 + this.options.offsetLeftLevel3);
            Y += (this.options.textNodeHeight * 2 + this.options.levelOffsetHeight * 2);
        }

        $.each(childrenNode, function (index, item) {
            item.type = 'children';
            item.X = X;
            item.Y = Y + ((me.options.textNodeHeight + me.options.levelOffsetHeight) * index);
            item.height = me.options.textNodeHeight;
            item.coords = me._setFiveCoords(item);
            me.textNodes += me._createTextNodeStr(item);
        });
    },
   /*
    * setFiveCoords: 给每一个文本节点打上五个坐标点（画线条的时候会需要这些坐标点）
    * + 从上顺时针转分别为：c0,c1,c2,c3,c4
    */
   _setFiveCoords: function (obj) {
        var c0 = [obj.X + obj.width / 2, obj.Y];
        var c1 = [obj.X + obj.width - 1, obj.Y + obj.height / 2];
        var c2 = [obj.X + obj.width / 2, obj.Y + obj.height];
        var c3 = [obj.X + this.options.textNodePathoutOffset, obj.Y + obj.height];
        var c4 = [obj.X, obj.Y + obj.height / 2];
        return {
            c0: c0,
            c1: c1,
            c2: c2,
            c3: c3,
            c4: c4
        };
    },
    _createTextNodeStr: function(node) {
        var current = '';
        if (node.isCur && node.isCur === 1) {
            current += 'current';
        }
        var textNodeStr = '<a class="text-wrap ' + current + '" data-id="' + node.ent_uuid
 + '" data-type="'+ node.type + '"  title="'+node.ent_name +'" style="left:' + node.X +'px; top:' + node.Y +'px;">'
                            + '<span class="text-node">'+ node.ent_name +'</span>'
                        + '</a>'
        return textNodeStr;
    },
    // 画路径
    _drawPaths: function () {
        if (this.hasParent) {// 从父亲节点出来的路径
            this._drawParentPath();
        }
        if (this.hasChildren) {// 从当前节点出来的路径
            this._drawCurPath();
        }
        this.$el.append(this.paths);
    },
    // 画父节点到当前节点的线条路径
   _drawParentPath: function () {
       var parentNode = this.nodes.parent;
       var curNode = this.nodes.cur;

       this.paths += this._createPathStr(parentNode, curNode, 'border-left-bottom');
   },
   // 画当前节点到各子节点的线条路径
   _drawCurPath: function () {
        var curNode = this.nodes.cur;
        var me = this;
        var childrenLength = me.nodes.children.length;
        var borderType = 'border-bottom';
        $.each(me.nodes.children, function(index, item) {
            if (index === childrenLength - 1) {
                borderType = 'border-left-bottom';
            }
            me.paths += me._createPathStr(curNode, item, borderType);
        });
    },
   _createPathStr: function(nodeOut, nodeIn, type) {
      var X = nodeOut.coords.c3[0];
      var Y = nodeOut.coords.c3[1];

      var W = nodeIn.coords.c4[0] - X;
      var H = nodeIn.coords.c4[1] - Y;

      var textNodeStr = '<div class="path ' + type + '" style="left:' + X +'px; top:' + Y +'px; width:'+ W+'px; height:'+ H +'px;">'
                      + '</div>';
      return textNodeStr;
  }

}, {
    type: 'kgtree'
});

W.register(KGTree, Statistic, Statistic.prototype);

exports.KGTree = KGTree;
