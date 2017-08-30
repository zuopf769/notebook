/**
 * 图片延时载组件
 *
 * 1.lazyload背景图片能力 
 *   为需要lazyload背景的元素添加lazybg类和data-src属性
 * 2.lazy img标签能力
 *   为需要lazyload的img标签类加data-src属性
 * 3.每个图片_afterLoaded后指出回调事件
 *   
 * 
 */

var lazyLoad = function( config ) {
    this.defaultConfig = {
        lazyLoadAttr: 'data-src',
        preloadHeight: 0,
        loadedCallback: null,
        lazyLoadBg: true,
        lazyLoadBgClass: 'lazybg'
    };

    this.config = $.extend( true, this.defaultConfig, config || {} );

    this.init.call( this );
};

$.extend( lazyLoad.prototype, {
    init: function() {
        this._cache();
        this._initEvent();
        this.acitonLazy();
    },

    _initEvent: function() {
        var me = this,
            config = this.config;

        this.acitonLazy = $.proxy( me._lazy, me );

        $( window ).on( 'scroll', me.acitonLazy );
        $( window ).on( 'resize', me.acitonLazy );
        $( window ).on( 'load', me.acitonLazy );

        $( me ).on( 'afterLoaded', function( event ) {
            me._afterLoaded( event.img , event.loadType);
        } );
    },

    _cache: function() {
        this.lazyImgs = this._getLazyImgs();
        this.lazyImgsLen = this.lazyImgs.length;
        this.acitonLazy = null;
    },

    _getLazyImgs: function() {
        var me = this,
            config = this.config,
            lazyImgs = [],
            item = null;

        $( 'img' ).each( function( index ) {
            item = $( this );
            if ( item.attr( config.lazyLoadAttr ) ) {
                lazyImgs.push( item );
            }
        } );

        if ( config.lazyLoadBg ) {
            $( '.' + config.lazyLoadBgClass ).each( function( index ) {
                item = $( this );
                if ( item.attr( config.lazyLoadAttr ) ) {
                    lazyImgs.push( item );
                }
            } );
        }

        return lazyImgs;
    },

    _lazy: function() {
        var me = this,
            config = this.config,
            lazyLoadAttr = config.lazyLoadAttr,
            preloadHeight = config.preloadHeight,

            win = $( window ),
            scrollTop = win.scrollTop(),
            clientHeight = win.innerHeight(),
            viewOffset = scrollTop + clientHeight + preloadHeight,
            scrollOffset = scrollTop - preloadHeight;


        $.each( this.lazyImgs, function( index, item ) {
            var itemPosY = item.offset().top,
                itemPosDepY = itemPosY + item.innerHeight(),
                imgSrc = item.attr( lazyLoadAttr );

            if ( itemPosY < viewOffset && itemPosDepY > scrollOffset && imgSrc ) {
                if ( !item.hasClass( config.lazyLoadBgClass ) ) {
                    // lazyload img
                    item.css( 'display', 'none' );
                    item.attr( 'src', imgSrc );
                    item.removeAttr( lazyLoadAttr );
                    me.lazyImgsLen--;

                    $( me ).trigger( {
                        type: 'afterLoaded',
                        img: item,
                        loadType: 'img'
                    } );
                } else {
                    // lazyload background-image
                    item.css( 'background-image','url( ' + imgSrc + ' )' );
                    item.removeAttr( lazyLoadAttr );
                    me.lazyImgsLen--;
                    $( me ).trigger( {
                        type: 'afterLoaded',
                        img: item,
                        loadType: 'bg'
                    } );
                }
            }
        } );

        me.lazyImgsLen || me._dispose();
    },

    _dispose: function() {
        $( window ).off( 'scroll', this.acitonLazy );
        $( window ).off( 'resize', this.acitonLazy );
    },

    _afterLoaded: function( img , loadType) {
        var me = this,
            config = this.config;

        if ( $.isFunction( config.loadedCallback ) ) {
            config.loadedCallback( img , loadType );
        } else {
            if ( loadType == 'img' ) {
                img.fadeIn( 'slow' );
            }
        }
    }
} );

module.exports.lazyLoad = lazyLoad;
