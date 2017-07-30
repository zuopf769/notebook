/**
 * Created by ZQLan on 15/11/11.
 */


var upass;
var stateUrl = "http://wenku.baidu.com/lottery/interface/getuser_can_miti_fanpai?bduss=xxxxx";
var winningListUrl = "http://wenku.baidu.com/lottery/interface/miti_winlist?activity_id=21";
var getPrizeUrl = "http://wenku.baidu.com/lottery/submit/get_miti_fanpai_gift?bduss=xxxxx";


var gifts = [
    {id:1,name:'macbook air',w:155,h:89,initPos:1,image:'gift-1.png'},
    {id:2,name:'iPhone6S',w:52,h:110,initPos:2,image:'gift-2.png'},
    {id:3,name:'apple watch',w:98,h:110,initPos:3,image:'gift-3.png'},
    {id:4,name:'头带耳麦',w:94,h:112,initPos:4,image:'gift-4.png'},
    {id:5,name:'移动电源',w:58,h:110,initPos:6,image:'gift-5.png'},
    {id:6,name:'百度熊靠垫',w:110,h:93,initPos:7,image:'gift-6.png'},
    {id:7,name:'京东礼品卡',w:123,h:83,initPos:8,image:'gift-7.png'},
    {id:9,name:'华为音响',w:106,h:109,initPos:9,image:'gift-9.png'},
    {id:0,name:'谢谢参与',w:150,h:96,initPos:5,image:'gift-0.png'}
];
var enable = 0;
var disabled = 1;
var winningListIntervalId = 0;
var time = 0;

