#!/usr/bin/env bash

# 先source一次，如果本机安装了nvm，那么这个时候就能检测到nvm了
source ~/.bashrc 

nvm_version="v0.34.0"

# 检查是否已经安装nvm
if [[ -d ~/.nvm ]]; then
    echo "[deploy-env-check] nvm is already installed"
else
    echo "[deploy-env-check] installing nvm"

    # nvm安装
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${nvm_version}/install.sh | bash

    # 为当前shell加载nvm
    if [ -f ~/.bashrc ]; then
        source ~/.bashrc
    else
        source ~/.nvm/nvm.sh
    fi
fi


# 指定自身需要的node版本
targetVersion=8.15.0

if nvm ls $targetVersion; then
    echo "[deploy-env-check] node v$targetVersion is already installed"
    nvm use $targetVersion
else
    echo "[deploy-env-check] installing node v$targetVersion"
    # install node + npm use nvm
    nvm install $targetVersion 
    nvm alias default $targetVersion
fi


if command -v pm2 >/dev/null 2>&1; then
	echo '[deploy-env-check] pm2 检测通过'
else
	echo '[deploy-env-check] pm2 不存在..安装...'
    # node-gyp安装
    npm install node-gyp-install -g --registry=https://registry.npm.taobao.org
    node-gyp-install
    
    # 更新一下npm的版本
    npm install -g npm

    #安装PM2
    echo '[deploy-env-check]pm2 intall'
    npm install -g pm2 --registry=https://registry.npm.taobao.org
    echo '[deploy-env-check]pm2 更新'
    pm2 update
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 100M
    pm2 set pm2-logrotate:retain 100
fi

echo "[deploy-env-check] end"

source ~/.bashrc 

#必须以exec启动node服务(or pm2), 以确保当前shell脚本不会退出, 真是目的是保证进程的PID不变
#如果使用pm2, pm2要以非守护进程的方式启动node. (参数 --no-daemon ), 确保pm2在前台运行. 目的同上
exec pm2 start ./pm2/production.json --no-daemon
