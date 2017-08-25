/**
 * @file 维普论文，带图片文档统计
 */

var globalData = require('view:widget/public/gd.js');

module.exports.log = function () {
    if (+globalData.isPaper === 1) {
        wapfelog.send('click', {
            doc_id: globalData.doc_id,
            type: 'paper'
        }, 1, 100086);
    }
    else if (+globalData.hasImage === 1 && globalData.docTitle.indexOf('图') === -1) {
        wapfelog.send('click', {
            doc_id: globalData.doc_id,
            type: 'image'
        }, 1, 100086);
    }
};
