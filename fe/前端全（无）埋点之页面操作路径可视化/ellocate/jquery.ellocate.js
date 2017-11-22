(function($) {
    $.fn.ellocate = function(uniqueIds) {
        var el = $(this)[0];
        var uniqIds = uniqueIds || [];
        var locator = { xpath: '', css: ''};
        var eloc = {
            isUniqueId: function(id, ids) { return !!($.inArray(id, ids) == -1); },
            getClass: function(el) {
                var formatClass = '';
                var elementClass = $(el).attr('class');
                if(typeof elementClass != 'undefined' && elementClass != ''){
                    formatClass = '.' + elementClass.split(/[\s\n]+/).join('.');
                }
                return formatClass;
            }
        };
        for (; el && el.nodeType == 1; el = el.parentNode) {
            var idx = $(el.parentNode).children(el.tagName).index(el) + 1;
            if(el.tagName.substring(0,1) != "/") { //IE oddity: some tagNames can begin with backslash.
                if(el.id != 'undefined' && el.id !='' && eloc.isUniqueId(el.id, uniqIds)) {
                    uniqIds.push(el.id);
                    var idPath="[@id=" + "'" + el.id + "'" + "]";
                    locator.xpath = '/' + el.tagName.toLowerCase() + idPath + locator.xpath;
                    locator.css = el.tagName.toLowerCase() + '#' + el.id + ' > ' + locator.css;
                }
                else {
                    idx='[' + idx + ']';
                    locator.xpath = '/' + el.tagName.toLowerCase() + idx + locator.xpath;
                    locator.css = el.tagName.toLowerCase() + eloc.getClass(el) + ' > ' + locator.css;
                }
            }
        }
        locator.xpath = '/' + locator.xpath;
        locator.css = locator.css.substr(0, locator.css.length-3);
        return locator;
    };
})(jQuery);