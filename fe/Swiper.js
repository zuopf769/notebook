/**
 * 横向滑屏插件
 *
 * @file touch.js
 * @author zoupengfei01
 *
 */


function Touch(parentCon, scrollCon, swipeW, swipeCb) {
    // 父容器
    this.parentCon = parentCon;
    // 滚动容器
    this.scrollCon = scrollCon;
    // 每个item的宽度
    this.swipeW = swipeW;
    // 切换成功后的回调
    this.swipeCb = swipeCb;
    // 卡片个数
    this.cardSize = this.scrollCon.children().size();
    // 父容器宽度
    this.wrapW = parentCon.width();
    // 滚动容器宽度
    this.scrollerWidth = this.scrollCon.width();
    // 滚动最大距离
    this.maxScrollX = this.wrapW - this.scrollerWidth - 10 * 2;
    // 滚动容器左边距
    this.paddingLeft = this.scrollCon.offset().left;
    // 是否跟随手指滑动中
    this.isMoving = false;
    // 卡片是否在过渡动画中
    this.isInTransition = false;
    // 当前卡片index
    this.curCardIndex = 0;
    this.init();
}

Touch.prototype = {
    init: function () {
        var oThis = this;
        // 记录上次的水平偏移量
        this.offsetX = 0;
        oThis.scrollCon.on('touchstart', function (e) {
            // 跟随手动动或者过渡动画中
            if (oThis.isMoving || oThis.isInTransition) {
                return;
            }
            var touches = e.touches ? e.touches[0] : e;
            oThis.startX = touches.screenX;
            oThis.startY = touches.screenY;
            oThis.startTime = oThis.getTime();

            oThis.isMoving = true;

        });
        oThis.scrollCon.on('touchmove', function (e) {
            // 滑动中
            oThis.isMoving = true;
            var touches = e.touches ? e.touches[0] : e;
            var timestamp = oThis.getTime();
            oThis.movingX = touches.screenX;
            oThis.movingY = touches.screenY;

            // 水平偏移量
            var diffScreenX = oThis.movingX - oThis.startX;
            // scoller容器应该移动的距离
            var moveScreenX = oThis.offsetX + diffScreenX;

            // 滑动方向
            var moveDirection = oThis.swipeDirection(oThis.startX, oThis.movingX, oThis.startY, oThis.movingY);

            // 不能阻止页面的纵向滚动
            if (moveDirection === 'Left' || moveDirection === 'Right') {
                e.preventDefault();
                e.stopPropagation();
            }

            // 超过边缘滑动有阻力
            if (moveScreenX > 0 || moveScreenX < oThis.maxScrollX) {
                diffScreenX = diffScreenX * 2 / 3;
                moveScreenX = oThis.offsetX + diffScreenX;
            }

            oThis.scrollCon.css({
                '-webkit-transform': 'translate3d(' + moveScreenX + 'px, 0, 0)',
                '-webkit-transition-duration': 'none'
            });
        });

        oThis.scrollCon.on('touchend', function (e) {
            var touches = e.changedTouches ? e.changedTouches[0] : e;
            oThis.endX = touches.screenX;
            oThis.endY = touches.screenY;

            oThis.endTime = oThis.getTime();
            var duration = oThis.endTime - oThis.startTime;

            // 本次滚动偏移量
            var diffScreenX = oThis.endX - oThis.startX;

            // 滑动方向
            var moveDirection = oThis.swipeDirection(oThis.startX, oThis.endX, oThis.startY, oThis.endY);

            // 滑动偏移量大于10小于30切到下一张卡或前一张卡
            // 小于300ms认为是左滑右滑动
            if (duration < 300 || (Math.abs(diffScreenX) > 10 && Math.abs(diffScreenX) < 30)) {
                scrollToFun(moveDirection);
            }
            else {
                if (Math.abs(diffScreenX) >= (oThis.swipeW / 3)) {
                    scrollToFun(moveDirection);
                }
                else {// 归位
                    oThis.scrollTo(oThis.offsetX, '300ms');
                }
            }
            oThis.isMoving = false;

            // 切换卡片还是归位
            function scrollToFun(moveDirection) {
                var x;
                if (moveDirection === 'Right') {// 右滑
                    oThis.curCardIndex = oThis.curCardIndex - 1 < 0 ? 0 : oThis.curCardIndex - 1;
                    if (oThis.curCardIndex === 0) {
                        oThis.scrollTo(0, '300ms');
                    }
                    else {
                        if (oThis.curCardIndex === oThis.cardSize - 2) {
                            x = oThis.offsetX
                                 + (oThis.swipeW - ($(window).width() - oThis.swipeW - 10
                                 - oThis.paddingLeft)) + oThis.paddingLeft;
                        }
                        else {
                            x = oThis.offsetX + (oThis.swipeW + 10);
                        }
                        oThis.scrollTo(x, '300ms');
                    }

                }
                else if (moveDirection === 'Left') {// 左滑
                    oThis.curCardIndex = (oThis.curCardIndex + 1) >= oThis.cardSize
                        ? oThis.cardSize - 1 : oThis.curCardIndex + 1;
                    if (oThis.curCardIndex === oThis.cardSize - 1) {
                        oThis.scrollTo(oThis.maxScrollX, '300ms');
                    }
                    else {
                        if (oThis.curCardIndex === 1) {
                            x = oThis.offsetX - oThis.paddingLeft - oThis.swipeW;
                        }
                        else {
                            x = oThis.offsetX - oThis.swipeW - 10;
                        }
                        oThis.scrollTo(x, '300ms');
                    }
                }
            }



        });
    },
    scrollTo: function (x, time) {
        this.isInTransition = true;
        var oThis = this;
        setTimeout(function () {
            oThis.isInTransition = false;
        }, time);
        this.scrollCon.css({
            '-webkit-transform': 'translate3d(' + x + 'px, 0, 0)',
            '-webkit-transition-timing-function': 'cubic-bezier(0.1, 0.3, 0.5, 1)',
            '-webkit-transition-duration': time
        }).attr('x', x);
        this.offsetX = x;
        $.isFunction(oThis.swipeCb) && oThis.swipeCb();

    },
    // 滑动方向
    swipeDirection: function (x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? (x1 - x2 > 0 ? 'Left' : 'Right')
            : (y1 - y2 > 0 ? 'Up' : 'Down');
    },
    // 获取当前时间
    getTime: function () {
        return new Date().getTime();
    }
};

module.exports = Touch;
