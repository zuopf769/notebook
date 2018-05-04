

var Rsync = require('rsync');
var path = require('path');
var fs = require('fs');
var colors = require('colors');

var root = process.cwd();

var appDirectory = fs.realpathSync(root);
var resolveApp = relativePath => path.resolve(appDirectory, relativePath);


var logPrex = '[log]'.green;
var warnPrex = '[warn]'.yellow;
var errPrex = '[error]'.red;

function uploadFile(configPath){
    configPath = resolveApp(configPath || 'dev.json');

    if(!fs.existsSync(configPath)){
        return console.log('[error]'.bold.red, 'config file', configPath.bold.red, 'not exists.');
    }

    var config = require(configPath);
    var source = config.source || './';
    var _path = config.path || config.dest;
    var server = config.server;
    var isSudo = config.sudo === undefined ? false : config.sudo;
    var port = config.port || 22;
    var errorField = [];

    if(typeof _path !== 'string' || _path.length === 0) {
        errorField.push('path')
    }

    if(typeof server !== 'string' || server.length === 0) {
        errorField.push('server')
    }

    if(errorField.length > 0){
        console.log('[error]'.red, 'invalid config field', errorField.join(', ').bold.yellow, 'at', (root + '/' + configPath).bold.yellow);
        console.log('\nconfig example: \n');
        console.log('  {');
        console.log('    "source": "./",');
        console.log('    "exclude": [".idea", ".git", "node_modules", "prd", "loc", "env", "src", "dll"],');
        console.log('    "port": 22,');
        console.log('    "sudo": true,');
        console.log('    "path": "/root/username/project_name",');
        console.log('    "server": "root@xxxxxx"');
        console.log('  }');
        console.log('\n');
        return
    }

    // Build the command
    var rsync = new Rsync()
        .debug(true)
        .shell('ssh -p ' + port)
        .flags('rzcv')
        .exclude(config.exclude)
        .source(source)
        .destination(server + ':' + _path);
    rsync.cwd(root);
    rsync.set('chmod', 'a+rX,u+w');
    rsync.set('rsync-path', (isSudo ? 'sudo ' : '') + 'rsync');

    console.log(logPrex, '执行:', rsync.command().bold);

    rsync.output(
        function(data){
            var str = data.toString();
            if(str.match(/\d+ files\.\.\./)){
                return
            }
            console.log(logPrex, str.split('\n')[0]);
        }, function(data){
            console.log(errPrex, data.toString());
        }
    );

    // Execute the command
    rsync.execute(function(err, code, cmd){
        // we're done
        if(err){
            console.log(errPrex, err.stack)
        }else{
            console.log(logPrex, 'sync finish'.magenta.bold);
        }
    });
}

// module.exports = {
//     sync: uploadFile
// };

uploadFile(process.argv[2]);