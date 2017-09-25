/**
 * SwipeView
 */

var Events = require('libs/event.js'),
    Hammer = require('libs/hammer.js'),
    preloadImg = require('lib/preloadImg.js'),
    x = require('libs/x.js');

var SwipeView = function(options){
    var me = this,
        element;

    me.currentPane = 0
    me.initItem = 2;
    me.maxItem = 3;
    me.index = 0;
    me.offset = 0;
    me.panePadding = options.padding; //边距
    me.paneWidth = document.body.scrollWidth;

    $.extend(me, new Events);
    $.extend(me, options);

    element = me.element = $(options.element);

    me._initEvent();
    me._createContainer();
    me._initCreateItem();

    me.panes = $('.ui-swipeview-container>li', element);
    me.paneCount = me.panes.length;

};

$.extend(SwipeView.prototype, {

    _createContainer: function(){
        this.container = $('<ul class="ui-swipeview-container"></ul>').appendTo(this.wrapElement);
        this.container.css({
            'position': 'relative'
        })
    },

    /**
     * 创建item元素
     */
    _createItem: function(index){
        var me = this,
            item = $('<li class="ui-swipeview-item"></li>');

        item.css({
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top' : 0,
            //'left': index * 100 +'%'
            'left': index * $(window).width() + index * me.padding + 'px'
        });

        if(me.paneCount < me.maxItem) {
            me.paneCount = me.maxItem;
        }

        me.container.append(item);
        item.data('index', index);

        this.fire('createItem', {
            element: item,
            index: index
        });
    },

    _initCreateItem: function(){
        var me = this,
            max;
        if(me.initItem > +me.itemCount){
            max = me.maxItem = +me.itemCount;
        } else {
            max = me.initItem;
        }

        for(var i = 0; i < max; i++){
            me._createItem(i)
            me.index = i;
        }
        me.fire('initCreateItem', max);
    },

    getSwipeItems: function(){
        return $('li.ui-swipeview-item', this.wrapElement);
    },

    _initEvent:function(){
        var me = this;

        for(var i in me.events){
            if(me.events.hasOwnProperty(i)){
                me.on(i, me.events[i]);
            }
        }

        me.on('showPane', function(deferred, index){
            me.addItem(index);
        });

        //$(window).bind($.support.orientation ? 'orientationchange' : 'resize', function(){
            //me._setPaneDimensions();
            //me.showPane(me.currentPane);
        //});

        //$.support.orientation && $(window).bind( 'resize', function(){
            //if(window.orientation == 90 || window.orientation == -90)
                //me._setPaneDimensions();
                //me.showPane(me.currentPane);
        //});

        me.resizeTime = null;

        $(window).on('resize', function(){
            clearTimeout(me.resizeTime);
            me.resizeTime = setTimeout(function(){
                me._setPaneDimensions();
                me.showPane(me.currentPane);
            }, 50);
        });

    },

    _setPaneDimensions: function(){
        var me = this,
            panes = $('.ui-swipeview-container>li', this.element);

        panes.each(function(i, item){
            var index = $(item).data('index');
            $(item).css('left', index * $(window).width() + index * me.padding + 'px');
        });
    },


    addItem: function(index){
        var me = this,
            panes = $('.ui-swipeview-container>li', this.element),
            currentStack = [index - 1, index, index + 1];

        if(index === 0){
            currentStack = [index, index + 1, index + 2];
        }

        if(index === me.itemCount - 1){
            currentStack = [index - 2, index - 1, index];
        }

        panes.each(function(i, item){
            var c = currentStack.indexOf(+$(item).data('index'));
            if(c > -1){
                currentStack.splice(c, 1);
            }else{
                me.fire('removeView', item);
                $(item).remove()
            }
        });

        $(currentStack).each(function(i, item){
            me._createItem(item);
        });

    },

    showPane: function(index, animate){
         var me = this,
             offset;

         index = Math.max(0, Math.min(index, me.itemCount - 1));
         me.currentPane = index;
         offset = -(index * parseInt($(window).width()) + index * me.padding);

         me._setContainerOffset(parseInt(offset), animate);

         me.offset = offset;

         me.fire('showPane', me.currentPane);
     },

     _setContainerOffset: function (percent, animate) {
         var me = this,
             container = me.container;

         container.removeClass("ui-swipeview-animate");

         if(animate) {
             container.addClass("ui-swipeview-animate");
         }

         if($.support.has3d) {
             container.css("-webkit-transform", "translate3d("+ percent +"px,0,0) scale3d(1,1,1)");
         } else {
             container.css("-webkit-transform", "translate("+ percent +"px,0)");
         }

     },

     next: function(){
         var me = this;
         me.showPane(me.currentPane + 1, true);
         me.fire('next', me.currentPane);
     },

     prev: function(){
         var me = this;
         me.showPane(me.currentPane - 1, true);
         me.fire('prev', me.currentPane);
     },

     drag: function(gesture,offset,moveRate){
        moveRate = moveRate || 1;

        this._setContainerOffset(gesture.deltaX * moveRate - offset + this.offset);
     },

     release: function(gesture){
         var me = this,
             paneWidth = me.paneWidth;

        if(gesture.deltaX > paneWidth/4 || (gesture.deltaX > 0 && gesture.velocityX > 0.45)){

            x.send('click.pptswipeprev', {
                'doc_id': globalData.get("doc_id"),
                'doc_id_update': globalData.get("doc_id_update"),
                'view_type': 'xppt',
                'player': 'xppt'
            });

            me.prev();
        }else if(-gesture.deltaX > paneWidth/4 || (gesture.deltaX < 0 && gesture.velocityX > 0.45)){
            x.send('click.pptswipenext', {
                'doc_id': globalData.get("doc_id"),
                'doc_id_update': globalData.get("doc_id_update"),
                'view_type': 'xppt',
                'player': 'xppt'
            });

            me.next();
        }else{
            me.showPane(me.currentPane, true);
        }

     }
 });

exports = SwipeView;
