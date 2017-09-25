/**
 * @file 左右滑动组件
 *       一开始写的，跟屎一样。。。
 */

'use strict';

import './Swipe.less';


var React = require('react');
var ReactDOM = require('react-dom');
var Hammer = require('../hammer.js');

var has3d = !($.os.android && parseFloat($.os.version) < 4) && $.support.has3d;
var styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
    child: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        overflow: 'hidden'
    }
};

var isIOS8 = $.os.iphone && parseFloat($.os.version) >= 8;

/**
 * bug详情看这里：
 *     http://www.cnblogs.com/EX32/p/4366306.html
 *     https://code.google.com/p/android/issues/detail?id=19827
 *     http://www.web-tinker.com/article/20364.html
 */
var touchmoveBug = !!($.os.android && parseFloat($.os.version) < 4.1);
var touchmoveBugFn = function (e) {
    e.preventDefault();
};


var Swipe = React.createClass({
    propTypes: {
        expandItemCount: React.PropTypes.number,
        startSlide: React.PropTypes.number,
        panelWidth: React.PropTypes.number,
        onSwipe: React.PropTypes.func
    },

    _getShowPanels: function (currentIndex, allPanels) {
        var me = this;
        var props = me.props;

        var showPanels = [];
        allPanels = allPanels || props.allPanels;

        if (currentIndex < 0) {
            currentIndex = 0;
        }

        var i = currentIndex - props.expandItemCount;
        var l = currentIndex + props.expandItemCount + 1;
        if (i < 0) {
            i = 0;
        }
        if (l > allPanels.length) {
            l = allPanels.length;
        }

        for (; i < l; i++) {
            showPanels.push({
                index: i,
                content: allPanels[i]
            });
        }

        return showPanels;
    },
    getInitialState: function () {
        var me = this;
        var props = me.props;

        var currentIndex = props.startSlide;
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        var me = this;
        var timer = null;
        $(window).resize(function () {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                timer = null;
                me.setState({
                    panelWidth: document.body.scrollWidth
                });
            }, 300);
        });

        return {
            currentIndex: currentIndex,
            panelWidth: document.body.scrollWidth,
            showPanels: me._getShowPanels(currentIndex)
        }
    },

    getDefaultProps: function () {
        return {
            el: null,
            HM: null,
            _startTranslate: {},
            _translate: {},

            // 向两边扩展的数量
            expandItemCount: 2,
            allPanels: [],
            startSlide: 0,
            onSwipe: function () {}
        };
    },

    _initHammer: function () {
        var me = this;
        var props = me.props;
        window.fuckfff = this;
        var el = ReactDOM.findDOMNode(me);

        if (this.el !== el) {
            this.el = $(el);

            me._destroyHammer();

            var HM = Hammer(el, {
                drag_lock_to_axis: true
            });

            HM.on("touch release dragleft dragright swipeleft swiperight", me._eventHandler);

            this.HM = HM;

            me._clearDragTimer();
        }
    },

    _destroyHammer: function () {
        var HM = this.HM;
        if (HM) {
            HM.off("touch release dragleft dragright swipeleft swiperight", this._eventHandler);
        }
    },

    componentDidMount: function () {
        this.el = this.props.el;
        this._initHammer();
        // console.log('componentDidMount');


        if (touchmoveBug) {
            $('body').on('touchmove', touchmoveBugFn);
        }
    },

    componentWillReceiveProps: function (nextProps) {
        var me = this;

        me.setState({
            currentIndex: nextProps.startSlide,
            showPanels: me._getShowPanels(nextProps.startSlide, nextProps.allPanels)
        });
    },

    componentDidUpdate: function () {
        this._initHammer();
        // console.log('componentDidUpdate');

        var w = this.state.panelWidth;
        var nw = document.body.scrollWidth;
        if (w !== nw) {
            this.setState({
                panelWidth: nw
            });
        }
    },

    componentWillUnmount: function () {
        this._destroyHammer();

        if (touchmoveBug) {
            $('body').off('touchmove', touchmoveBugFn);
        }
    },

    // shouldComponentUpdate: function (nextProps) {
    //     return true;
    // },

    slideTo: function (index) {
        var me = this;


        if (index >= 0 && index < me.props.allPanels.length) {

            var setedState = false;
            var timer;

            var callback = function (a) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (setedState) {
                    return;
                }
                setedState = true;

                me.setState({
                    currentIndex: index,
                    showPanels: me._getShowPanels(index)
                });
                me.props.onSwipe(index);
            };
            timer = setTimeout(callback, 300);
            me.el.one('transitionend', function () {
                callback();
            });
        } else {
            index = Math.max(0, Math.min(me.props.allPanels.length - 1, index));
        }
        var offset = me._getPanelOffset(index);
        me._setTranslate(offset, true);


    },
    slideToPrev: function () {
        var currentIndex = this.state.currentIndex;
        this.slideTo(currentIndex - 1);
    },
    slideToNext: function () {
        var currentIndex = this.state.currentIndex;
        this.slideTo(currentIndex + 1);
    },
    _getPanelOffset: function (index) {
        return -index * document.body.scrollWidth;
    },
    _getTranslateStr: function (x) {
        if (has3d) {
            return "translate3d("+ x +"px,0,0) scale3d(1,1,1)";
        } else {
            return "translate("+ x +"px,0)";
        }
    },
    _setTranslate: function (x, animate) {
        var me = this;
        var props = me.props;
        var el = this.el;

        el.removeClass('swipe-animate');

        if (animate) {
            el.addClass('swipe-animate');
        }

        el.css('-webkit-transform', me._getTranslateStr(x));
        el.css('transform', me._getTranslateStr(x));
    },
    _handleTouch: function (gesture) {
        // console.log('only touch');
        var me = this;
        var props = me.props;
        var el = this.el;
        var _startTranslate = props._startTranslate;
        var _translate = props._translate;


        var transform = el.css('-webkit-transform');
        var translate = transform.match(/translate(3d)?\((.*?)\)/);

        if (translate) {
            translate = translate[2].split(',');
            _startTranslate.x = parseInt(translate[0], 10);
            _startTranslate.y = parseInt(translate[1], 10);
        } else {
            _startTranslate.x = 0;
            _startTranslate.y = 0;
        }

        _translate.x = _startTranslate.x;
        _translate.y = _startTranslate.y;

        el.removeClass('swipe-animate');
    },
    _handleDrag: function (gesture, moveRate) {
        // console.log('only drag');
        var me = this;
        var props = me.props;
        var el = this.el;
        var _startTranslate = props._startTranslate;
        var _translate = props._translate;


        var dx = gesture.deltaX * moveRate;

        var x = _startTranslate.x + dx;

        me._setTranslate(x);
        _translate.x = x;
    },
    _handleRelease: function (gesture) {
        // console.log('only release');
        var me = this;
        var props = me.props;
        var el = this.el;
        var _startTranslate = props._startTranslate;
        var _translate = props._translate;

        var winWidth = document.body.scrollWidth;

        var x = _translate.x;

        var diff = x - _startTranslate.x;

        // 没有变化则不做处理
        if (diff === 0) {
            return;
        }

        if (Math.abs(diff) > (winWidth * 0.2)) {
            // x = _startTranslate.x + (x > 0 ? 1 : -1) * winWidth;
            diff > 0 ? me.slideToPrev() : me.slideToNext();
        } else {
            x = _startTranslate.x;
            me._setTranslate(x, true);
        }

        // me._setTranslate(x, true);
    },

    _clearDragTimer: function () {
        var me = this;

        clearTimeout(me._dragTimer);
        me._dragTimer = null;
    },
    _setDragTimer: function (gesture) {

        var me = this;
        try {
            var winWidth = me.state.panelWidth;
            var clientX = gesture.touches[0].clientX;
            var velocityX = gesture.velocityX;
            var distance = gesture.distance;

            // console.log(clientX, velocityX, gesture.distance, gesture.distance / gesture.velocityX, gesture);

            if (
                winWidth - clientX < 5 ||
                (winWidth - clientX < 25 && (velocityX > 0.2 || distance < 10))
            ) {
                me._dragTimer = setTimeout(function () {
                    if (velocityX < 0.2) {
                        me._handleRelease(gesture);
                    } else {
                        me.slideToPrev();
                    }
                    gesture.stopDetect();
                }, 10);
            } else {
                me._dragTimer = setTimeout(function () {
                    me._handleRelease(gesture);
                    gesture.stopDetect();
                }, 500);
            }
        } catch (ex) {
            me._clearDragTimer();
        }
    },
    _eventHandler: function(ev){
        var me = this;
        var currentIndex = me.state.currentIndex;
        var totalCount = me.props.allPanels.length;

        var gesture = ev.gesture;
        var target = ev.target;
        var moveRate = 1;

        me._clearDragTimer();

        // gesture.preventDefault();

        // console.log('hammer event : ' + ev.type, gesture);
        // return;

        switch(ev.type) {
            case 'touch':
                me._handleTouch(gesture);
                break;

            case 'dragright':
            case 'dragleft':
                if ((currentIndex === 0 && gesture.deltaX > 0) ||
                    (currentIndex === totalCount - 1) && gesture.deltaX < 0) {
                    moveRate = 0.4;
                }
                gesture.preventDefault();
                me._handleDrag(gesture, moveRate);
                if (ev.type === 'dragright' && isIOS8) {
                    me._setDragTimer(gesture);
                }
                break;

            case 'swipeleft':
                gesture.preventDefault();
                me.slideToNext(true);
                gesture.stopDetect();
                break;

            case 'swiperight':
                gesture.preventDefault();
                me.slideToPrev(true);
                gesture.stopDetect();
                break;

            case 'release':
                me._handleRelease(gesture);

                break;
        }

    },

    render: function() {
        // debugger;
        var me = this;
        var currentIndex = me.state.currentIndex;

        var showPanels = me.state.showPanels;
        var panelWidth = me.state.panelWidth;
        // var diff = showPanels.length > 2 ? 1 : 0;
        var list = showPanels.map(function (panel, i) {
            var style = $.extend({}, styles.child);

            style.left = panel.index * panelWidth;
            style.width = panelWidth;
            // panel.content.props.active = panel.index === currentIndex;
            return (
                <li key={panel.content.key} style={style} data-index={panel.index}>
                    {panel.content}
                </li>
            );
        });

        var containerStyle = $.extend({}, styles.container);
        containerStyle['WebkitTransform'] = me._getTranslateStr(me._getPanelOffset(currentIndex));
        containerStyle['transform'] = me._getTranslateStr(me._getPanelOffset(currentIndex));
        containerStyle.width = panelWidth * me.props.allPanels.length;
        return (
            <ul style={containerStyle} className={'swipelist ' + me.props.className}>
                {list}
            </ul>
        );
    }
});

module.exports = Swipe;
