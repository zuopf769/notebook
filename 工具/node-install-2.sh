version="8.10.0"

command -v node >/dev/null 2>&1 && [ `node -v` = "v$version" ] && echo "already have node v$version" || {
   echo "need install v$version"

   source ~/.bash_profile # 先source一次，如果本机安装了nvm，那么这个时候就能检测到nvm了

   command -v nvm >/dev/null 2>&1 || {
       echo "installing nvm..."

       export HOME=~ # 在plus部署时，读取不到$HOME变量，手动指定一下，用export可以让子shell也使用到这个变量
       export NVM_DIR=$HOME/.nvm # 手动指定NVM_DIR, 防止NVM_DIR被污染

       curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${nvm_version}/install.sh | bash

       [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
   }

   echo "nvm install node v$version..."
   nvm install $version

   echo "nvm alias default $version"
   nvm alias default $version

   export PATH=$PATH

   source ~/.bash_profile # 让node安装能够生效
}
