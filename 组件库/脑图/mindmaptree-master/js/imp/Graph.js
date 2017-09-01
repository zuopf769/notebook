/**
 * Created by rockyren on 15/2/5.
 */
define(['imp/otherModule/DataHelper', 'imp/Renderer'], function(DataHelper){
    var Node, Edge;

    var Graph = function(gRenderer){
        //渲染层的对象
        this.gRenderer = gRenderer;
        this.nodeCount = 0;
        this.edgeCount = 0;

        //节点集合
        this.nodes = {};
        //边集合
        this.edges = {};

        this.selected = null;
        //创建graph时则创建一个根节点,根节点id为0x
        this.root = this._initRoot();
        //@workaround: svg点击事件:如果点击的是canvas,取消selected
        this.gRenderer.setCanvasClick(this);
    };

    Graph.prototype = {
        constructor: Graph,
        /**
         * 增加节点,需要指定父节点
         * @param parent 新增节点的父节点
         * @param attr
         * @returns {Node}
         */
        addNode: function(parent, attr){
            //数据变更部分
            var node = new Node(this, attr);
            this.nodes[node.id] = node;
            this.setParentData(parent, node);

            //新增节点渲染
            this.gRenderer.addNodeRender(node);

            return node;
        },
        addEdge: function(source, target, attr){
            var edge = new Edge(this, source, target, attr);
            this.edges[edge.id] = edge;
            return edge;
        },
        //canRender:boolean，设置是否可渲染
        setEnableRender: function(canRender){
            //this.gRenderer.enableRender = new Boolean(canRender);
            //console.log(this.gRenderer.enableRender);
            this.gRenderer.EnableRender(canRender);
        },

        /**
         * 初始化根结点
         * @returns {*}
         * @private
         */
        _initRoot: function(){
            var root = null;
            root = this.addNode(null, {
                x: this.gRenderer.getCanvasWidth() / 2 -50,
                y: 200,
                id: 0});
            root.label = "中心主题";
            this.gRenderer.rootNodeRender(root);

            return root;

        },


        setRoot: function(attr){
            if(!attr) { attr = {} };
            if(attr.hasOwnProperty('label')){
                this.root.label = attr.label;
                this.gRenderer.rootNodeRender(this.root);

            }
            if(attr.hasOwnProperty('x') && attr.hasOwnProperty('y')){
                this.root.translate(attr.x - this.root.x, attr.y - this.root.y);
            }
        },
        setSubTaskNodeClick: function(node, context){
            this.gRenderer.setSubTaskNodeClick(node, context);
        },

        setParent: function(parentId, childId){
            var self = this;

            var parent = self.nodes[parentId];
            var child = self.nodes[childId];
            if(child === parent || parent ===null) { return null; }
            if(child.father === parent) { return; }
            else{
                //需要设置新父节点的children，才能正确删除重绘子节点时
                delete child.father.children[child.id];
                //在child.connectFather改变之前，递归删除子节点
                this.gRenderer.removeNodeRender(child);
            }

            this.setParentData(parent, child);

            this._resetChildrenProperty(child.children);

            //在新的father上递归添加原节点（递归添加）的渲染
            this.gRenderer.setParentRender(child);

        },
        //重新设置节点的direction和edge等
        _resetChildrenProperty: function(children){
            var self = this;
            DataHelper.forEach(children, function(child){
                child.connectFather = self.addEdge(child.father, child);


                self._setNodeDirection(child);
                self._resetChildrenProperty(child.children);
            });
        },
        setParentData: function(parent, child){

            //如果设置父节点为自己或parent为null时,则返回null
            if(child === parent || parent === null) { return null };

            //如果parent与child的父节点相等,则退出
            if(child.father === parent) { return child.connectFather };

            this._removeParentConnect(child);

            //设置child的father
            child.father = parent;
            //设置新父节点的children;
            child.father.children[child.id] = child;

            //设置child的connectFather,并创建新边
            child.connectFather = this.addEdge(parent, child);
            //设置新父节点的connectChildren
            child.father.connectChildren[child.connectFather.id] = child.connectFather;

            this._setNodeDirection(child);



            return child.connectFather;
        },
        _removeParentConnect: function(node){
            //若child存在旧父节点,则删除旧父节点child上该节点的引用
            if(node.father) {
                delete node.father.children[node.id];
            }
            //若child存在旧父节点,则删除旧父节点connectChildren上与child的边的引用
            if(node.connectFather) {
                delete node.father.connectChildren[node.connectFather.id];
            }
        },

        //获得当前节点可成为父节点候选的节点集
        getParentAddableNodeSet: function(node){
            var self = this;

            var addableNodeSet = {};
            //获得this.nodes的副本
            DataHelper.forEach(self.nodes, function(curNode){
                addableNodeSet[curNode.id] = curNode;
            });

            var notAddableNodeSet = self.getChildrenNodeSet(node);
            notAddableNodeSet[node.id] = node;
            if(node.father){
                notAddableNodeSet[node.father.id] = node.father;
            }

            //在this.nodes副本中除去当前节点及该节点的所有子节点的引用
            DataHelper.forEach(notAddableNodeSet, function(curNode){
                delete addableNodeSet[curNode.id];
            });
            return addableNodeSet;

        },

        /**
         * 删除节点
         * 先先断开父节点的children和connectChildren连接，再渲染删除，然后删除递归数据
         * @param node
         */
        removeNode: function(node) {
            this._removeParentConnect(node);
            this.gRenderer.removeNodeRender(node);

            this._removeNodeData(node);

        },

        /**
         * 递归删除节点的数据
         * @param node
         * @private
         */
        _removeNodeData: function(node){
            var self = this;
            //删除父节点相关:删除父节点与该节点的边界,从父节点的children上删除该节点,最后删除父节点引用
            //数组中的属性设为undefined,其他引用设为null
            self._removeParentConnect(node);
            node.father = null;
            node.connectFather = null;

            DataHelper.forEach(node.children, function(child){
                self._removeNodeData(child);
            });

            //删除nodes和edges集合中该对象的引用
            delete self.nodes[node.id];
            if(node.connectFather){
                delete self.edges[node.connectFather.id];
            }

        },
        setSelected: function(node){
            if(this.selected == node) { return };
            var oldSelected = this.selected;
            this.selected = node;

            this.gRenderer.setSelectedRender(this.selected, oldSelected);

        },
        /**
         * 设置节点的direction属性
         * -1表示左边,1表示右边,null表示未设置
         * @param node
         * @private
         */
        _setNodeDirection: function(node){
            //如果为第一层节点,则根据左右节点数赋值位置值
            if(node.isFirstLevelNode()){
                if(this._isFirstNodeRightMoreThanLeft()){
                    node.direction = -1;
                }else{
                    node.direction = 1;
                }
            }
            //如果为第n层(n>=2)节点,则按照父节点的direction设置
            else if(!node.isFirstLevelNode() && !node.isRootNode()){
                node.direction = node.father.direction;
            }
        },
        /**
         * 判断第一层节点中右边节点大于(不等于)左边节点
         * @returns boolean
         * @private
         */
        _isFirstNodeRightMoreThanLeft: function(){
            var root = this.root;
            var leftCount = 0,
                rightCount = 0;

            DataHelper.forEach(root.children, function(rootChild){
                if(rootChild.direction === -1){
                    leftCount++;
                }else if(rootChild.direction === 1){
                    rightCount++;
                }
            });

            return rightCount > leftCount;
        },

        /**
         * 设置节点的文本
         * @param node
         * @param label
         */
        setLabel: function(node, label){
            node.label = label;

            //label改变渲染
            this.gRenderer.setLabelRender(node);
        },

        /**
         * 获得node节点所有子节点的集合
         * @param node
         * @returns {{}}
         */
        getChildrenNodeSet: function(node){
            var self = this;
            var childrenNodeSet = {};
            self._makeChildrenNodeSet(node.children, childrenNodeSet);
            return childrenNodeSet;

        },
        _makeChildrenNodeSet: function(children, childrenNodeSet){
            var self = this;
            DataHelper.forEach(children, function(child){
                childrenNodeSet[child.id] = child;
                self._makeChildrenNodeSet(child.children, childrenNodeSet);
            });
        }


    };

    Node = function(g, attr){
        if(!attr) { attr = {} };
        this.graph = g;
        this.gRenderer = g.gRenderer;

        //节点的id
        //this.id = attr.id || ++(this.graph.nodeCount);

        if(attr.hasOwnProperty('id')){
            this.id = attr.id;
        }else{
            this.id = ++(this.graph.nodeCount);
        }


        if(attr.hasOwnProperty('x') && attr.hasOwnProperty('y')) {
            this.x = attr.x;
            this.y = attr.y;
        }else{
            this.x = null;
            this.y = null;
        }

        //节点的直接子节点引用集合
        this.children = {};
        //节点的父节点引用
        this.father = null;

        //与父节点的边的引用
        this.connectFather = null;
        //与子节点的边的引用集合
        this.connectChildren = {};

        //节点的文本
        this.label = attr.label || "任务" + this.id;

        //节点的图形,其类型为Raphael的element或set对象
        this.shape = null;

        //判断在根结点左边还是右边的属性
        this.direction = null;

        this.data = attr.data || null;
    };

    Node.prototype = {
        construct: Node,
        getRootNode: function(){
            if(this === this.graph.root) { return this };
            if(!this.father){
                return this;
            }else{
                var fatherNode = this.father;
                while(fatherNode.father){
                    fatherNode = fatherNode.father;
                }
                return fatherNode;
            }
        },
        isRootNode: function(){
            return this === this.getRootNode();
        },
        childrenCount: function(){
            return DataHelper.count(this.children);
        },
        childrenWithShapeCount: function(){
            var self = this;
            var count = 0;
            DataHelper.forEach(self.children, function(child){
                //console.log(child);
                if(child.shape) {
                    count++;

                }
            });
            return count;
        },
        isFirstLevelNode: function(){
            return this.father && this.father === this.getRootNode();
        },
        isSecondMoreNode: function(){
            return !this.isRootNode() && !this.isFirstLevelNode();
        },
        translate: function(dx, dy){
            var self = this;
            self.x += dx;
            self.y += dy;

            //节点移动渲染
            this.gRenderer.translateSingleNodeRender(self, dx, dy);


            DataHelper.forEach(self.children, function(child){
                child.translate(dx, dy);
            });

        }
    };

    Edge = function(g, source, target, attr) {
        if(!attr) attr = {};
        this.graph = g;

        this.id = ++(this.graph.edgeCount);

        //起点节点的引用
        this.source = source;
        //终点节点的引用
        this.target = target;

        //边的图形,其类型为Raphael的element或set对象
        this.shape = null;
    };


    return Graph;
});