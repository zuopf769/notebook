var provinces = {
    "A": {
        "安徽":["合肥市","芜湖市","蚌埠市","淮南市","马鞍山市","淮北市","铜陵市","安庆市","黄山市","滁州市","阜阳市","宿州市","巢湖市","六安市","亳州市","池州市","宣城市"]
    },
    "B": {
        "北京": ["北京市"]
    },
    "C": {
        "重庆":["重庆市"]
    },
    "F": {
        "福建":["福州市","厦门市","莆田市","三明市","泉州市","漳州市","南平市","龙岩市","宁德市"]
    },
    "G": {
        "甘肃":["兰州市","嘉峪关市","金昌市","白银市","天水市","武威市","张掖市","平凉市","酒泉市","庆阳市","定西市","陇南市","临夏回族自治州","甘南藏族自治州"],
        "广东":["广州市","深圳市","珠海市","汕头市","韶关市","佛山市","江门市","湛江市","茂名市","肇庆市","惠州市","梅州市","汕尾市","河源市","阳江市","清远市","东莞市","中山市","潮州市","揭阳市","云浮市"],
        "广西":["南宁市","柳州市","桂林市","梧州市","北海市","防城港市","钦州市","贵港市","玉林市","百色市","贺州市","河池市","来宾市","崇左市"],
        "贵州":["贵阳市","六盘水市","遵义市","安顺市","铜仁地区","黔西南布依族苗族自治州","毕节地区","黔东南苗族侗族自治州","黔南布依族苗族自治州"]
    },
    "H": {
        "海南":["海口市","三亚市"],
        "河北":["石家庄市","唐山市","秦皇岛市","邯郸市","邢台市","保定市","张家口市","承德市","沧州市","廊坊市","衡水市"],
        "河南":["郑州市","开封市","洛阳市","平顶山市","安阳市","鹤壁市","新乡市","焦作市","濮阳市","许昌市","漯河市","三门峡市","南阳市","商丘市","信阳市","周口市","驻马店市"],
        "黑龙江":["哈尔滨市","齐齐哈尔市","鸡西市","鹤岗市","双鸭山市","大庆市","伊春市","佳木斯市","七台河市","牡丹江市","黑河市","绥化市","大兴安岭地区"],
        "湖北":["武汉市","黄石市","十堰市","宜昌市","襄樊市","鄂州市","荆门市","孝感市","荆州市","黄冈市","咸宁市","随州市","恩施土家族苗族自治州","神农架"],
        "湖南":["长沙市","株洲市","湘潭市","衡阳市","邵阳市","岳阳市","常德市","张家界市","益阳市","郴州市","永州市","怀化市","娄底市","湘西土家族苗族自治州"]
    },
    "J": {
        "吉林":["长春市","吉林市","四平市","辽源市","通化市","白山市","松原市","白城市","延边朝鲜族自治州"],
        "江苏":["南京市","无锡市","徐州市","常州市","苏州市","南通市","连云港市","淮安市","盐城市","扬州市","镇江市","泰州市","宿迁市"],
        "江西":["南昌市","景德镇市","萍乡市","九江市","新余市","鹰潭市","赣州市","吉安市","宜春市","抚州市","上饶市"]
    },
    "L": {
        "辽宁":["沈阳市","大连市","鞍山市","抚顺市","本溪市","丹东市","锦州市","营口市","阜新市","辽阳市","盘锦市","铁岭市","朝阳市","葫芦岛市"]
    },
    "N": {
        "内蒙古":["呼和浩特市","包头市","乌海市","赤峰市","通辽市","鄂尔多斯市","呼伦贝尔市","巴彦淖尔市","乌兰察布市","兴安盟","锡林郭勒盟","阿拉善盟"],
        "宁夏":["银川市","石嘴山市","吴忠市","固原市","中卫市"]
    },
    "Q": {
        "青海":["西宁市","海东地区","海北藏族自治州","黄南藏族自治州","海南藏族自治州","果洛藏族自治州","玉树藏族自治州","海西蒙古族藏族自治州"]
    },
    "S": {
        "山东":["济南市","青岛市","淄博市","枣庄市","东营市","烟台市","潍坊市","济宁市","泰安市","威海市","日照市","莱芜市","临沂市","德州市","聊城市","滨州市","菏泽市"],
        "山西":["太原市","大同市","阳泉市","长治市","晋城市","朔州市","晋中市","运城市","忻州市","临汾市","吕梁市"],
        "陕西":["西安市","铜川市","宝鸡市","咸阳市","渭南市","延安市","汉中市","榆林市","安康市","商洛市"],
        "上海":["上海市"],
        "四川":["成都市","自贡市","攀枝花市","泸州市","德阳市","绵阳市","广元市","遂宁市","内江市","乐山市","南充市","眉山市","宜宾市","广安市","达州市","雅安市","巴中市","资阳市","阿坝藏族羌族自治州","甘孜藏族自治州","凉山彝族自治州"]
    },
    "T": {
        "天津": ["天津市"]
    },
    "X": {
        "西藏":["拉萨市","昌都地区","山南地区","日喀则地区","那曲地区","阿里地区","林芝地区"],
        "新疆":["乌鲁木齐市","克拉玛依市","吐鲁番地区","哈密地区","昌吉回族自治州","博尔塔拉蒙古自治州","巴音郭楞蒙古自治州","阿克苏地区","克孜勒苏柯尔克孜自治州","喀什地区","和田地区","伊犁哈萨克自治州","塔城地区","阿勒泰地区","石河子市","阿拉尔市","图木舒克市","五家渠市"]
    },
    "Y": {
        "云南":["昆明市","曲靖市","玉溪市","保山市","昭通市","丽江市","思茅市","临沧市","楚雄彝族自治州","红河哈尼族彝族自治州","文山壮族苗族自治州","西双版纳傣族自治州","大理白族自治州","德宏傣族景颇族自治州","怒江傈僳族自治州","迪庆藏族自治州"]
    },
    "Z": {
        "浙江":["杭州市","宁波市","温州市","嘉兴市","湖州市","绍兴市","金华市","衢州市","舟山市","台州市","丽水市"]
    }
};

