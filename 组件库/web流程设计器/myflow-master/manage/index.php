<?php
header('Content-type: application/x-javascript'); 
session_start();	
include_once('config.php');
function __autoload($classname)
{
	include ("class/".strtolower($classname).".class.php");
}
switch($_REQUEST['m']){
	// 验证是否登陆
	case 'cu':
		$m = new User();
		$m->checkUser();
		break;
	// 登陆
	case 'l':
		$m = new User();
		$m->login();
		break;
	// 登出
	case 'lo':
		$m = new User();
		$m->logout();
		break;
	//注册
	case 'rg':
		$m = new User();
		$m->register();
		break;
	// 保存
	case 'sv':
		$m = new Data();
		$m->save();
		break;
	// 验证流程图是否存在
	case 'cn':
		$m = new Data();
		$m->checkName();
		break;
	// 获取文件列表
	case 'fl':
		$m = new Data();
		$m->getFileList();
		break;
	// 获取单个文件内容
	case 'gf':
		$m = new Data();
		$m->getFile();
		break;
	// 重命名
	case 'rn':
		$m = new Data();
		$m->renameFile();
		break;
	//删除文件
	case 'dl':
		$m = new Data();
		$m->deleteFile();
		break;
	// 下载文件
	case 'df':
		$m = new Data();
		$m->downloadFile();
		break;
	// 上传文件
	case 'uf':
		$m = new Data();
		$m->uploadFile();
		break;
	default:
		break;
}
?>