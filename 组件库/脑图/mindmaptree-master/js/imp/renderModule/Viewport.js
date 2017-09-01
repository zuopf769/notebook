
define([], function(){
    /**
     * 画布视野设置模块
     * @param aCanvasDom 画布的dom对象
     * @param aPaper 画布的paper对象
     * @returns {{setViewportDrag: setViewportDrag}}
     * @constructor
     */
    var Viewport = function(aCanvasDom, aPaper){
        var canvasDom = aCanvasDom;
        var paper = aPaper;
        var scale = 1.0;    //规模默认为1.0
        var canvasWidth = canvasDom.clientWidth || 400;        //视窗宽度
        var canvasHeight = canvasDom.clientHeight || 400;      //视窗高度
        var viewBox = {
            x: 0,
            y: 0,
            width: canvasWidth,
            height: canvasHeight
        };

        var dragging = false;
        var lastX = 0;
        var lastY = 0;
        var dX, dY, realScale;


        /**
         * 设置svg视野
         * @param x 视野x坐标
         * @param y 视野y坐标
         * @param aScale 视野规模
         */
        function _setViewport(x, y ,aScale){
            scale = aScale;
            var realScale = 1.0 / scale;
            if(scale > 5){
                scale = 5;
            }
            //设置视野最小规模
            if(scale < 0.2){
                scale = 0.2;
            }

            //设置视野对象
            viewBox.x = x;
            viewBox.y = y;
            viewBox.width = canvasWidth * realScale;
            viewBox.height = canvasHeight * realScale;

            //设置视野
            paper.setViewBox(viewBox.x, viewBox.y, viewBox.width, viewBox.height);
        }

        function mousedownHandle(event){
            realScale = 1.0 / scale;

            lastX = event.layerX;
            lastY = event.layerY;
            dragging = true;
        }

        function mousemoveHandle(event){
            if(dragging){
                dX = -(event.layerX - lastX) * realScale;
                dY = -(event.layerY - lastY) * realScale;

                viewBox.x += dX;
                viewBox.y += dY;

                _setViewport(viewBox.x, viewBox.y, scale);

                lastX = event.layerX;
                lastY = event.layerY;

                //console.log(viewBox.x, viewBox.y);
            }
        }

        function mouseupHandle(event){
            if(dragging){
                dragging = false;
            }
        }

        /**
         * 画布视野移动设置
         */
        function setViewportDrag(){
            //添加画布的鼠标点击事件
            canvasDom.addEventListener('mousedown', function(event){
                if(event.target.nodeName !== 'svg') { return };
                mousedownHandle(event);
                /*
                 realScale = 1.0 / scale;

                 lastX = event.layerX;
                 lastY = event.layerY;
                 dragging = true;*/
            });

            //添加画布的鼠标移动事件
            canvasDom.addEventListener('mousemove', function(event){
                if(event.target.nodeName !== 'svg') { return };
                mousemoveHandle(event);
                /*
                 if(dragging){
                 dX = -(event.layerX - lastX) * realScale;
                 dY = -(event.layerY - lastY) * realScale;

                 viewBox.x += dX;
                 viewBox.y += dY;

                 _setViewport(viewBox.x, viewBox.y, scale);

                 lastX = event.layerX;
                 lastY = event.layerY;
                 }*/
            });

            //添加画布的鼠标释放事件
            canvasDom.addEventListener('mouseup', function(event){
                if(event.target.nodeName !== 'svg') { return };
                mouseupHandle(event);
                /*
                 if(dragging){
                 dragging = false;
                 }*/
            });
        }


        return {
            isDragging: function(){
                return dragging;
            },
            setViewportDrag: setViewportDrag,
            getViewbox: function(){
                return viewBox;
            },
            mousedownHandle: mousedownHandle,
            mouseupHandle: mouseupHandle,
            mousemoveHandle: mousemoveHandle
        };
    };

    return Viewport;
});