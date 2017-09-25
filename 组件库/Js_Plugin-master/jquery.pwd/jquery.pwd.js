(function ($) {
    var keyCodeObj = {
        //数字键键值
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        //小键盘数字键键值
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9"
    };

    var createI = function () {
        return $("<i></i>");
    };
    var createB = function () {
        return $("<b></b>");
    };
    var createSpan = function () {
        return $("<span></span>").addClass("boxshadow");
    };
    $.fn.extend({
        Alipay: function (callback) {
            var active = 0,
                lastActive = 0,
                left = -1,
                length,
                width,
                everyIWidth,
                disabled,
                nowClickContainer,
                target,
                targetContainer = this;//最外层container

            function initPwdInput(target) {
                active = 0;
                lastActive = 0;
                left = -1;
                length = parseInt($(target).find("input[name='payPassword_rsainput']").attr("maxlength"));
                width = $(target).innerWidth();
                everyIWidth = Math.floor(width / length) - 1;
                var containerDiv = $("<div></div>").addClass("sixDigitPassword");
                $(containerDiv).appendTo($(target));
                var spanElement = createSpan();
                spanElement.css("width", everyIWidth).appendTo($(containerDiv));
                for (var a = 0; a < length; a++) {
                    var iElement = createI();
                    $(iElement).css({
                        width: everyIWidth
                    });
                    var bElement = createB();
                    bElement.css({
                        visibility: "hidden"
                    });
                    $(containerDiv).append(iElement.append(bElement));
                }
            }

            initPwdInput(this);
            var pwdInput = [];
            $(window).on("click", function (e) {
                disabled=$(targetContainer).attr("data-disabled");
                if(!disabled){
                    var target;
                    var event = e || window.event;
                    event.stopPropagation();
                    target = event.target;

                    var targetName = target.nodeName;
                    var nowContainer = $(target).parents(".alieditContainer");
                    var everI = nowContainer.find("i"),
                        span = nowContainer.find("span"),
                        passwordObj = nowContainer.find("input"),
                        div = nowContainer.find("div");
                    if (targetName && (targetName == "I" || targetName == "DIV" || targetName == "SPAN" || targetName == "B") && ($(target).hasClass("sixDigitPassword") || $(target).parents(".sixDigitPassword").hasClass("sixDigitPassword"))) {

                        if (active <= length) {
                            $(everI[active]).addClass("active");
                            span.css({
                                visibility: "visible",
                                left: left
                            });
                            $(document).off("keydown");
                            $(document).on("keydown", function (e) {

                                var event = e || window.event;
                                var keyCode = event.keyCode;
                                /*只许输入数字*/
                                if (((keyCode >= 48) && (keyCode <= 57)) || ((keyCode >= 96) && (keyCode <= 105))) {
                                    if (active < length) {
                                        $(everI[lastActive])
                                            .removeClass("active")
                                            .find("b")
                                            .css({
                                                visibility: "visible"
                                            });

                                        active++;
                                        left = left + everyIWidth + 1;

                                        if (left >= (length - 1) * (everyIWidth + 1) - 1) {
                                            left = (length - 1) * (everyIWidth + 1) - 1;
                                        }
                                        $(everI[active]).addClass("active");
                                        span.css({
                                            visibility: "visible",
                                            left: left
                                        });
                                        pwdInput.push(keyCodeObj[keyCode]);
                                    } else {

                                        span.css({
                                            visibility: "visible"
                                        });
                                        $(everI[active]).removeClass("active");
                                    }
                                } else if (keyCode == 8) {
                                    e.preventDefault();
                                    if (active >= 0) {
                                        pwdInput.pop();
                                        if (active > 0) {
                                            if (lastActive >= length) {
                                                active = length - 1;
                                                $(everI[active]).addClass("active");

                                                span.css({
                                                    left: left
                                                });
                                                $(everI[active]).find("b").css({
                                                    visibility: "hidden"
                                                });
                                            } else {

                                                active--;
                                                $(everI[active]).addClass("active");
                                                left = left - (everyIWidth + 1);
                                                if (left <= -1) {
                                                    left = -1;
                                                }
                                                span.css({
                                                    left: left
                                                });
                                                $(everI[active]).find("b").css({
                                                    visibility: "hidden"
                                                });
                                                $(everI[lastActive]).removeClass("active");
                                            }
                                        } else {

                                            active = 0;
                                            $(everI[active]).addClass("active");
                                            $(everI[lastActive]).removeClass("active");
                                            span.css({
                                                visibility: "visible",
                                                left: left
                                            });
                                        }
                                    }
                                } else {
                                    return;
                                }
                                lastActive = active;
                                passwordObj.val(pwdInput.join(""));
                                callback(passwordObj.val());
                            });
                        } else {
                            active = length - 1;
                            span.css({
                                visibility: "visible"
                            });
                        }
                    } else {
                        $(".alieditContainer").find("i").removeClass("active");
                        $(".alieditContainer span").css("visibility", "hidden");
                        $(document).off("keydown");
                    }
                }else {
                    return;
                }
            });
        }
    })
})(jQuery);