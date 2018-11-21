<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [log4js-node文档学习](#log4js-node%E6%96%87%E6%A1%A3%E5%AD%A6%E4%B9%A0)
  - [背景](#%E8%83%8C%E6%99%AF)
  - [基本概念](#%E5%9F%BA%E6%9C%AC%E6%A6%82%E5%BF%B5)
    - [1.Logger](#1logger)
    - [2.Level](#2level)
    - [3.Appender](#3appender)
    - [4.Layout](#4layout)
    - [5.Category](#5category)
  - [安装](#%E5%AE%89%E8%A3%85)
  - [最简单demo](#%E6%9C%80%E7%AE%80%E5%8D%95demo)
  - [简单配置项](#%E7%AE%80%E5%8D%95%E9%85%8D%E7%BD%AE%E9%A1%B9)
  - [appenders配置](#appenders%E9%85%8D%E7%BD%AE)
  - [自定义appender](#%E8%87%AA%E5%AE%9A%E4%B9%89appender)
  - [过滤](#%E8%BF%87%E6%BB%A4)
    - [Log Level Filter](#log-level-filter)
    - [Category Filter](#category-filter)
  - [layout](#layout)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# log4js-node文档学习



## 背景

日志在Web应用中是必不可少的，在系统调试或运行出现异常时，可以通过日志来进行排查，甚至利用日志可以进行数据统计。

通常日志记录可以分为三个方面：

 + 日志分级：debug、info、error、fetal等。
 + 日志分类：category指定日志类别。
 + 日志落盘：保存日志文件，日志命名、自动切分、删除旧日志等操作。


log4js是Node日志管理的模块，具有以下功能 

+ 彩色控制台记录到标准输出或标准错误 
+ 文件appender，可根据文件大小或日期进行可配置的日志滚动 
+ 多进程appender（当你有多个服务器但想要集中记录时很有用） 
+ 不同日志类别的不同日志级别（使您的应用程序日志的某些部分为DEBUG，其他部分仅为ERRORS等） 


## 基本概念

作为记录日志的工具，它至少应该包含如下几个组成部分(组件)： 
	
### 1.Logger 

Logger记录器组件负责产生日志，并能够对日志信息进行分类筛选，控制什么样的日志应该被输出，什么样的日志应该被忽略。

### 2.Level

不管何种日志记录工具，大概包含了如下几种日志级别：DEBUG, INFO, WARN, ERROR 和 FATAL。 

![]()

### 3.Appender 
日志记录工具基本上通过Appender组件来输出到目的地的，一个Appender实例就表示了一个输出的目的地。 

### 4.Layout 
Layout组件负责格式化输出的日志信息，一个Appender只能有一个Layout。

### 5.Category
Category类型的名字是用来区分日志的另一个维度。


## 安装

[log4js-node](https://github.com/nomiddlename/log4js-node)

```
npm install log4js --save

```

## 最简单demo

```

var log4js = require('log4js');

var logger = log4js.getLogger();
logger.level = 'debug';
logger.debug("Some debug messages");

```

## 简单配置项

Log4js的config下面有三个重要属性： 

+ appenders：记录器对象，自定义不同的记录器(log输出位置)。 
+ categories：log 类型，自定义log不同输出方式。 
+ level：log输出等级，大于某等级的log才会输出。

```
const log4js = require('log4js');

log4js.configure({
  appenders: { 
  	cheese: { 
  		type: 'file', 
  		filename: 'cheese.log' 
  	} 
  },
  categories: {
  	default: { 
  		appenders: ['cheese'], 
  		level: 'error' 
  	} 
  }
});

const logger = log4js.getLogger();

logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Comté.');
logger.warn('Cheese is quite smelly.');
logger.error('Cheese is too ripe!');
logger.fatal('Cheese was breeding ground for listeria.');

```

 可以看到只有 error和fatal级别的日志会输出到文件中
 
 
## appenders配置

log4js提供的appender可以设置type类型，除了console和file之外，
还有：

+ DateFile：日志输出到文件，日志文件可以按特定的日期模式滚动，例如今天输出到 mylog-2017-02-14.log，明天就输出到mylog-2017-02-15.log

+ SMTP： 输出日志到邮件

+ 其他类型可以查看[文档](https://github.com/log4js-node/log4js-node/blob/master/docs/appenders.md)
 
```
const log4js = require('log4js');
let programName = "log4jstest";

log4js.configure({
    appenders:{
        console:{//记录器1:输出到控制台
            type : 'console',
        },
        log_file:{//记录器2：输出到文件
            type : 'file',
            filename: __dirname + `/logs/${programName}.log`,//文件目录，当目录文件或文件夹不存在时，会自动创建
            maxLogSize : 20971520,//文件最大存储空间（byte），当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
            backups : 3,//default value = 5.当文件内容超过文件存储空间时，备份文件的数量
            //compress : true,//default false.是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
            encoding : 'utf-8',//default "utf-8"，文件的编码
        },
        data_file:{//：记录器3：输出到日期文件
            type: "dateFile",
            filename: __dirname + `/logs/${programName}`,//您要写入日志文件的路径
            alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
             daysToKeep:10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
            //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "-yyyy-MM-dd-hh.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding : 'utf-8',//default "utf-8"，文件的编码
        },
       error_file:{//：记录器4：输出到error log
            type: "dateFile",
            filename: __dirname + `/../logs/${programName}_error`,//您要写入日志文件的路径
            alwaysIncludePattern: true,//（默认为false） - 将模式包含在当前日志文件的名称以及备份中
            daysToKeep:10,//时间文件 保存多少天，距离当前天daysToKeep以前的log将被删除
            //compress : true,//（默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
            pattern: "_yyyy-MM-dd.log",//（可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
            encoding : 'utf-8',//default "utf-8"，文件的编码
            // compress: true, //是否压缩
        }
    },
    categories: {
        default:{appenders:['data_file', 'console', 'log_file'], level:'info' },//默认log类型，输出到控制台 log文件 log日期文件 且登记大于info即可
        production:{appenders:['data_file'], level:'warn'},  //生产环境 log类型 只输出到按日期命名的文件，且只输出警告以上的log
        console:{appenders:['console'], level:'debug'}, //开发环境  输出到控制台
        debug:{appenders:['console', 'log_file'], level:'debug'}, //调试环境 输出到log文件和控制台    
        error_log:{appenders:['error_file'], level:'error'}//error 等级log 单独输出到error文件中 任何环境的errorlog 将都以日期文件单独记录
    },
});



var logger = log4js.getLogger(); 
logger.info("hello world categories-default test, this is info");
logger.debug("hello world categories-default test, this is debug");
logger.warn("hello world categories-default test, this is warn");
logger.error("hello world categories-default test, this is error");

logger = log4js.getLogger('production'); 
logger.info("hello world categories-production test, this is info");
logger.debug("hello world categories-production test, this is debug");
logger.warn("hello world categories-production test, this is warn");
logger.error("hello world categories-production test, this is error");

logger = log4js.getLogger('console'); //引用的categories 类型中的console  即输出到console控制台 输出日志级别info(大于info输出)
logger.info("hello world categories-console test");

logger = log4js.getLogger('debug'); 
logger.info("hello world categories-debug test, this is info");
logger.debug("hello world categories-debug test, this is debug");

```

## 自定义appender

参考文档[Writing Appenders for Log4js](https://github.com/log4js-node/log4js-node/blob/master/docs/writing-appenders.md)


```
'use strict';
var layouts = require('log4js').layouts;
var Scribe = require('@mx/scribe').Scribe;
var Logger = require('@mx/scribe').Logger;

Logger.prototype.logMessage = function (level, msg) {
    if (this.scribe) {
        this.scribe.send(this.scribeCategory, msg);
    } else {
        process.stderr.write(this.levelNames[level] + '\t' + process.pid + '\t' + this.extractCalledFromStack() + '\n\t' + msg + '\n');
    }
};

function scribeAppender (layout, config) {
    var layout = layout || layouts.colouredLayout;
    var config = config || {};
    try {
        var scribe = new Scribe('127.0.0.1', 4252);
        var mtlogger = new Logger(scribe, config.app_key);
    } catch (e) {
        process.stderr.write('hfeLogger error:' + e.message + '\n');
    }

    return function (loggingEvent) {
        try {
            var msg = layout(loggingEvent, config.timezoneOffset);
            if (scribe.opened) {
                mtlogger.info(msg);
                return;
            }
            scribe.open(function (err) {
                if (err) {
                    process.stderr.write('hfeLogger scribe open error:' + err.message + '\n');
                    return;
                }

                mtlogger.info(msg);

                scribe.close();
            });
        } catch (e) {
            process.stderr.write('hfeLogger error:' + e.message + '\n');
        }
    };
}

function configure (config) {
    var layout;

    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }
    return scribeAppender(layout, config);
}

exports.appender = scribeAppender;
exports.configure = configure;

```

自定义完成后需要装载和添加

```
log4js.loadAppender(scribeAppenderJs);
log4js.addAppender(log4js.appenders[scribeAppenderJs](null, config));
```

## 过滤

在appender中还可以对日志进行级别和分类过滤。

### Log Level Filter

[参考文档](https://github.com/log4js-node/log4js-node/blob/master/docs/logLevelFilter.md)

+ type - logLevelFilter
+ appender - string - the name of an appender, defined in the same configuration, that you want to filter
+ level - string - the minimum level of event to allow through the filter
+ maxLevel - string (optional, defaults to FATAL) - the maximum level of event to allow through the filter



```
log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'all-the-logs.log' },
    emergencies: { type: 'file', filename: 'panic-now.log' },
    'just-errors': { type: 'logLevelFilter', appender: 'emergencies', level: 'error' }
  },
  categories: {
    default: { appenders: ['just-errors', 'everything' ], level: 'debug' }
  }
});


var logger = log4js.getLogger(); 
logger.info("hello world categories-default test, this is info");
logger.debug("hello world categories-default test, this is debug");
logger.warn("hello world categories-default test, this is warn");
logger.error("hello world categories-default test, this is error");
```

上面的demo中`just-errors`是一个`appender`，它引用了`emergencies`把它的相关配置引用过来，然后又对其level进行了限定

log events of debug, info, error, and fatal will go to all-the-logs.log. Events of error and fatal will also go to panic-now.log.


### Category Filter

[参考文档](https://github.com/log4js-node/log4js-node/blob/master/docs/categoryFilter.md)

+ type - "categoryFilter"
+ exclude - string | Array<string> - the category (or categories if you provide an array of values) that will be excluded from the appender.
+ appender - string - the name of the appender to filter.


```
log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'all-the-logs.log' },
    'no-noise': { type: 'categoryFilter', exclude: 'noisy.component', appender: 'everything' }
  },
  categories: {
    default: { appenders: [ 'no-noise' ], level: 'debug' }
  }
});

const logger = log4js.getLogger();
const noisyLogger = log4js.getLogger('noisy.component');
logger.debug('I will be logged in all-the-logs.log');
noisyLogger.debug('I will not be logged.');
```

上面的和下面的配置效果是一样的。

```
log4js.configure({
  appenders: {
    everything: { type: 'file', filename: 'all-the-logs.log' }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'debug' },
    'noisy.component': { appenders: ['everything'], level: 'off' }
  }
});

const logger = log4js.getLogger();
const noisyLogger = log4js.getLogger('noisy.component');
logger.debug('I will be logged in all-the-logs.log');
noisyLogger.debug('I will not be logged.');
```


## layout

[Layout](https://github.com/log4js-node/log4js-node/blob/master/docs/layouts.md)是log4js提供的高级功能，通过layout可以自定义每条输入日志的格式。

其中，layout中type类型包括以下四种：

（1）messagePassThrough：仅仅输出日志的内容

（2）basic： 在日志的内容前面会加上时间、日志的级别和类别，通常日志默认的layout

（3）colored/coloured： 在basic基础上为日志加颜色

（4）pattern： 自定义你想要的日志类型

```
%r time in toLocaleTimeString format
%p log level
%c log category
%h hostname
%m log data
%d date, formatted - default is ISO8601, format options are: ISO8601, ISO8601_WITH_TZ_OFFSET, ABSOLUTE, DATE, or any string compatible with the date-format library. e.g. %d{DATE}, %d{yyyy/MM/dd-hh.mm.ss}
%% % - for when you want a literal % in your output
%n newline
%z process id (from process.pid)
%x{<tokenname>} add dynamic tokens to your log. Tokens are specified in the tokens parameter.
%X{<tokenname>} add values from the Logger context. Tokens are keys into the context values.
%[ start a coloured block (colour will be taken from the log level, similar to colouredLayout)
%] end a coloured block

```

```
var layout = {
    type: 'pattern',
    pattern: '%d %h %x{appKey} [%p] %x{thread} %c #XMDT#{%x{tags}}#XMDT# %m',
    tokens: {
        appKey: function () {
            return config.app_key;
        },
        thread: function () {
            return config.thread;
        },
        tags: function (loggingEvent) {
            if (typeof logTags === 'string') {
                return logTags;
            }
            if (typeof logTags === 'object') {
                var str = [];
                for (var i in logTags) {
                    if (logTags.hasOwnProperty(i)) {
                        str.push(i + '=' + logTags[i]);
                    }
                }
                return str.push(' ');  //todo 这里有 只是走不到这个分支而已
            }
            return '';
        }
    }
};
```