(function ($, win, doc) {
    var CityPicker = function (el, options) {
        this.el = $(el);
        this.options = options;
        this.provinces = provinces;
        this.pro = null;
        this.city = null;
        this.elType = this.el.is('input');

        this.init();
    };

    var p = CityPicker.prototype;

    p.init = function () {
        this.initEvent();
        this.preventPopKeyboard();

    };

    p.preventPopKeyboard = function () {
        if (this.elType) {
            this.el.prop("readonly", true);
        }
    };

    p.initEvent = function () {
        this.el.on("focus", function (e) {
            var pickerBox = $(".picker-box");
            if (pickerBox[0]) {
                pickerBox.show();
            } else {
                this.create();
            }
        }.bind(this));
    };

    p.create = function () {
        this.createCityPickerBox();
        this.createProList();
        this.proClick();
        this.createNavBar();
        this.navEvent();
    };

    p.createCityPickerBox = function () {
        var proBox = "<div class='picker-box'></div>";
        $("body").append(proBox);
    };

    p.createProList = function () {
        var provinces = this.provinces;
        var proBox;
        var dl = "";
        for (var letterKey in provinces) {
            var val = provinces[letterKey];
            if (provinces.hasOwnProperty(letterKey)) {
                var dt = "<dt id='" + letterKey + "'>" + letterKey + "</dt>";
                var dd = "";
                for (var proKey in val) {
                    if (val.hasOwnProperty(proKey)) {
                        dd += "<dd data-letter=" + letterKey + ">" + proKey + "</dd>";
                    }
                }
                dl += "<dl>" + dt + dd + "</dl>";
            }
        }

        proBox = "<section class='pro-picker'>" + dl + "</section>";

        $(".picker-box").append(proBox);
    };

    p.createCityList = function (letter, pro) {
        var cities = this.provinces[letter][pro];
        var ul, li = "";
        cities.forEach(function (city, i) {
            li += "<li>" + city + "</li>";
        });

        ul = "<ul class='city-picker'>" + li + "</ul>";
        $(".picker-box").find(".city-picker").remove().end().append(ul);

        this.cityClick();
    };

    p.proClick = function () {
        var that = this;
        $(".pro-picker").on("click", function (e) {
            var target = e.target;
            if ($(target).is("dd")) {
                that.pro = $(target).html();
                var letter = $(target).data("letter");
                that.createCityList(letter, that.pro);

                $(this).hide();
            }
        });
    };

    p.cityClick = function () {
        var that = this;
        $(".city-picker").on("click", function (e) {
            var target = e.target;
            if ($(target).is("li")) {
                that.city = $(target).html();
                if (that.elType) {
                    that.el.val(that.pro + "-" + that.city);
                } else {
                    that.el.html(that.pro + "-" + that.city);
                }

                $(".picker-box").hide();
                $(".pro-picker").show();
                $(this).hide();
            }
        });
    };

    p.createNavBar = function () {
        var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var arr = str.split("");
        var a = "";
        arr.forEach(function (item, i) {
            a += '<a href="#' + item + '">' + item + '</a>';
        });

        var div = '<div class="navbar">' + a + '</div>';

        $(".picker-box").append(div);
    };

    p.navEvent = function () {
        var that = this;
        var navBar = $(".navbar");
        var width = navBar.find("a").width();
        var height = navBar.find("a").height();
        navBar.on("touchstart", function (e) {
            $(this).addClass("active");
            that.createLetterPrompt($(e.target).html());
        });

        navBar.on("touchmove", function (e) {
            e.preventDefault();
            var touch = e.originalEvent.touches[0];
            var pos = {"x": touch.pageX, "y": touch.pageY};
            var x = pos.x, y = pos.y;
            $(this).find("a").each(function (i, item) {
                var offset = $(item).offset();
                var left = offset.left, top = offset.top;
                if (x > left && x < (left + width) && y > top && y < (top + height)) {
                    location.href = item.href;
                    that.changeLetter($(item).html());
                }
            });
        });

        navBar.on("touchend", function () {
            $(this).removeClass("active");
            $(".prompt").hide();
        })
    };

    p.createLetterPrompt = function (letter) {
        var prompt = $(".prompt");
        if (prompt[0]) {
            prompt.show();
        } else {
            var span = "<span class='prompt'>" + letter + "</span>";
            $(".picker-box").append(span);
        }
    };


    p.changeLetter = function (letter) {
        var prompt = $(".prompt");
        prompt.html(letter);
    };

    $.fn.CityPicker = function (options) {
        return new CityPicker(this, options);
    }
}(window.jQuery, window, document));