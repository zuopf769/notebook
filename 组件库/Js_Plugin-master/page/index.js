$(function () {

    let everPageData = 8,
        totalData = 55,
        minPage = 9, //最少的分页数
        interval = 2,//中间间隔数
        currentPage = 1;

    let $page = $('#page');


    let pageTotal = Math.ceil(parseFloat(totalData / everPageData));

    // 页面初始化绘制
    function draw(pagenaviBox,dataPage) {
        $('<a>').addClass('prev disabled').attr('href', 'javascript:;').html('<').appendTo(pagenaviBox);
        $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', 1).html(1).appendTo(pagenaviBox);


        if (dataPage - 2 - 1 <= 1 + 1) {  // < 1,2,3,4,5,6,7...11 >

            for (let i = 2; i <= minPage - 2; i++) {
                let $btn = $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', i).html(i).appendTo(pagenaviBox);
            }
            $('<b>').addClass('pn-break').html('...').appendTo(pagenaviBox);

        } else if (dataPage + 3 >= pageTotal - 1) {// < 1...5,6,7,8,9,10,11 >


            $('<b>').addClass('pn-break').html('...').appendTo(pagenaviBox);
            for (let i = pageTotal - 6; i <= pageTotal - 1; i++) {
                $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', i).html(i).appendTo(pagenaviBox);
            }

        } else {// < 1...4,5,6,7,8...11 >

            $('<b>').addClass('pn-break').html('...').appendTo(pagenaviBox);
            for (let i = dataPage - 2; i <= dataPage + 2; i++) {
                $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', i).html(i).appendTo(pagenaviBox);
            }
            $('<b>').addClass('pn-break').html('...').appendTo(pagenaviBox);
        }

        $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', pageTotal).html(pageTotal).appendTo(pagenaviBox);
        $('<a>').addClass('next').attr('href', 'javascript:;').html('>').appendTo(pagenaviBox);

        $('.btn').removeClass('current');
        $('[data-page="' + dataPage + '"]').addClass('current');
    }

    function initDraw() {
        let $pagenaviBox = $('<div>').addClass('xm-pagenavi');
        $page.append($pagenaviBox);

        if (pageTotal <= minPage) {

            $('<a>').addClass('prev disabled').attr('href', 'javascript:;').html('<').appendTo($pagenaviBox);
            for (let i = 1; i <= pageTotal; i++) {
                let $btnLink = $('<a>').addClass('btn').attr('href', 'javascript:;').attr('data-page', i).html(i).appendTo($pagenaviBox);
                if (i == 1) {
                    $btnLink.addClass('current');
                }
            }
            $('<a>').addClass('next').attr('href', 'javascript:;').html('>').appendTo($pagenaviBox);

        } else {
            draw($pagenaviBox,1);
        }
    }


    // 添加点击事件，根据不同的页数得出不同的视图
    function btnClick() {
        let $pagenaviBox = $('.xm-pagenavi');

        $pagenaviBox.on('click', function (e) {
            let $target = $(e.target);
            let targetClass = $target.attr('class');

            // 根据不同的class定义不同的事件
            if (targetClass == 'btn') {
                let dataPage = parseInt($target.attr('data-page'));

                if (pageTotal <= minPage) {
                    //1,2,3,4,5,6,7,8,9
                    $('.btn').removeClass('current');
                    $target.addClass('current');
                } else {
                    // 重新绘制
                    $pagenaviBox.empty();

                    draw($pagenaviBox,dataPage);
                }
                let $prev = $('.prev');
                let $next = $('.next');
                $prev.removeClass('disabled');
                $next.removeClass('disabled');
                if (dataPage == 1) {
                    $prev.addClass('disabled');
                }
                if (dataPage == pageTotal) {
                    $next.addClass('disabled');
                }
            }
            if (targetClass == 'prev') {
                let dataPage = parseInt($('.current').attr('data-page')) - 1;
                if (pageTotal > minPage) {
                    $pagenaviBox.empty();
                    draw($pagenaviBox,dataPage);
                }else{
                    $('.btn').removeClass('current');
                    $('[data-page="' + dataPage + '"]').addClass('current');
                }
                
                let $prev = $('.prev');
                let $next = $('.next');
                $prev.removeClass('disabled');
                $next.removeClass('disabled');
                
                if (dataPage == 1) {
                    $prev.addClass('disabled');
                }
                if (dataPage == pageTotal) {
                    $next.addClass('disabled');
                }


            }
            if (targetClass == 'next') {
                let dataPage = parseInt($('.current').attr('data-page')) + 1;

                if (pageTotal > minPage) {
                    $pagenaviBox.empty();
                    draw($pagenaviBox,dataPage);
                }else{
                    $('.btn').removeClass('current');
                    $('[data-page="' + dataPage + '"]').addClass('current');
                }

                let $prev = $('.prev');
                let $next = $('.next');
                $prev.removeClass('disabled');
                $next.removeClass('disabled');
                if (dataPage == 1) {
                    $prev.addClass('disabled');
                }
                if (dataPage == pageTotal) {
                    $next.addClass('disabled');
                }
            }
        });
    }

    function init() {
        initDraw();
        btnClick();
    }
    init();
})
