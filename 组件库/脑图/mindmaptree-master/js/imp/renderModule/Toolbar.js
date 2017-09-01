/**
 * Created by rockyren on 15/3/7.
 */
define(['jquery'], function($){


    var Toolbar = function(){
        var $toolbarBtns = $('.toolbar-btn');
        var $tipBox = $('#tip-box');
        var $tipTriangle = $tipBox.find('.tip-triangle');
        var $tipLabel = $tipBox.find('.tip-label');
        var tipInfoSet = {
            'node-plus': '添加任务',
            'node-more': '跳转到子任务',
            'node-info': '查看任务具体信息',
            'node-cancel': '删除任务'
        };

        $('.toolbar-btn').hover(function(){
                $tipBox.show();
                _adjustTipBox(this);


            },
            function(){
                $tipBox.hide();
            });

        function _adjustTipBox(btn){
            //改变tip box的标签值
            var btnId = $(btn).attr('id');
            $tipLabel.html(tipInfoSet[btnId]);

            var btnOffsetLeft = $(btn).get(0).offsetLeft;
            var toolbarMargin = parseInt($('#toolbar').css('margin-left'));
            //功能键离function-bar最左边的距离
            var btnLeft = btnOffsetLeft + toolbarMargin;

            var btnHalfWidth = parseInt($(btn).css('width')) / 2;
            var tipBoxLabelHalfWidth = $tipBox.find('.tip-label').outerWidth() / 2;
            //tipBox应该向左偏移的量
            var tipBoxLeft = btnLeft - tipBoxLabelHalfWidth + btnHalfWidth;

            $tipBox.css('left', tipBoxLeft + 'px');
            $tipTriangle.css('left', tipBoxLabelHalfWidth - 10 + 'px');

            //如果有设active类则不透明，否则透明
            if($(btn).hasClass('active')){
                $tipBox.css('opacity', 1);
            }else{
                $tipBox.css('opacity', 0.6);
            }

        }

        function setActive(className){


            if(className){
                $toolbarBtns.each(function(){
                    if($(this).hasClass(className)){
                        $(this).addClass('active');
                    }else{
                        $(this).removeClass('active');
                    }
                });
            }else{
                $toolbarBtns.addClass('active');
            }


        }

        return {
            setActive: function(node){
                if(node.isRootNode()){
                    setActive('plus-active');
                }else{
                    setActive();
                }

            },
            setAllUnactive: function(){
                $toolbarBtns.removeClass('active');
            }
        }
    };


    return Toolbar;
});