var fs = require('fs');
var system = require('system');
var args = system.args;

var page = require('webpage').create();

page.onConsoleMessage = function(msg, line, source) {
    console.log('console> ' + msg);
};

page.open('file://' + fs.absolute((args[1] || 'main.html')), function(status) {
    console.log(status);
    if (status === 'success') {
        console.log('load html success');
        page.includeJs('file://' + fs.absolute('./lib/jquery-1.11.3.js'), function() {
            console.log('inject js success');

            page.evaluate(function() {
                console.log('jquery working!');

                $("body th,body td").each(function(index, el) {
                    var $el = $(this);
                    $el.attr('width', 79);
                });

                $("body table").each(function(index, el) {
                    var $el = $(this);
                    $el.find('tr:odd').addClass('ue-table-interlace-color-single');
                    $el.find('tr:even').addClass('ue-table-interlace-color-double');
                });

                var limit_style_key_arr = [
                    "font-size",
                    "font-style",
                    "font-family",
                    "font-weight",
                    "line-height",
                    "text-align",
                    "text-decoration",
                    "text-indent",
                    "background-color",
                    "padding",
                    "margin",
                    "border",
                    "vertical-align"
                ];

                $("body *").each(function(index, el) {
                    var $el = $(this);
                    $.each(limit_style_key_arr, function(index, val) {
                        $el.css(val, $el.css(val));
                    });
                });
            });
            console.log('act success run!');
            fs.write((args[1] || 'main.html'), page.content, 'w');
            phantom.exit();
        });
    } else {
        console.log('load html failed.');
        phantom.exit(1);
    }
});
