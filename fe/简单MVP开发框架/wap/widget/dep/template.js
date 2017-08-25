/**
 * @file template.js
 * @author Mr.Q(robbenmu)
 * @description undersocre template
 */

var template = {
    escape: function (source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

};

exports.template = template;
