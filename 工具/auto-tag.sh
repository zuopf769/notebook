#!/bin/bash
projectRoot=${projectRoot:-./}
PACKAGE_JSON_FILE=${projectRoot}/package.json
echo "package.json 文件路径："$PACKAGE_JSON_FILE

# 上一次提交的commitID
git fetch origin --depth=1
lastCommitID=$(git rev-parse HEAD)
# 获取某次commitID上的tag
curTag=$(git tag --contains ${lastCommitID})
echo "当前commit:${lastCommitID}"
echo "tag是多少：${curTag}"

if [ $curTag ];then
    echo "本次发布commitID:${lastCommitID}已有打tag:${curTag}，不进行版本号升级"
    echo "退出！"
    exit 0;
fi

# 先获取一下进入此插件前工作区修改的代码
PRE_DIFF_FILE=$(git diff --name-only --diff-filter=ACMR)
echo "其他地方修改的文件:$PRE_DIFF_FILE"

# 检测是否普通文件
if [ -f "${PACKAGE_JSON_FILE}" ]; then
    VERSION_NAME=$(grep -e "\"version\"" ${PACKAGE_JSON_FILE} | tr -cd "[0-9][.]")
    echo "升级前版本号："$VERSION_NAME
else
    echo "package.json 文件没有找到，请确认projectRoot参数配置"
fi

VERSION_STRING=$(echo $VERSION_NAME | cut -d '=' -f 2)

# 本地测试暂时不需要设置账号
git config --global user.email "xxxx.com"
git config --global user.name "xxxxx"

cd $projectRoot
pwd

if [ ${TAG_UPDATE_MAJOR_VERSION} = 'true' ]; then
    npm version major --no-git-tag-version
elif [ ${TAG_UPDATE_MINOR_VERSION} = 'true' ]; then
    npm version minor --no-git-tag-version
else
    npm version patch --no-git-tag-version
fi

if [ $? -ne 0 ]; then
    echo "npm version update error，请检查版本号格式是否符合X.Y.Z"
    exit 1
fi

# 获取项目名称
PROJECT_NAME=$(cat package.json | jq .name | tr -d '\"')
# 获取package.json更新后的版本号
NEW_VERSION_STRING=$(cat package.json | jq .version | tr -d '\"')

default_version_patt="[0-9]\{1,\}\.[0-9]\{1,\}\.[0-9]\{1,\}"

echo "$CUSTOMIZE_VERSION_PATT 正则"
echo "$FILEURLS 文件path"
echo "$VERSION_KEYWOEDS 文件关键字"


# 自动更新文件版本号的函数
function updateVersionPatch(){
    echo "更新的匹配文件：$2"
    echo "更新的文件版本号前缀：$1"
    if [ $CUSTOMIZE_VERSION_PATT ]; then 
        echo "进入自定义版本号匹配,匹配规则：$CUSTOMIZE_VERSION_PATT"
        sed -i "s/$1${CUSTOMIZE_VERSION_PATT}/$1${NEW_VERSION_STRING}/g" $2
    else
        sed -i "s/$1${default_version_patt}/$1${NEW_VERSION_STRING}/g" $2
    fi
    echo "/////////////"
}

# 处理自定义的文件版本更新
if [ $FILEURLS -a $VERSION_KEYWOEDS ]; then
    fileUrlArr=(${FILEURLS//,/ })
    versionKeyWordArr=(${VERSION_KEYWOEDS//,/ })

    if [ ${#fileUrlArr[@]} != ${#versionKeyWordArr[@]} ]; then
        echo "输入的自定修改文件与关键字数量不匹配:"
        echo "文件:$FILEURLS"
        echo "关键字:$VERSION_KEYWOEDS"
        exit 1;
    fi
    for ((i=0;i<${#fileUrlArr[@]};i++))
    do
        updateVersionPatch ${versionKeyWordArr[i]} ${fileUrlArr[i]}
    done
fi


git add .
# 将不是本插件修改的代码从暂存区reset掉
if [ $PRE_DIFF_FILE];then
    git reset $PRE_DIFF_FILE
fi

git commit -n -m "Merge: ${AWP_OP}: ${PROJECT_NAME}版本号自动升级，从${VERSION_STRING}升级到${NEW_VERSION_STRING}"


if [ -z "${AWP_GIT_BRANCH_NAME}" ]; then
    git push origin HEAD
else
    git push origin HEAD:${AWP_GIT_BRANCH_NAME}
fi
if [ $? -ne 0 ]; then
    echo "git push 代码时出错，请检查是否有写权限"
    exit 1
fi

# tag发布
TAG_STR="v${NEW_VERSION_STRING}"
git tag "$TAG_STR"
git push origin "$TAG_STR"
if [ $? -ne 0 ]; then
    echo "git push tag 时出错，请检查是否有写权限"
    exit 1
fi

echo " 自动升级版本号: ${VERSION_STRING} to ${NEW_VERSION_STRING} successfully."
