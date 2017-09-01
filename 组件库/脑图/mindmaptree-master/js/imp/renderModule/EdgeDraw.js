
define([], function(){
    var EdgeDraw = function(edge){
        var source = edge.source;
        var target = edge.target;
        var paper = source.shape[0].paper;

        var  shape;
        var sourceBox = source.shape.getBBox();
        var targetBox = target.shape.getBBox();

        //画根结点到第一层节点的曲线
        function drawCurve(){
            var x1 = (sourceBox.x + sourceBox.x2)/2;
            var y1 = (sourceBox.y + sourceBox.y2)/2;
            var x2 = (targetBox.x + targetBox.x2)/2 - target.direction * targetBox.width/2;
            var y2 = (targetBox.y + targetBox.y2)/2;
            var k1 = 0.8;
            var k2 = 0.2;
            var pathPoints = {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                x3: x2 - k1 * (x2 - x1),
                y3: y2 - k2 * (y2 - y1)

            };

            var edgePath = paper.path(Raphael.fullfill("M{x1},{y1}Q{x3},{y3},{x2},{y2}",pathPoints));
            edgePath.attr({
                'stroke': '#999',
                'stroke-width': 2
            });
            edgePath.toBack();
            shape = paper.set().push(edgePath);

            //如果target存在connectFather,重画这条边
            if(edge.shape){
                edge.shape[0].remove();
                edge.shape = shape;
            }{
                edge.shape = shape;
            }
        }

        //画其他边--三层边
        function drawThreePath(){
            var xs, ys, xt1, xt2;

            if(target.direction == 1){
                xs = sourceBox.x2;
                xt1 = targetBox.x;
                xt2 = targetBox.x2;
            }else if(target.direction == -1){
                xs = sourceBox.x;
                xt1 = targetBox.x2;
                xt2 = targetBox.x
            }



            var yt1 = targetBox.y2 - 3;
            var yt2 = yt1;

            //@workaround:当为第二层节点时，短边出发点稍下

            if(source.isSecondMoreNode()){
                ys = sourceBox.y2 - 3;
            }else {
                ys = (sourceBox.y + sourceBox.y2)/2;
            }


            var xc = (xs + xt1)/2;
            var yc = ys;


            var shortPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}",{
                x1: xs, y1: ys, x2: xc, y2: yc
            }));
            var connectPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}",{
                x1: xc, y1: yc, x2: xt1, y2: yt1
            })).attr({
                'stroke': '#999',
                'stroke-width': 2
            });
            var targetUnderPath = paper.path(Raphael.fullfill("M{x1},{y1}L{x2},{y2}",{
                x1: xt1, y1: yt1, x2: xt2, y2: yt2
            }));

            shape = paper.set().push(shortPath).push(connectPath).push(targetUnderPath);

            //如果target存在connectFather,重画这条边
            if(edge.shape){
                edge.shape[0].remove();
                edge.shape[1].remove();
                edge.shape[2].remove();
                edge.shape = shape;
            }{
                edge.shape = shape;
            }
        }

        return {
            drawEdge: function(){
                if(source.isRootNode()){
                    drawCurve();
                }else{
                    drawThreePath();
                }

                return shape;
            }
        }
    };

    return EdgeDraw;
});