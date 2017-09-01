
/**
 * 用于设置shape的属性
 */
define(['raphael'], function(Raphael){

    /**
     * 将label和rect设置为合适的位置
     * @param label
     * @param rect
     * @param nodeX
     * @param nodeY
     * @param nodePadding
     */
    function setNodePosition(label, rect, nodeX, nodeY, nodePadding){
        var textBox = label.getBBox();
        var rectWidth = textBox.width + nodePadding.width;
        var rectHeight = textBox.height + nodePadding.height;

        label.attr({
            x: nodeX + rectWidth * 0.5,
            y: nodeY + rectHeight * 0.5
        });
        rect.attr({
            width: rectWidth,
            height: rectHeight
        })
    }

    /**
     * 设置根结点的外形
     * @param shape
     * @param nodeX
     * @param nodeY
     * @param text
     */
    function setRootShape(shape, nodeX, nodeY, text, mindmapType){
        var label = shape[0];
        var rect = shape[1];


        label.attr({
            'font-size': 25,
            'fill': 'white',
            'text': text
        });

        rect.attr({
            'rootAndFirstStroke': null
        });

        if(mindmapType === 'desktop'){
            rect.attr({
                'fill': '#428bca'
            });
        }else if(mindmapType === 'taskMore'){
            rect.attr({
                'fill': '#64d4a5'
            });
        }

        var rootNodepadding = {
            width: 42,
            height: 24
        };
        setNodePosition(label, rect, nodeX, nodeY, rootNodepadding);

    };

    /**
     * 设置第一层节点的外形
     * @param shape
     * @param nodeX
     * @param nodeY
     * @param text
     */
    function setFirstLevelShape(shape, nodeX, nodeY, text){
        var label = shape[0];
        var rect = shape[1];

        label.attr({
            'font-size': 16,
            'text': text
        });

        rect.attr({
            'fill': 'white',
            'rootAndFirstStroke': null
        });

        var firstLevelPadding = {
            width: 40,
            height: 20
        };

        setNodePosition(label, rect, nodeX, nodeY, firstLevelPadding);



    };


    /**
     * 设置n>=2层节点的外形
     * @param shape
     * @param nodeX
     * @param nodeY
     * @param text
     */
    function setSecondMoreShape(shape, nodeX, nodeY, text){
        var label = shape[0];
        var rect = shape[1];

        label.attr({
            'font-size': 15,
            'text': text
        });

        rect.attr({
            'secondMoreStroke': null
        });

        var secondMorePadding = {
            width: 10,
            height: 10
        };

        setNodePosition(label, rect, nodeX, nodeY, secondMorePadding);
    };



    /**
     * 根绝节点的类型，设置节点的外形
     * @param node
     */
    Raphael.st.nodeShape = function(node, mindmapType){
        mindmapType = mindmapType || 'desktop';
        if(node.isRootNode()){
            setRootShape(this, node.x, node.y, node.label, mindmapType);
        }else if(node.isFirstLevelNode()){
            setFirstLevelShape(this, node.x, node.y, node.label);
        }else{
            setSecondMoreShape(this, node.x, node.y, node.label);
        }
    };

    /**
     * 被选择的外形
     */
    Raphael.st.selectedShape = function(node){
        //@workaround:暂时选择的样式
        this[1].attr({
            stroke: '#ff0033',
            'stroke-width': 2.5

        });
        this.attr({
            'opacity': 1
        });

        this[0].toFront();
    };

    /**
     * 取消选择的外形：根据节点的类型不同而改变取消选择的外形
     * @param node
     */
    Raphael.st.unSelectedShape = function(node){
        if(node.isSecondMoreNode()){
            this[1].attr({
                'secondMoreStroke': null
            })
        }else{
            //@workaround:暂时被选择的样式
            this[1].attr({
                'rootAndFirstStroke': null
            })
        }

    };

    /**
     * 重叠时节点的外形
     * @param node
     */
    Raphael.st.overlapShape = function(node){
        this[1].attr({
            stroke: 'blue'
        })
    };

    /**
     * 取消重叠时，节点的外形：设置根据节点的类型不同而不同
     * @param node
     */
    Raphael.st.unOverlapShape = function(node){
        if(node.isSecondMoreNode()){
            this[1].attr({
                'secondMoreStroke': null
            })
        }else{
            this[1].attr({
                'rootAndFirstStroke': null
            });
        }
    };

    Raphael.st.setLabel = function(node){
        this[0].attr({
            'text': node.label
        })
    };


    /**
     * 透明样式：用于拖动节点时的透明显示
     * @param node
     */
    Raphael.st.dragNodeOpacityShape = function(node){
        Raphael.st.unSelectedShape.call(this, node);

        this.attr({
            opacity: 0.4
        });
        this.toFront();

    };

    Raphael.st.opacityShape = function(){
        this.attr({
            opacity: 0.5
        })
    };


    Raphael.st.unOpacityShape = function(){
        this.attr({
            opacity: 1
        })
    };


    return {
        init: function(paper){

            //设置默认的属性
            //默认的根结点和第一层节点的外框笔触样式
            paper.customAttributes.rootAndFirstStroke = function(){
                return {
                    'stroke': '#808080',
                    'stroke-width': 1
                }
            };

            //默认的n>=2层节点的外框笔触样式
            paper.customAttributes.secondMoreStroke = function(){
                return {
                    'stroke': 'none'
                }
            };
        }
    }
});