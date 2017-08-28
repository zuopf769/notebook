## fis2在png图片压缩编译出错问题的跟踪

### 问题描述

我们有个topic模块，专门用来放专题页面；图片会很多，每次编译都话10多分钟，今天我再次开发上线时，发现根本都编译不过去。
控制台一直报：

```
While measuring IDATs in /Users/baidu/work/baidu/gaokao/g pngcrush caught libpng error:
   Not a PNG file..
```

### 原因分析

#### 是不是雪碧图搞出来？

把雪碧图相关的配置都去掉

```
fis.config.merge({
    namespace: 'topic',
    'static': '/static/miti',
    settings: {
        spriter: {
            csssprites: {
                margin: 5
            }
        }
    },
```

```
var paths = fis.config.get('roadmap.path') || [];
paths.unshift({
    reg: '**.css',
    useSprite: true
});
```

但是编译还是不行

#### 把release的参数o关掉

```
yog2 release -cuompDd ./output

```
关掉后就好了，那证明就是压缩的时候出的问题

#### pngcrush是个什么东东

在npm的node_moudule下grep下


+ 查找全局的node_moudule位置

```
npm root -g

```
+ 在全局的node_moudule文件下查找pngcrush

```
cd /usr/local/lib/node_modules
// -r表示递归查询
grep -r 'pngcrush' ./

```
终于找到了

```
.//fis-plus/node_modules/fis/node_modules/fis-optimizer-png-compressor/index.js:                pngcrunsh = require('node-pngcrush');

```
+ 原来是压缩图片的时候出的问题

+ 把压缩图片的路径打出来

```
 if (C && C.compress) {
        // console.log(conf);
        //console.trace(conf);
        return C.option(conf).compress(content);
    } else {
        return content;
    }
```

+ 终于打出来了，找到了报错的文件
+ 用psd打开，居然打不开，改为jpg，就可以打开了，然后再保存问png，就好了

#### 还是不行，会卡住

还是会卡住，在编译的过程中，除了打印压缩图片的路径，还有啥办法，打印日志信息呢


```
yog2 release -h

  Usage: release [options]

  Options:

    -h, --help             output usage information
    -d, --dest <names>     release output destination
    -m, --md5 [level]      md5 release option
    -D, --domains          add domain name
    -l, --lint             with lint
    -t, --test             with unit testing
    -o, --optimize         with optimizing
    -p, --pack             with package
    -w, --watch            monitor the changes of project
    -L, --live             automatically reload your browser
    -c, --clean            clean compile cache
    -r, --root <path>      set project root
    -f, --file <filename>  set fis-conf file
    -u, --unique           use unique compile caching
    --verbose              enable verbose output
```

` --verbose              enable verbose output`参数会在开发态的时候，把所有详细信息都打印出来

然后发现`/client/widget/ui/lib/echarts.common.min.js`编译不过去


那就不压缩了` useOptimizer: false,`

```
roadmap: {
        path: [
            {
                reg: '/client/widget/ui/lib/echarts.common.min.js',
                useOptimizer: false,
                release: '/static/widget/ui/lib/echarts.common.min.js'
            },{
                reg: /paper\/*.js/,
                jswrapper: {
                    type: 'amd'
                }
            },
        ],
```

## 总结

+ 打印编译过程的详细文件路径信息
+ 图片的格式不能随便由jepg改完png
+ verbose选项就是尽可能多的输出的意思
