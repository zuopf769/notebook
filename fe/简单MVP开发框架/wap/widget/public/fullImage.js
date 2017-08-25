/**
 * @file 大图查看
 */

function FullImage(target) {
    this.isTouchSet = 'ontouchstart' in window;
    this.target = target;
    this.url = target.attr('data-src');
    this.smallUrl = target.attr('src');
    this.px = target.offset().left;
    this.py = target.offset().top;

    this._w = 0;
    this._h = 0;
    this.transform = {
        translateX: 0,
        translateY: 0,
        scale: 1
    };
    this.container = $('<div id="fullImageContainer"></div>');
    this.moving = false;
    this.init();
}

FullImage.prototype = {
    init: function () {
        this.createContainer();
        this.cloneImage();
        this.createFlayer();
        this.initEvents();
    },

    createContainer: function () {
        $('body').append(this.container);
        this.container.css({
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'z-index': 99
        });
    },

    createFlayer: function () {
        var $flayer = $('<div id="fullImage_flayer"></div>');
        $flayer.css({
            'background': '#000',
            'z-index': '998',
            'position': 'fixed',
            'top': 0,
            'left': 0,
            'opacity': 0,
            '-webkit-transition': '0.2s linear opacity'
        });
        this.container.append($flayer);
        this.updateFlayerLayout();
        setTimeout(function () {
            $flayer.css({
                'opacity': 0.98
            });
        },300);

    },

    updateFlayerLayout: function () {
        var _sw = window.innerWidth;
        var _sh = window.innerHeight;
        $('#fullImage_flayer').css({
            'width': _sw,
            'height': _sh
        });
    },

    cloneImage: function () {
        var me = this;
        var img = new Image();
        img.src = this.smallUrl;
        img.onload = function () {
            me._w = img.width;
            me._h = img.height;
            var newImage = $('<img id="fullImage">');
            newImage.attr('src', me.smallUrl);
            me.container.append(newImage);
            newImage.css({
                'width': me._w,
                'height': me._h,
                'position': 'fixed',
                'left': me.px,
                'top': me.py-window.scrollY,
                '-webkit-transition': '0.3s all linear',
                'z-index': 999
            });

            me.loadBigImage();

            setTimeout(function () {
                me.updateImageLayout();
            },20);
        }
    },

    updateImageLayout: function () {
        var me = this;
        var _sw = window.innerWidth;
        var _sh =window.innerHeight;
        if(me._w/me._h > _sw/_sh) {
            $('#fullImage').css({
                'width': _sw,
                'height': _sw/me._w*me._h,
                'left': 0,
                'top': (_sh-_sw/me._w*me._h)/2
            });
        }else{
            $('#fullImage').css({
                'width': _sh/me._h*me._w,
                'height': _sh,
                'left': (_sw-_sh/me._h*me._w)/2,
                'top': 0
            });
        }
        this.transform = {
            'translateX': 0,
            'translateY': 0,
            'scale': 1
        };
        this.animate();
    },

    loadBigImage: function () {
        var me = this;
        var img = new Image();
        img.src = this.url;
        img.onload = function () {
            $('#fullImage').attr('src', me.url);
        }
    },

    destory: function () {
        var me = this;
        var _sw = 0,
            _sh = 0;
        this.px = this.target.offset().left;
        this.py = this.target.offset().top;
        this.container.unbind('touchstart','touchmove','touchend');
        
        $('#fullImage_flayer').css({
            opacity: 0
        });

        $('#fullImage').css({
            'width': me._w,
            'height': me._h,
            'left': me.px,
            'top': me.py-window.scrollY,
            '-webkit-transform': 'translateX(0) translateY(0) scale(1)',
            'z-index': '8',
            'opacity': 0.5
        });
        setTimeout(function () {
            me.container.remove();
        },510);

        $(window).unbind('resize', function () {
            me.updateFlayerLayout();
            me.updateImageLayout();
        });
    },

    initEvents: function () {
        var me = this;
        //resize:
        $(window).bind('resize', function () {
            me.updateFlayerLayout();
            me.updateImageLayout();
        });
        //拖动&&放大缩小
        var _e1 = [0,0],
            _m1 = [0,0],
            _e2 = [0,0],
            _m2 = [0,0],
            _r_translate = [0,0],
            _r_scale = 1;
            _line = 0,
            timeoutFordestory = null,
            start = function () {

            };

        var touchType = '';

        if(this.isTouchSet) {
            this.container.bind('touchstart',function (e) {
                var target = $(e.target);
                if(target.attr('id') != 'fullImage') {
                    touchType = '';
                }else{
                    $('#fullImage').css({'-webkit-transition': '0.05s all linear'});
                }
                e.preventDefault();

                if(e.touches.length == 1 && target.attr('id') == 'fullImage') {
                    touchType = 'drag';
                    _r_translate = [me.transform.translateX, me.transform.translateY];
                }
                _e1 = [e.touches[0].pageX, e.touches[0].pageY];
                _m1 = [e.touches[0].pageX, e.touches[0].pageY];

                if(e.touches.length == 2 && target.attr('id') == 'fullImage') {
                    touchType = 'pinch';
                    _e2 = [e.touches[1].pageX, e.touches[1].pageY];
                    _m2 = [e.touches[1].pageX, e.touches[1].pageY];
                    _line = me.get_triangle_hypotenuse(Math.abs(_m2[1]-_m1[1]) , Math.abs(_m2[0]-_m1[0]));
                    _r_scale = me.transform.scale;
                }

                _zoom = parseFloat(target.css('zoom'));
            }).bind('touchmove',function (e) {
                e.preventDefault();
                _m1 = [e.touches[0].pageX, e.touches[0].pageY];
                if(touchType == 'drag') {
                    me.drag(_e1, _m1, _r_translate);
                }else if(touchType == 'pinch') {
                    _m2 = [e.touches[1].pageX, e.touches[1].pageY];
                    me.pinch(_line, _r_scale, _m2, _m1);
                }
            }).bind('touchend', function (e) {
                e.preventDefault();
                if(Math.abs(_m1[0] - _e1[0]) < 5 && Math.abs(_m1[1] - _e1[1]) <5) {
                    $('#fullImage').css({'-webkit-transition': '0.3s all linear'});
                    if(timeoutFordestory == null) {
                        timeoutFordestory = setTimeout(function () {
                            me.destory();
                            timeoutFordestory = null;
                        },300);
                    }else{
                        clearTimeout(timeoutFordestory);
                        timeoutFordestory = null;
                        me.zoom();
                    }
                    
                }else{
                    $('#fullImage').css({'-webkit-transition': '0.1s all linear'});
                    me.flex();
                }
            })
        }else{
            this.container.bind('mousedown', function (e) {
                var target = $(e.target);
                _e1 = [e.pageX, e.pageY];
                if(target.attr('id') == 'fullImage') {
                    me.moving = true;
                    _r_translate = [me.transform.translateX, me.transform.translateY];
                }
            }).bind('mousemove', function (e) {
                _m1 = [e.pageX, e.pageY];
                if(me.moving) {
                    $('#fullImage').css({'-webkit-transition': ''});
                    me.drag(_e1, _m1, _r_translate);
                }
            }).bind('mouseup', function () {
                if(Math.abs(_m1[0] - _e1[0]) < 5 && Math.abs(_m1[1] - _e1[1]) <5) {
                    $('#fullImage').css({'-webkit-transition': '0.3s all linear'});
                    if(timeoutFordestory == null) {
                        timeoutFordestory = setTimeout(function () {
                            me.destory();
                            timeoutFordestory = null;
                        },300);
                    }else{
                        clearTimeout(timeoutFordestory);
                        timeoutFordestory = null;
                        me.zoom();
                    }
                }
                else{
                    me.flex();
                }
                me.moving = false;    
            });
        }        
    },

    drag: function (_e1, _m1, _r_translate) {
        this.transform.translateX = _m1[0] - _e1[0] + _r_translate[0];
        this.transform.translateY = _m1[1] - _e1[1] + _r_translate[1];
        this.animate();
    },

    pinch: function (_line, _r_scale, _m2, _m1) {
        var _new_line = this.get_triangle_hypotenuse(Math.abs(_m2[1]-_m1[1]), Math.abs(_m2[0]-_m1[0]));
        this.transform.scale = _r_scale+(_new_line-_line)/250;
        this.animate();
    },

    zoom: function () {
        if(this.transform.scale > 2) {
            this.transform.scale = 1;
            this.transform.translateX = 0;
            this.transform.translateY = 0;
        }else{
            this.transform.scale = 3;
        }
        this.animate();
    },

    animate: function () {
        $('#fullImage').css({
            '-webkit-transform': 'translateX('+this.transform.translateX+'px) translateY('+this.transform.translateY+'px) scale('+this.transform.scale+')'
        });
    },

    get_triangle_hypotenuse: function (a,b) {
        return Math.sqrt(a*a+b*b);
    },

    flex: function () {
        var me = this;
        var 
            //屏幕宽高
            scw = window.innerWidth,
            sch = window.innerHeight,
            //图片宽高
            aw = parseInt($('#fullImage').css('width')),
            ah = parseInt($('#fullImage').css('height')),
            //缩放后的宽高
            sw = aw *me.transform.scale,
            sh = ah *me.transform.scale,
            //弹性范围内的translate值
            fw = aw * (me.transform.scale - 1) * 0.5,
            fh = ah * (me.transform.scale - 1) * 0.5;
        
        if(me.transform.scale > 3) { me.transform.scale = 3;}
        if(me.transform.scale < 1) { me.transform.scale = 1;}

        
            if(me.transform.translateX < fw*-1) {me.transform.translateX = fw*-1}
            if(me.transform.translateX > fw*1) {me.transform.translateX = fw*1}
        
            if(me.transform.translateY < fh*-1) {me.transform.translateY = fh*-1}
            if(me.transform.translateY > fh*1) {me.transform.translateY = fh*1}
        

        setTimeout(function () {
            me.animate();
        },20);
    }
};

module.exports =FullImage; 
