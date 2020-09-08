/* eslint angular/log: 0 */
/* eslint angular/foreach: 0 */
/* eslint no-console: 0 */
 
const childProcess = require('child_process');
 
const { execSync } = childProcess;
const { spawnSync } = childProcess;
const fs = require('fs');
const path = require('path');
const colors = require('colors');
 
const LINT_ERR_CODE = 1;
const LINT_SUCCESS_CODE = 0;
 
const statusMap = {
    a: 'add',
    d: 'delete',
    m: 'modify',
    r: 'rename',
    c: 'copy'
}
 
const files = getDiffFiles();
runLint();
quit(LINT_SUCCESS_CODE);
 
/**
 * src/[^lib] 目录下文件变更检查
 */
function verifySrcExcludeLib() {
    /* 待检查的文件相对路径 */
    const lintFiles = files.filter(function (file) {
        return !isLibFiles(file.subpath)
        && !isDistFiles(file.subpath)
        && !isHybridFiles(file.subpath)
        && ~['a', 'm', 'c', 'r'].indexOf(file.status);
    }).map(function (file) {
        return file.path;
    });
    if (!lintFiles.length) {
        return LINT_SUCCESS_CODE;
    }
    const LINT_BIN = path.resolve(__dirname, '../node_modules/.bin/linter');
    const CONFIG_PATH = path.resolve(__dirname, '../.lintrc');
    let argv = [];
    argv = argv.concat(lintFiles);
    argv = argv.concat(['-c', CONFIG_PATH]);
    const result = spawnSync(LINT_BIN, argv, { stdio: 'inherit' });
    if (result && result.status) {
        return LINT_ERR_CODE;
    }
    return LINT_SUCCESS_CODE;
}
 
/**
 * hybrid 目录下文件变更检查
 */
function verifyHybrid() {
    /* 待检查的文件相对路径 */
    const lintFiles = files.filter(function (file) {
        return isHybridFiles(file.subpath)
        && ~['a', 'm', 'c', 'r'].indexOf(file.status);
    }).map(function (file) {
        return file.path;
    });
    if (!lintFiles.length) {
        return LINT_SUCCESS_CODE;
    }
    const result = spawnSync('npm', ['-prefix', 'hybrid/', 'run', 'lint', '--', '--no-fix', ...lintFiles], { stdio: 'inherit' });
    if (result && result.status) {
        return LINT_ERR_CODE;
    }
    return LINT_SUCCESS_CODE;
}
 
/**
 * 文件修改权限检查
 */
function verifyPermission() {
    let permissionStatus = LINT_SUCCESS_CODE;
    const permissionConfig = getPermissionConfig();
    if (!permissionConfig.length) {
        return permissionStatus;
    }
    const userName = getOperateUserName();
    permissionConfig.forEach(function (item) {
        item.subpathReg = new RegExp(`^${item.subpath}`, 'i');
        const ignoreSubpath = item['ignore-subpath'];
        if (ignoreSubpath) {
            item.ignoreSubpathReg = new RegExp(`^${item['ignore-subpath']}`, 'i');
        }
    });
    files.forEach(function (file) {
        permissionConfig.forEach(function (permission) {
            const { subpath, subpathReg, ignoreSubpathReg, status, users } = permission;
            const { status: fileStatus, subpath: fileSubpath } = file;
            if (fileSubpath.match(subpathReg)
                && (!ignoreSubpathReg
                    || !fileSubpath.match(ignoreSubpathReg))
                && ~status.search(fileStatus)
                && !~users.indexOf(userName)) {
                let msg = `[WARNING] You cannot ${statusMap[fileStatus]} in ${subpath}！！`;
                if (users.length > 0) {
                    msg += `\n`;
                    msg += `You can call ${users.join('、')}`;
                }
                if (colors) {
                    console.log(msg.red);
                } else {
                    console.log(msg);
                }
                permissionStatus = LINT_ERR_CODE;
            }
        });
    });
    return permissionStatus;
}
 
/**
 * 获取所有变动的文件,包括增(A)删(D)改(M)重命名(R)复制(C)等
 * @param [type] {string} - 文件变动类型
 * @returns {Array}
 */
