## npm常用命令速查表

注：在npm中，包（package）、模块（module）、依赖（dependency）说的都是一回事儿。

### 常用命令

+ npm init 初始化项目，其实就是创建一个package.json文件。
+ npm install 安装所有项目依赖。
+ npm help xxx 查看xxx命令的帮助信息。


### npm search 搜索（快捷方式：find, s）

xxx 搜索xxx 如：npm search jquery。


### npm install 安装 （快捷方式：i）

+ xxx 搜索并安装xxx（局部）。安装多个依赖可用空格分割，如npm i jquery bootstrap。
+ xxx -g 搜索并安装xxx（全局）。安装多个同上。
+ xxx -D 安装并将依赖信息写在package.json中的devDependencies中。
+ 快捷方式 i均可，如npm i jquery。
+ xxx@版本号 指定需要安装的版本号，若不指定将安装最新的稳定版本。


### npm uninstall 卸载（快捷方式：rm, r）

+ xxx 卸载xxx。多个依赖可用空格分割。
+ xxx -D 卸载xxx，并将依赖信息从package.json中的devDependencies中清除。


### npm list 列出已安装依赖（快捷方式：ls）

+ 默认列出局部依赖。
+ npm list -g 列出已安装的全局依赖。


### npm outdated 检查过期依赖

npm update 更新依赖（快捷方式：up）

+ xxx 局部更新xxx。
+ xxx -g 全局更新xxx。


### npm root 查看依赖安装路径（也就是node_modules的路径）

+ 默认查看局部安装路径。
+ -g 查看全局安装路径。


### npm view 查看模块的注册信息

+ xxx versions 列出xxx的所有版本， 如：npm view jquery versions。
+ xxx dependencies 列出xxx的所有依赖， 如：npm view gulp dependencies。
