/**
 * Created by rockyren on 14/12/25.
 */
define(['imp/otherModule/DataHelper', 'imp/renderModule/nodeShapeRelative'], function(DataHelper, nodeShapeRelative){
    /**
     * 子结点重绘的策略工厂
     * @type {Function}
     */
    var ChildrenRenderFactory = (function(){
        return {
            createRenderStrategy: function(node){
                var strategy;
                //如果结点是根结点,则实现第一层结点添加算法
                if(node.isRootNode()){
                    strategy = new ChildrenRenderStrategy(new FirstRender());
                }else if(node.isFirstLevelNode()){
                    strategy = new ChildrenRenderStrategy(new FirstLevelRender());
                }else{
                    strategy = new ChildrenRenderStrategy(new SecondAndMoreRender());
                }
                return strategy;

            }
        };
    }());

    /**
     * 子结点重绘策略类
     * @param strategy
     * @constructor
     */
    function ChildrenRenderStrategy(strategy){
        this.strategy = strategy;
    }
    ChildrenRenderStrategy.prototype.reRenderChildrenNode = function(node){
        this.strategy.doRender(node);
    };

    /**
     * 抽象子结点重绘类
     * @constructor
     */
    function AbstractRender() {
        this.nodeXInterval = 40;
    }

    AbstractRender.prototype.commonRender = function(father, children, direction){
        //获取父结点的中间坐标
        var hfx = father.x + nodeShapeRelative.getSingleNodeWidth(father)/2;
        var hfy = father.y + nodeShapeRelative.getSingleNodeHeight(father)/2;

        var childrenAreaHeight = 0,     //结点的所有子结点所占区域的高度
            startY,                     //子节点区域的起始高度
            childX,                     //子节点x坐标
            childY,                     //子节点的y坐标
            self = this;

        childX = hfx + direction * (this.nodeXInterval + nodeShapeRelative.getSingleNodeWidth(father)/2);


        DataHelper.forEach(children, function(child){
            //通过结点的areHeight属性保存结点高度
            child.areaHeight = nodeShapeRelative.getNodeAreaHeight(child);
            childrenAreaHeight += child.areaHeight;
        });

        startY = hfy - childrenAreaHeight/2;

        DataHelper.forEach(children, function(child){
            //计算子结点y坐标
            childY = startY + child.areaHeight/2 - nodeShapeRelative.getSingleNodeHeight(child)/2;

            //起始高度累加
            startY += child.areaHeight;

            self._reRenderNode(child, childX, childY, direction);

        });
    };
    AbstractRender.prototype._reRenderNode = function(node, x, y, direction){
        //如果节点仍未渲染,则渲染之
        if(!node.shape){
            node.x = x;
            node.y = y;
            node.gRenderer.drawNode(node);
            //左边节点需左移一个节点宽度
            if(direction === -1){
                node.translate(-nodeShapeRelative.getSingleNodeWidth(node), 0);
            }
        }
        //如果节点已经渲染,则y轴平移
        else{
            var dy = y - node.y;
            node.translate(0, dy);
        }
    };

    AbstractRender.prototype.doRender = function(node){
        console.log('该方法应该被覆盖');
    };

    /**
     * 第一层子结点渲染类
     * @constructor
     */
    function FirstRender(){
        this.littleNodeYInterval = 100;
    }

    FirstRender.prototype = new AbstractRender();
    FirstRender.prototype.constructor = FirstRender;

    FirstRender.prototype.doRender = function(node){
        var children = this.getDirectionChildren(node);
        if(children.leftCount > 2){
            this.commonRender(node, children.leftChildren, -1);
        }else{
            this.renderLessThanTwo(node, children.leftChildren, -1);
        }

        if(children.rightCount > 2){
            this.commonRender(node, children.rightChildren, 1);
        }else{
            this.renderLessThanTwo(node, children.rightChildren, 1);
        }



    };

    /**
     * 当节点少于或等于两个时的渲染方法
     * @param father
     * @param leftChildren
     * @param direction
     */
    FirstRender.prototype.renderLessThanTwo = function(father, leftChildren, direction){
        var self = this;
        //1表示第一个节点，-1表示第二个节点
        var countFlag = 1;
        DataHelper.forEach(leftChildren, function(child){


            var hfx = father.x + nodeShapeRelative.getSingleNodeWidth(father)/2;
            var hfy = father.y + nodeShapeRelative.getSingleNodeHeight(father)/2;



            var childX = hfx + direction * (self.nodeXInterval + nodeShapeRelative.getSingleNodeWidth(father)/2);
            var childY = hfy - direction * countFlag * self.littleNodeYInterval;

            //@workaround:如果为1，4象限的节点
            if((direction == 1 && countFlag == 1) || (direction == -1 && countFlag == -1) ){
                childY -= nodeShapeRelative.getSingleNodeHeight(child);
            }

            self._reRenderNode(child, childX, childY, direction);

            countFlag = -countFlag;
        })
    };



    //根据子结点的direction取得左右子结点集合
    FirstRender.prototype.getDirectionChildren = function(node){
        var leftChildren = {},
            rightChildren = {},
            leftCount = 0,
            rightCount = 0;
        DataHelper.forEach(node.children, function(child){
            if(child.direction == -1){
                leftChildren[child.id] = child;
                leftCount++;
            }else{
                rightChildren[child.id] = child;
                rightCount++;
            }
        });

        return {
            leftChildren: leftChildren,
            rightChildren: rightChildren,
            leftCount: leftCount,
            rightCount: rightCount
        };
    };

    /**
     * 第一层子结点渲染类
     * @constructor
     */
    function FirstLevelRender(){
        this.nodeXInterval = 14;
    }
    FirstLevelRender.prototype = new AbstractRender();
    FirstLevelRender.prototype.constructor = FirstLevelRender;

    FirstLevelRender.prototype.doRender = function(node){


        this.commonRender(node, node.children, node.direction);
    };

    /**
     * 第n(n>=2)层子节点渲染类
     */
    function SecondAndMoreRender(){
        this.nodeXInterval = 14;
    }
    SecondAndMoreRender.prototype = new AbstractRender();
    SecondAndMoreRender.prototype.construct = SecondAndMoreRender;

    SecondAndMoreRender.prototype.doRender = function(node){
        this.commonRender(node, node.children, node.direction);
    };


    return ChildrenRenderFactory;



});