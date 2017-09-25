var fs = require('fs');
var cp = require('child_process');
var parseBdjson = require('./lib/parseBdjson.js');
var Promise = require('./lib/es6-promise.js').Promise;
var doT = require('./lib/doT.js');
var _ = require('./lib/underscore.js')._;

var args = process.argv;

var fileNamePrefix = args[2] || 'main';
var jsonPath = fileNamePrefix + '.json';
var tmplPath = './word.tmpl';
var bdJsonCssPath = './bdjson.css';
var otherCssPath = './other.css';
var oriData = {};

var decodeData = function(data) {
    data.title = decodeURIComponent(data.title);
    data.descr = decodeURIComponent(data.descr);
    data.period_info.forEach(function(str, index, arr) {
        data.period_info[index]['objective'] = (decodeURIComponent(data.period_info[index]['objective'])).split('\n');
        data.period_info[index]['key_point'] = decodeURIComponent(data.period_info[index]['key_point']).split('\n');
        data.period_info[index]['progress'] = parseBdjson(JSON.parse(decodeURIComponent(data.period_info[index]['progress'])));
        data.period_info[index]['summary'] = parseBdjson(JSON.parse(decodeURIComponent(data.period_info[index]['summary'])));
        data.period_info[index]['homework'] = parseBdjson(JSON.parse(decodeURIComponent(data.period_info[index]['homework'])));
        data.period_info[index]['handwriting'] = parseBdjson(JSON.parse(decodeURIComponent(data.period_info[index]['handwriting'])));
        data.period_info[index]['tags'] = JSON.parse(decodeURIComponent(data.period_info[index]['tags'])).join(',');
        data.period_info[index]['tool'] = JSON.parse(decodeURIComponent(data.period_info[index]['tool'])).join(',');
    });
    return data;
};

// 读取文件
var readFile = function(path) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path, "UTF8", function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// 写入文件
var writeFile = function(path, data) {
    return new Promise(function(resolve, reject) {
        fs.writeFile(path, data, function(err) {
            if (err) {
                console.log('html file' + path + ' save failed!');
                reject(err);
            } else {
                console.log('html file' + path + ' save success!');
                resolve(path);
            }
        });
    });
};

var phantomModifier = function(path) {
    return new Promise(function(resolve, reject) {
        // console.log('phantomjs ./css_process.js ' + path);
        // resovle('phantomjs ./css_process.js ' + path);

        var ls = cp.exec('phantomjs ./css_process.js ' + path, function(error, stdout, stderr) {
            if (error !== null) {
                console.log(path + 'phantomjs error: ' + error);
                reject(error);
            } else {
                console.log(path + ' phantomjs success!');
                resolve(path);
            }
        });
    });
}

if(!args[2]) {
    console.log('args is null, exit');
    process.exit();
}

readFile(jsonPath).then(function(str) {
    try {
        oriData = JSON.parse(str).data.item_info;
        oriData = decodeData(oriData);

    } catch (e) {
        console.log(e);
        console.log('parse json failed');
        process.exit(1);
    }
    Promise.all([
        readFile(tmplPath),
        readFile(bdJsonCssPath),
        readFile(otherCssPath)
    ]).then(function(result_arrs) {
        var tmpFun = doT.template(result_arrs[0]);
        var writePromises = [];
        var phantomPromises = [];
        for (var i = 0; i < oriData.period_info.length; i++) {
            oriData.period_info[i].bdJsonCss = result_arrs[1] || '';
            oriData.period_info[i].otherCss = result_arrs[2] || '';
            (function(index) {
                writePromises.push(writeFile(fileNamePrefix + '_' + (index + 1) + '.html', tmpFun(oriData.period_info[index])));
            })(i);
        };
        Promise.all(writePromises).then(function(paths) {
            console.log('all file step1 create success!');
            for (var i = 0; i < oriData.period_info.length; i++) {
                (function(index) {
                    phantomPromises.push(phantomModifier(fileNamePrefix + '_' + (index + 1) + '.html'));
                })(i);
            };
            Promise.all(phantomPromises).then(function(paths) {
                console.log('all file step2 create success!');
            }).catch(function(err) {
                console.log('phantomjs file failed');
                process.exit(1);
            });
        }).catch(function(err) {
            console.log('write file failed');
            process.exit(1);
        });
    }).catch(function(err) {
        console.log('read tmpl and css file failed');
        process.exit(1);
    });
}).catch(function(err) {
    console.log('read json file failed');
    process.exit(1);
});