/**
 * 获取当前URL参数值
 * @param name	参数名称
 * @return	参数值
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null)
        return unescape(r[2]);
    return null;

}


function flipDo(item) {
    if (item) {
        enable = 0;
        if (item.data('state') == 'front') {
            item.data('state','fliping');
            item.children('.back').css({rotateY: '-=90'});
            item.children('.front').transition({rotateY: '+=90'},200, function(){
                item.children('.front').hide();
                item.children('.back').show();
                item.children('.front').css({rotateY: '-=90'});
                item.children('.back').transition({rotateY: '+=90'},200, function() {
                    item.data('state','back');
                });
            });
        }
        else if (item.data('state') == 'back') {
            item.data('state','fliping');
            item.children('.front').css({rotateY: '-=90'});
            item.children('.back').transition({rotateY: '+=90'},200, function(){
                item.children('.back').hide();
                item.children('.front').show();
                item.children('.back').css({rotateY: '-=90'});
                item.children('.front').transition({rotateY: '+=90'},200, function() {
                    item.data('state','front');
                });
            });
        }
    }
}

function moveToCenter(item) {
    if (item) {
        item.transition({top: '217px', left: '200px'},200);
    }
}

function moveBack(item) {
    if (item) {
        item.transition({top: 217*parseInt(item.index()/3)+'px', left: 200*(item.index()%3)+'px'},300,function(){enable += 1;});
    }
}

function moveBackByIndex(i) {
    $('.flips').children('div:nth-child('+i+')').each(function () {
        moveBack($(this));
    });
}

function disableAll() {
    disabled = 1;
    $('.upper-layer').hide();
}

function initParam() {
    upass = getUrlParam("bduss");
    if (!upass || upass=="") {
        upass = "";
        disableAll();
    }
    else {
        stateUrl = stateUrl.replace("xxxxx",upass);
        getPrizeUrl = getPrizeUrl.replace("xxxxx",upass);
    }
}

function initState() {
    $.ajax({
        url: stateUrl,
        type: "GET",
        dataType:"jsonp",
        jsonp:"callback",
        success:function(data){
            if (data.status.code == 0) {
                if (data.data.ifcan != 1)
                    disableAll();
                else
                    disabled = 0;
            }
            else {
                disableAll();
            }
        },
        error: function() {
            disableAll();
        }
    });
}

function getTwoDigit(a) {
    if (a == 0)
        return "00";
    if (a < 10)
        return "0"+a;
    return a;
}

function showTime(t) {
    var s = t%60;
    var m = Math.floor(t/60)%60;
    var h = Math.floor(t/3600);
    var text = getTwoDigit(h)+":"+getTwoDigit(m)+":"+getTwoDigit(s);
    $("#time").text(text);
    if (t == 0 && disabled == 0) {
        $('#layer-flip').show();
    }
}

function initTime() {
    var now = new Date();
    time = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();

    if (time >= 43200 && time < 43200+180)
        time = 0;
    else if (time >= 50400 && time < 50400 + 180)
        time = 0;
    else if (time >= 72000 && time < 72000+180)
        time = 0;
    else {
        if (time < 43200) {
            time = 43200 - time;
        }
        else if (time < 50400) {
            time = 50400 - time;
        }
        else if (time < 72000) {
            time = 72000 - time;
        }
        else {
            time = 86400 - time + 43200;
        }
    }

    showTime(time);
    setInterval(function(){
        if (time > 0) {
            time -= 1;
            showTime(time);
        }
    },1000);
}


function changeWinningList(list) {
    var show = $("#winning-list");
    var index = show.data('id');
    if (index == '') {
        index = 0;
    }
    else {
        index = parseInt(index);
        if (index >= list.length)
            index = 0;
    }
    var text = list[index].uname+"用户获得了"+list[index].name;
    show.fadeOut(500,function(){
        show.text(text);
        show.data('id',index+1);
        show.fadeIn(500);
    });
}

function initWinningList() {
    $.ajax({
        url: winningListUrl,
        type: "GET",
        dataType:"jsonp",
        jsonp:"callback",
        success:function(data){
            lucky = data;
            if (!winningListIntervalId) {
                changeWinningList(data.winning_list);
                winningListIntervalId = setInterval(function () {
                    changeWinningList(data.winning_list);
                }, 5000);
            }
            setTimeout("initWinningList()",60000);
        }
    });
}


function initGift() {
    for(var i in gifts) {
        var gift = gifts[i];
        $('.flips').children('div:nth-child('+gift.initPos+')').each(function () {
            var img=$('<img src="images/'+gift.image+'"/>');
            $(this).children('.front').empty().append(img);
            img.css({left:(185-gift.w)/2+'px', top:(134-gift.h)/2+'px'});
            $(this).children('.front').append('<p>'+gift.name+'</p>');
        });
    }
}

function initAnimate() {
    $('.flips').children('div').each(function () {
        flipDo($(this));
    });
    setTimeout(function(){
        $('.flips').children('div').each(function () {
            moveToCenter($(this));
        });
    }, 400);
    setTimeout(function(){
        setTimeout('moveBackByIndex(1)',100);
        setTimeout('moveBackByIndex(2)',200);
        setTimeout('moveBackByIndex(3)',300);
        setTimeout('moveBackByIndex(6)',400);
        setTimeout('moveBackByIndex(9)',500);
        setTimeout('moveBackByIndex(8)',600);
        setTimeout('moveBackByIndex(7)',700);
        setTimeout('moveBackByIndex(4)',800);
    }, 700);
}

function showResult(i) {
    disableAll();
    $(".layer").show();
    if (i == -1) {
        $(".layer >div").hide();
        $(".layer .result-failed").show();
    }
    else if (i == 0) {
        $(".layer >div").hide();
        $(".layer .result-no").show();
    }
    else {
        $(".layer >div").hide();
        for(var k in gifts) {
            if (gifts[k].id == i) {
                $("#result-name").text(gifts[k].name);
            }
        }
        $(".layer .result-yes").show();
    }
}

function hideResult() {
    $("#layer-upper").hide();
}

function showExplanation() {
    $(".layer").show();
    $(".layer >div").hide();
    $(".layer .explanation").show();
}

function beginFlip() {
    $("#layer-flip").hide();
    setTimeout('initAnimate()', 1000);
}

function getRandom(n){
    return Math.floor(Math.random()*n);
}

function flipDone(i,r) {
    enable = 0;
    var num = [1,2,3,4,5,6,7,8,9];
    var list = [];
    for(var k = 9; k >=1 ; k--) {
        var p = getRandom(k);
        var t = num[p];
        num[p] = num[k-1];
        num.pop();
        list.push(t);
    }
    var p1, p2;
    for(var k in gifts) {
        if (gifts[k].id == r)
            p1 = k;
        if (list[k] == i)
            p2 = k;
    }
    var t = list[p1];
    list[p1] = list[p2];
    list[p2] = t;

    for(var k in gifts) {
        gifts[k].initPos = list[k];
    }

    initGift();


    $('.flips').children('div').each(function(){
        var item = $(this);
        item.data('state','front');
        item.children('.front').show().css({rotateY: '0'});
        item.children('.back').hide().css({rotateY: '0'});
    });
    $("#layer-loading").hide();
}

function flipClick(i) {
    $("#layer-loading").show();
    $.ajax({
        url: getPrizeUrl,
        type: "GET",
        dataType:"jsonp",
        jsonp:"callback",
        success:function(data){
            if (data.status.code == 0) {
                showResult(data.data.gift_type);
                flipDone(i,data.data.gift_type);
            }
            else if (data.status.code == 122) {
                showResult(0);
                flipDone(i,0);
            }
            else {
                disableAll();
            }
        },
        error: function() {
            showResult(-1);
            flipDone(i,0);
        }
    });
}



$(function() {
    initParam();
    initState();
    initGift();
    initTime();
    initWinningList();
    $('.flips').children('div').click(function () {
        if (enable == 8) {
            flipClick($(this).index()+1);
        }
    });
    $('a[data-role="close-layer"]').click(hideResult);
    $('a#button-begin').click(beginFlip);
    $('a#button-explanation').click(showExplanation);
});
