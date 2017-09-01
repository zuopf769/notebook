
define(['imp/otherModule/DataHelper', 'imp/renderModule/shapeCustomAttr',  'imp/renderModule/nodeShapeRelative',
        'imp/renderModule/ChildrenRenderFactory', 'imp/renderModule/Drag',
        'imp/renderModule/Viewport', 'imp/renderModule/EdgeDraw', 'imp/renderModule/Toolbar','jquery', 'raphael' ],
    function(DataHelper, shapeCustomAttr, nodeShapeRelative, ChildrenRenderFactory, Drag, Viewport, EdgeDraw, Toolbar, $){


        function Renderer(options){

            this.type = options.type;
            this.canvasDom = document.getElementById(options.canvasId);
            this.paper = new Raphael(this.canvasDom);


            //视野设置
            this.viewportHandle = Viewport(this.canvasDom, this.paper);
            this.viewportHandle.setViewportDrag();

            //小工具条对象
            this.toolbar = Toolbar();

            this.enableRender = {
                canRender: true
            };

            shapeCustomAttr.init(this.paper);

        }
        Renderer.prototype = {
            constructor: Renderer,

            EnableRender: function(canRender){
                this.enableRender.canRender = canRender;
                this.canvasDom.style.opacity = canRender ? 1 : 0.5;
            },
            /**
             * 新增节点时的渲染
             * @param node
             */
            addNodeRender: function(node){
                //节点渲染
                if(node.x && node.y){
                    this.drawNode(node);
                }

                //如果没有设置x,y.则按照父节点的位置设置之
                else{
                    this._reRenderChildrenNode(node.father);
                    //向上递归移动父节点的同级节点,只有一个点时不用移动
                    if(node.father && node.father.childrenCount() > 1) {
                        this._resetBrotherPosition(node.father, nodeShapeRelative.getNodeAreaHeight(node));
                    }
                }



                //边渲染
                if(node.connectFather){
                    this._drawEdge(node.connectFather);
                }

                this._setDrag(node);

                node.shape.mousedown(function(){
                    $('#label-group input').val(node.label);
                });


            },

            setParentRender: function(node){
                var self = this;

                var childrenWithShapeCount1 = node.father.childrenWithShapeCount();

                self._reRenderChildrenNode(node.father);
                var childrenWithShapeCount2 = node.father.childrenWithShapeCount();

                //向上递归移动父节点的同级节点,只有一个点时不用移动
                if(node.father && node.father.childrenCount() > 1) {
                    if(childrenWithShapeCount2 - childrenWithShapeCount1 <= 1){
                        self._resetBrotherPosition(node.father, nodeShapeRelative.getNodeAreaHeight(node));
                    }
                }

                if(node.connectFather){
                    self._drawEdge(node.connectFather);
                }
                //设置拖动
                this._setDrag(node);

                DataHelper.forEach(node.children, function(child){
                    self.setParentRender(child);
                });

            },


            getCanvasWidth: function(){

                return this.canvasDom.clientWidth;
            },

            /**
             * 删除节点渲染
             * 需要先断开父节点的children和connectChildren连接才能重新调整当前节点层的节点
             * @param node
             */
            removeNodeRender: function(node){
                this._reRenderChildrenNode(node.father);
                if(node.father){
                    if(node.father.childrenCount() > 0 || node.childrenCount() > 1){
                        this._resetBrotherPosition(node.father, -nodeShapeRelative.getNodeAreaHeight(node));
                    }

                }
                this.removeNodeAndChildrenShape(node);
                this.toolbar.setAllUnactive();

            },

            /**
             * 移动节点的渲染: 节点移动渲染(通过设置attr的x和y属性),边重绘
             * @param node
             * @param dx
             * @param dy
             */
            translateSingleNodeRender: function(node, dx, dy){
                if(node.shape){
                    var rect = node.shape[1];
                    var posX = rect.attr('x');
                    var posY = rect.attr('y');
                    rect.attr({ x: posX + dx,  y: posY + dy} );

                    var label = node.shape[0];
                    var labelX = label.attr('x');
                    var labelY = label.attr('y');
                    label.attr( {x: labelX + dx, y: labelY + dy} );
                }


                //移动节点后,边重画
                if(node.shape && node.connectFather){
                    this._drawEdge(node.connectFather);
                }
            },

            /**
             * 选择节点时的渲染
             * @param node 被选中的节点
             * @param oldSelected: 之前被选中的节点
             */
            setSelectedRender: function(node, oldSelected){
                if(node && node.shape){
                    node.shape.selectedShape(node);
                }
                if(oldSelected && oldSelected.shape){
                    oldSelected.shape.unSelectedShape(oldSelected);

                }
            },

            /**
             * 节点文本设置渲染
             * @param node
             */
            setLabelRender: function(node){

                //取得原来的长度
                var oldWidth = nodeShapeRelative.getSingleNodeWidth(node);

                //设置文本的shape
                node.shape.nodeShape(node);

                if(node.graph.selected){
                    node.graph.selected.shape.selectedShape(node);
                }

                var newWidth = nodeShapeRelative.getSingleNodeWidth(node);
                var gap = newWidth - oldWidth;

                //如果改变label的节点为右方向节点,则只向右移动该节点的子节点
                if(node.direction === 1){
                    DataHelper.forEach(node.children, function(child){
                        child.translate(gap, 0);
                    });

                    //右节点的边需要重画
                    if(node.shape && node.connectFather){
                      this._drawEdge(node.connectFather);
                    }

                }
                //如果改变label的节点为左方向节点,则向左移动该节点(translate回递归)和toolbar
                else if(node.direction === -1){
                    node.translate(-gap, 0);

                }
                //如果节点为根结点
                else if(node.isRootNode()){
                  node.translate(-gap/2, 0);
                  DataHelper.forEach(node.children, function(child){
                    if(child.direction === 1){
                      child.translate(gap, 0);
                    }else if(child.direction === -1){
                      child.translate(-gap/2, 0);
                    }
                  });
                }

            },

            /**
             * 根结点渲染
             * @param node
             */
            rootNodeRender: function(rootNode){
                var self = this;
                var oldWidth = nodeShapeRelative.getSingleNodeWidth(rootNode);

                rootNode.shape.nodeShape(rootNode, self.type);
                var newWidth = nodeShapeRelative.getSingleNodeWidth(rootNode);
                var gap = newWidth - oldWidth;

                rootNode.translate(-gap/2, 0);
                DataHelper.forEach(rootNode.children, function(child){
                    if(child.direction === 1){
                        child.translate(gap, 0);
                    }
                });



            },


            /**
             * 创建node的shape
             * @param node
             * @private
             */
            drawNode: function(node){


                //创建node的shape对象
                var paper = this.paper;
                //已设置node的x和y时才能渲染节点
                var label = paper.text(node.x, node.y, node.label);
                var textBox = label.getBBox();
                //得到矩形的长度
                var rectWidth = textBox.width + this._widthNodePadding;
                var rectHeight = textBox.height + this._heightNodePadding;


                var rect = paper.rect(node.x, node.y,
                    nodeShapeRelative.nodeDefaultWidth,
                    nodeShapeRelative.nodeDefaultHeight, 4)
                    .data('id', node.id);

                label.toFront();


                node.shape = paper.set().push(label).push(rect);

                node.shape.nodeShape(node);

            },

            /**
             * 点击画布时,取消graph的选择
             * @param graph
             */
            setCanvasClick: function(graph) {
                var selfRen = this;
                this.canvasDom.addEventListener('mousedown', function(event){
                    if(event.target.nodeName === 'svg'){
                        graph.setSelected(null);
                        selfRen.toolbar.setAllUnactive();
                        $('#label-group input').val('');
                    }
                });

            },


            /**
             * 创建edge的shape,如果已存在则删除原边重绘(重新设置edge的shape)
             * @param edge 边对象
             */
            _drawEdge: function(edge){
                var edgeDraw = EdgeDraw(edge);
                edgeDraw.drawEdge();
            },

            /**
             * 重新设置当前节点的子节点的位置
             * @param node 当前节点
             * @private
             */
            _reRenderChildrenNode: function(node){
                var childrenRenderStrategy = ChildrenRenderFactory.createRenderStrategy(node);
                childrenRenderStrategy.reRenderChildrenNode(node);
            },

            /**
             * 调整当前节点的兄弟节点的位置
             * @params node 当前节点
             * @params nodeAreaHeight 需要调整的高度(一般为最初改变的节点的高度的一半)
             */
            _resetBrotherPosition: function(node, nodeAreaHeight){
                var brother,  //同级节点
                    brotherY,   //兄弟节点的高度
                    curY = node.y,  //当前节点的高度
                    moveY = nodeAreaHeight / 2; //需要移动的高度

                //移动兄弟节点
                if(node.father){
                    DataHelper.forEach(node.father.children, function(brother){
                        //当同级结点与当前结点direction相同时才上下移动
                        if(brother.direction === node.direction){
                            if(brother !== node){
                                brotherY = brother.y;
                                //如果兄弟节点在当前节点的上面,则向上移动
                                if(brotherY < curY){
                                    brother.translate(0, -moveY);
                                }
                                //否则,向下移动
                                else{
                                    brother.translate(0, moveY);
                                }
                            }
                        }
                    });

                }

                //递归父节点
                if(node.father){
                    this._resetBrotherPosition(node.father, nodeAreaHeight);
                }

            },
            /**
             * 递归删除节点的shape
             * @param node
             * @private
             */
            removeNodeAndChildrenShape: function(node){
                var self = this;
                //删除节点和边的shape
                if(node.shape){
                    node.shape.remove();
                    node.shape = null;
                }
                if(node.connectFather.shape){
                    node.connectFather.shape.remove();
                    node.connectFather = null;
                }

                DataHelper.forEach(node.children, function(child){
                    self.removeNodeAndChildrenShape(child);
                });


            },

            /**
             * 设置node的拖动
             * @param node
             * @private
             */
            _setDrag: function(node){
                var DragHandle = Drag(node, {
                    toolbar: this.toolbar,
                    viewportHandle: this.viewportHandle,
                    enableRender: this.enableRender
                });

                DragHandle.setDrag();

            }




        };


        return Renderer;
    });