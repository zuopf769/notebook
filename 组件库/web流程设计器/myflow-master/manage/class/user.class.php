<?php
/**
* 
*/
class User
{
	private $mysql;
	
	function __construct()
	{
		$this->mysql = new XYMysql();
	}

	public function checkUser(){
		if(isset($_SESSION['nickname'])){
			$dd['nickname'] = $_SESSION['nickname'];
			$dd['head'] = $_SESSION['head'];
			$dd = json_encode($dd);
			echo $_REQUEST['c']."(".$dd.")";
		}else{
			echo $_REQUEST['c']."('no loged!')";
		}

	}
	public function login(){
		$sql = "select * from ".PRE."user where username='".$_REQUEST['username']."'";
		// echo $sql;
		$data = $this->mysql->getLine($sql);
		// var_dump($data);
		if($data && $data['password'] == $_REQUEST['password']){
			$_SESSION['username'] = $data['username'];
			$_SESSION['nickname'] = $data['nickname'];
			$_SESSION['email'] = $data['email'];
			$_SESSION['head'] = $data['head'];

			// $dd['username'] = $data['username'];
			$dd = json_encode($data);
			echo $_REQUEST['c']."(".$dd.")";
		}

	}
	public function logout(){
		$_SESSION['username'] = null;
		$_SESSION['nickname'] = null;
		$_SESSION['email'] = null;
		$_SESSION['head'] = null;
		if(isset($_SESSION['username'])){
			echo $_REQUEST['c']."('Logout false!')";
		}else{
			echo $_REQUEST['c']."('Logout success!')";
		}
	}
	public function register(){
		$sql = "select * from ".PRE."user where username='".$_REQUEST['username']."'";
		// echo $sql.'\n';
		$data = $this->mysql->getLine($sql);
		if($data){
			echo $_REQUEST['c']."('Username exit!')";
		}else{
			$sql = "SELECT count(id) as num from ".PRE."user";
			$n = $this->mysql->getLine($sql);

			$sql = "insert into ".PRE."user ( id , username , password , email , nickname , head ) values ('".($n['num']+1)."' , '".$_REQUEST['username']."' , '".$_REQUEST['password']."' , '".$_REQUEST['email']."' , '".$_REQUEST['nickname']."' , '".$_REQUEST['head']."')";
			// echo $sql;
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->mysql->errmsg());
			}
			$_SESSION['username'] = $_REQUEST['username'];
			$_SESSION['nickname'] = $_REQUEST['nickname'];
			$_SESSION['email'] = $_REQUEST['email'];
			$_SESSION['head'] = $_REQUEST['head'];
			$dd['username'] = $_REQUEST['username'];
			$dd['nickname'] = $_REQUEST['nickname'];
			$dd['email'] = $_REQUEST['email'];
			$dd['head'] = $_REQUEST['head'];
			$dd = json_encode($dd);
			echo $_REQUEST['c']."(".$dd.")";
		}
	}
}



?>