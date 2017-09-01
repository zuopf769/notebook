/**
 * Created by rockyren on 15/3/7.
 */
define(['imp/otherModule/DataHelper'], function(DataHelper){
    /**
     * 拖动模块
     */
    var Drag = function(aNode, options){
        var node = aNode;
        //小工具条引用,用于显示和移动小工具条
        var toolbar = options.toolbar;

        var viewportHandle = options.viewportHandle;

        var paper = node.shape[0].paper;
        var graph = node.graph;

        //克隆的占位节点
        var cloneShape = null;
        //当前节点可添加的父节点BBox的集合
        var addableBoxSet = null;
        //最后一个重合的节点id
        var lastOverlapId = null;
        //当前重合的节点id
        var overlapNodeId = null;


        var enableRender = options.enableRender;



        /**
         * 取得克隆的shape：用于占位
         * @param node
         * @returns {*}
         * @private
         */
        function _cloneNodeShape(node){

            var newRect = node.shape[1].clone();
            newRect.attr({
                r: 4
            });
            var newLabel = node.shape[0].clone();
            var newShape = paper.set().push(newLabel).push(newRect);
            return newShape;
        }

        /**
         * 获得可成为当前节点的父节点的Box集合
         * @returns {{}}
         * @private
         */
        function _getAddableBBoxSet(){
            var addableBBoxSet = {};
            var addableSet = graph.getParentAddableNodeSet(node);

            DataHelper.forEach(addableSet, function(curNode){
                addableBBoxSet[curNode.id] = curNode.shape.getBBox();
            });
            return addableBBoxSet;
        }


        /**
         * 获得与当前节点重合的节点的id
         * @returns {*}
         * @private
         */
        function _getOverlapNodeId(){
            var nodeBBox = node.shape.getBBox();
            for(var id in addableBoxSet){
                var curBBox = addableBoxSet[id];
                if(Raphael.isBBoxIntersect(nodeBBox, curBBox)){
                    return id;
                }
            }
            return null;
        }

        /**
         * 将子节点及边设为透明
         * @param children
         * @private
         */
        function _setChildrenOpacity(children){
            DataHelper.forEach(children, function(child){
                child.shape.opacityShape(child);
                child.connectFather.shape.opacityShape();
                _setChildrenOpacity(child.children);
            });
        }

        /**
         * 将透明子节点及边设为原样
         * @param children
         * @private
         */
        function _setChildrenNormal(children){
            DataHelper.forEach(children, function(child){
                child.shape.unOpacityShape();
                child.connectFather.shape.unOpacityShape();
                _setChildrenNormal(child.children);
            });
        }

        function moveFnc(dx, dy){
            //如果不可渲染，则不可调用move
            if(!enableRender.canRender) { return false; }

            //移动节点时将鼠标的样式设为move
            node.shape[1].node.style.cursor = 'move';

            node.shape.transform('t' + dx + ',' + dy);

            overlapNodeId = _getOverlapNodeId();

            if(overlapNodeId !== lastOverlapId){
                if(overlapNodeId){

                    graph.nodes[overlapNodeId].shape.overlapShape();
                }
                if(lastOverlapId){

                    graph.nodes[lastOverlapId].shape.unOverlapShape(graph.nodes[lastOverlapId]);
                }
            }

            lastOverlapId = overlapNodeId;
        }

        function startFnc(){
            //如果不可渲染，则不可调用start
            if(!enableRender.canRender) { return false; }

            //设置节点的选择渲染
            // _selectedHandle();
            node.graph.setSelected(node);
            toolbar.setActive(node);

            //创一个克隆的节点占位
            cloneShape = _cloneNodeShape(node);

            //将节点设为未选择样式的透明样式
            node.shape.dragNodeOpacityShape(node);
            cloneShape.opacityShape();
            //@workaround: 改为当前节点，及其子节点和边透明
            _setChildrenOpacity(node.children);

            //获得当前节点可添加的父节点BBox的集合
            addableBoxSet = _getAddableBBoxSet();
            lastOverlapId = null;

        }
        function endFnc(){
            //如果不可渲染，则不可调用end
            if(!enableRender.canRender) { return false; }

            cloneShape.remove();
            cloneShape = null;


            //@workaround：将节点设为被选择样式
            node.shape.selectedShape(node);

            _setChildrenNormal(node.children);

            if(lastOverlapId){
//                graph.nodes[lastOverlapId].shape[1].attr({
//                    'stroke': 'black'
//                });
                var lastOverlapNode = graph.nodes[lastOverlapId];
                lastOverlapNode.shape.nodeShape(lastOverlapNode);
            }

            overlapNodeId = _getOverlapNodeId();

            if(overlapNodeId){
                //节点改变父节点后的操作
                graph.setParent(parseInt(overlapNodeId), node.id);

            }

            node.shape.transform('t' + 0 + ',' + 0);

            node.shape[1].node.style.cursor = 'default';
        }

        return {
            setDrag: function(){
                if(!node.isRootNode()){
                    node.shape.drag(moveFnc, startFnc, endFnc);
                }else{
                    node.shape.mousedown(function(event){
                        if(!enableRender.canRender) { return false; }
                        viewportHandle.mousedownHandle(event);
                    });
                    node.shape.mousemove(function(event){
                        if(!enableRender.canRender) { return false; }

                        viewportHandle.mousemoveHandle(event);

                    });
                    node.shape.mouseup(function(event){
                        if(!enableRender.canRender) { return false; }
                        viewportHandle.mouseupHandle(event);
                    });


                    node.shape.mousedown(function(){
                        if(!enableRender.canRender) { return false; }
                        node.graph.setSelected(node);
                        toolbar.setActive(node);
                    });
                    node.shape.mousemove(function(){
                        if(!enableRender.canRender) { return false; }
                        if(viewportHandle.isDragging()){
                        }
                    });
                    node.shape.mouseup(function(){
                        if(!enableRender.canRender) { return false; }

                    });

                }
            }

        };
    };
    return Drag;
});