function getDiffFiles(type) {
    // 通过是否存在MERGE_HEAD来判断是否含有merge
    // 含有merge则通过 commit commit 来diff精确改动
    // 不含有merge则正常diff
    const DIFF_COMMAND = 'WORKDIR=`git rev-parse --show-toplevel`' + '\n'
        + 'if [ -f "${WORKDIR}/.git/MERGE_HEAD" ];' + '\n'
        + 'then' + '\n'
        + ' CURRENTLY_ADDED=`git write-tree`' + '\n'
        + ' git diff -m $CURRENTLY_ADDED HEAD MERGE_HEAD  --name-status' + '\n'
        + 'else' + '\n'
        + 'CURRENTLY_ADDED=`git write-tree`' + '\n'
        + ' git diff --cached --name-status HEAD' + '\n'
        + 'fi';
    const root = process.cwd();
    const files = execSync(DIFF_COMMAND).toString().split('\n');
    const result = [];
    type = type || 'admrc';
    const types = type.split('').map(function (item) {
        return item.toLowerCase();
    });
    files.forEach(function (file) {
        if (!file) {
            return;
        }
        const temp = file.split(/[\n\t]/);
        let status = temp[0].toLowerCase();
        // 含有merge操作时第一位表示merge代码的操作
        if (status.length === 2) {
            status = status.slice(1);
        }
        let subpath = temp[1];
        // 在移动时使用移动后路径
        if (status.match(/^r/)) {
            subpath = temp[2];
        }
        // https://stackoverflow.com/questions/40702017/what-does-the-number-in-rnumber-after-a-git-rename-mean R099等
        // 在既有修改又有移动时按修改统计
        if (status.length > 1 && status.match(/^r/)) {
            status = 'm';
        }
 
        const filepath = root + '/' + subpath;
        const extName = path.extname(filepath).slice(1);
        
        if (types.length && ~types.indexOf(status)) {
            result.push({
                // 文件变更状态-AMDRC
                status,
                // 文件绝对路径
                path: filepath,
                // 文件相对路径
                subpath: subpath,
                // 文件后缀名
                extName
            });
        }
    });
 
    if (!result.length) {
        quit(LINT_SUCCESS_CODE);
    }
    return result;
}
 
/**
 * 是否是src/lib目录下的文件
 * @param subpath
 */
function isLibFiles(subpath) {
    return subpath.match(/^src\/lib\/.*/i);
}
 
/**
 * 是否是 dist 目录下的文件
 * @param subpath
 */
function isDistFiles(subpath) {
    return subpath.match(/^dist\/.*/i);
}
 
/**
 * 是否是 hybrid 目录下的文件
 * @param subpath
 */
function isHybridFiles(subpath) {
    return subpath.match(/^hybrid\/.*\.(js|jsx|ts|tsx|vue)$/i);
}
 
/**
 * 获取权限配置
 */
function getPermissionConfig() {
    let permissionConfig = [];
    try {
        let packageconfig = fs.readFileSync('./package.json', { encoding: 'utf8' });
        permissionConfig = JSON.parse(packageconfig).config['commit-permission'];
    } catch (err) {}
    return permissionConfig;
}
 
/**
 * 获取提交人name
 */
function getOperateUserName() { 
    const DIFF_COMMAND = 'git config user.name';
    return execSync(DIFF_COMMAND).toString().trim();
}
 
/**
 * 退出
 * @param errorCode
 */
function quit(errorCode) {
    if (errorCode) {
        console.log('Commit aborted.');
    }
    process.exit(errorCode || 0);
}
 
/**
 * 执行 lint 任务
 * 执行耗时太久有一个不满足就退出
 */
function runLint() {
    let lintStatus = LINT_SUCCESS_CODE;
    lintStatus = verifyPermission();
    if (lintStatus === LINT_ERR_CODE) {
        quit(lintStatus);
    }
    lintStatus = verifyHybrid();
    if (lintStatus === LINT_ERR_CODE) {
        quit(lintStatus);
    }
    lintStatus = verifySrcExcludeLib();
    if (lintStatus === LINT_ERR_CODE) {
        quit(lintStatus);
    }
}
