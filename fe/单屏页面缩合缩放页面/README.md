## 单屏页面缩合缩放页面

### 1. 背景

经常会遇到一些需求是页面铺满整个屏幕，即：屏幕有多高页面就有多高不能出现滚动条。

### 2. 解决办法

+ 设置页面viewport初始缩放为1

```
 <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

+ 页面结构如下；其中content为目标缩放容器
```
<body class="container">
    <div class="main_content content">
    </div>
</body>
```

+ js脚本如下，需要放在页面最底部

```
<script>
        var clientWidth = parent.document.documentElement.clientWidth;
        var clientHeight = parent.document.documentElement.clientHeight;

        resize(clientWidth, clientHeight);
        window.addEventListener('resize', resize(clientWidth, clientHeight));
        function resize(docWidth, docHeight) {
            var docScale = docHeight / docWidth,
                designWidth = 375, designHeight = 667, els = document.querySelectorAll('.content'),
                scale = docWidth / designWidth,
                scaleX = docWidth / designWidth,
                scaleY = docHeight / designHeight;
            convertArray(els).forEach(function (el) {
                extend(el.style, {
                    width: designWidth + 'px',
                    height: (docScale * designWidth) + 'px',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transformOrigin: '0 0',
                    webkitTransformOrigin: '0 0',
                    transform: 'scale(' + scale + ')',
                    webkitTransform: 'scale(' + scale + ')',
                    overflow: 'auto',
                    webkitOverflowScrolling: 'touch'
                });
            });
        }
        function convertArray(arrayLike) {
            return Array.prototype.slice.call(arrayLike, 0);
        }
    
        function extend() {
            var args = Array.prototype.slice.call(arguments, 0);
            return args.reduce(function (prev, now) {
                for (var key in now) {
                    if (now.hasOwnProperty && now.hasOwnProperty(key)) {
                        prev[key] = now[key];
                    }
                }
                return prev;
            });
        }
    </script>
```