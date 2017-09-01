<?php
/**
* 
*/
class Data
{
	private $mysql;
	
	function __construct()
	{
		// echo '1';
		$this->mysql = new XYMysql();
	}
	public function checkName(){
		$sql = "select * from ".PRE."data where name='".$_REQUEST['name']."' and username='".$_SESSION['username']."'";
		// echo $sql;
		$data = $this->mysql->getLine($sql);
		if($data){
			// $data = json_encode($data);
			echo $_REQUEST['c']."('yes')";
		}else{
			echo $_REQUEST['c']."('no')";
		}
	}
	public function save(){
		$sql = "select * from ".PRE."data where name='".$_REQUEST['name']."' and username='".$_SESSION['username']."'";
		// echo $sql.'\n';
		$data = $this->mysql->getLine($sql);
		if($data){
			$sql = "update ".PRE."data set data='".$_REQUEST['data']."' where id=".$data['id'];
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->Mysql->errmsg());
			}
			// $data = json_encode($data);
			echo "'yes'";
			// echo $_REQUEST['c']."('yes')";
		}else{
			$sql = "SELECT id from ".PRE."data order by id desc";
			$n = $this->mysql->getData($sql);

			$sql = "insert into ".PRE."data ( id , name , username , data ) values ('".($n[0]['id']+1)."' , '".$_REQUEST['name']."' , '".$_SESSION['username']."' , '".$_REQUEST['data']."')";
			// echo $sql;
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->mysql->errmsg());
			}
			echo "'yes'";
			// echo "('yes')";
			// echo $_REQUEST['c']."(no)";
		}
	}
	public function getFileList(){
		$sql = "select name from ".PRE."data where username='".$_SESSION['username']."' order by id desc";
		$data = $this->mysql->getData($sql);
		if($data){
			$dd = json_encode($data);
			echo $_REQUEST['c']."(".$dd.")";
		}else{
			echo $_REQUEST['c']."({})";
		}
	}
	public function getFile(){
		$sql = "select data from ".PRE."data where name='".$_REQUEST['name']."' and username='".$_SESSION['username']."'";
		$data = $this->mysql->getLine($sql);
		if($data){
			// $dd = json_encode($data);
			echo $_REQUEST['c']."(".$data['data'].")";
		}else{
			echo $_REQUEST['c']."({})";
		}
	}
	public function renameFile(){
		$sql = "select * from ".PRE."data where name='".$_REQUEST['oldname']."' and username='".$_SESSION['username']."'";
		// echo $sql.'\n';
		$data = $this->mysql->getLine($sql);
		if($data){
			$sql = "update ".PRE."data set name='".$_REQUEST['newname']."' where id=".$data['id'];
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->mysql->errmsg());
			}
			// $data = json_encode($data);
			// echo "'yes'";
			echo $_REQUEST['c']."('yes')";
		}else{
			$sql = "select * from ".PRE."data where name='".$_REQUEST['newname']."' and username='".$_SESSION['username']."'";
			$data = $this->mysql->getLine($sql);
			if($data){
				$sql = "update ".PRE."data set name='".$_REQUEST['newname']."' where id=".$data['id'];
				$this->mysql->runSql($sql);
				if($this->mysql->errno() != 0){
					die("Error:".$this->mysql->errmsg());
				}
				// $data = json_encode($data);
				// echo "'yes'";
				echo $_REQUEST['c']."('yes')";
			}else{
				$sql = "SELECT id from ".PRE."data order by id desc";
				$n = $this->mysql->getData($sql);

				$sql = "insert into ".PRE."data ( id , name , username , data ) values ('".($n[0]['id']+1)."' , '".$_REQUEST['newname']."' , '".$_SESSION['username']."' , '{}')";
				// echo $sql;
				$this->mysql->runSql($sql);
				if($this->mysql->errno() != 0){
					die("Error:".$this->mysql->errmsg());
				}
				// echo "'yes'";
				// echo "('yes')";
				echo $_REQUEST['c']."('yes')";
			}
		}
	}
	public function deleteFile(){
		$sql = "delete from ".PRE."data where name='".$_REQUEST['name']."' and username='".$_SESSION['username']."'";
		$this->mysql->runSql($sql);
		if($this->mysql->errno() != 0){
			die("Error:".$this->mysql->errmsg());
		}
		else{
			echo $_REQUEST['c']."('yes')";
		}
	}
	public function downloadFile(){
		$sql = "select data from ".PRE."data where name='".$_REQUEST['name']."' and username='".$_SESSION['username']."'";
		$data = $this->mysql->getLine($sql);
		if($data){
			$name = $_REQUEST['name'].'.json';
			// $path = 'fileTmp/'.$name;
			// $fp = fopen($path,'w');
			// fwrite($fp , $data['data']);
			// fclose($fp);
			// $file = fopen($path,"r");
			Header("Content-type: application/octet-stream");
            Header("Accept-Ranges: bytes");
            // Header("Accept-Length: ".filesize($path));
            Header("Content-Disposition: attachment; filename=".$name);
            echo $data['data'];
			// echo fread($file, filesize($path));
   //          fclose($file);

			// $dd = json_encode($data);
			// echo $_REQUEST['c']."('".$name."')";
		}else{
			// echo "";
		}
	}
	public function uploadFile(){
		// header("Content-type:txt/html");
		header("Content-type: text/html; charset=utf-8");
		// echo $form->isMultipart();
		$content = file_get_contents($_FILES['f']['tmp_name']);
		$name = explode(".", $_FILES['f']['name'])[0];
		// var_dump();
		// echo $name;
		$sql = "select id from ".PRE."data where name='".$name."' and username='".$_SESSION['username']."'";
		// echo $sql.'\n';
		$data = $this->mysql->getLine($sql);
		echo '<script src="../js/jquery-1.11.0.min.js"></script>';
		if($data){
			$sql = "update ".PRE."data set data='".$content."' where id=".$data['id'];
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->mysql->errmsg());
			}
			// $data = json_encode($data);
			// echo "<h4>上传成功</h4>";
			// echo $_REQUEST['c']."('yes')";
			echo '<script>
					setTimeout(function(){
						$(".top .user .function .file #file", parent.document).val("'.$name.'");
						$(".myalert",parent.document).hide(500);
						$(".cover",parent.document).hide();
						setTimeout(function(){
							$(".myalert",parent.document).html("");
						},2000)
					},700)
				</script>';
		}else{
			$sql = "SELECT id from ".PRE."data order by id desc";
			$n = $this->mysql->getData($sql);

			$sql = "insert into ".PRE."data ( id , name , username , data ) values ('".($n[0]['id']+1)."' , '".$name."' , '".$_SESSION['username']."' , '".$content."')";
			// echo $sql;
			$this->mysql->runSql($sql);
			if($this->mysql->errno() != 0){
				die("Error:".$this->mysql->errmsg());
			}
			// echo "<h4>上传成功</h4>";
			// echo "('yes')";
			// echo $_REQUEST['c']."(no)";
			echo '<script>
					setTimeout(function(){
						$(".top .user .function .file #file option", parent.document)[0].selected = true;
						$(".top .user .function .file #file option:selected", parent.document).text("'.$name.'").val("'.$name.'");
						$(".myalert",parent.document).hide(500);
						$(".cover",parent.document).hide();
						setTimeout(function(){
							$(".myalert",parent.document).html("");
						},2000)
					},700)
				</script>';
		}
		echo '<h3 style="margin:150px 200px;">上传成功</h3>';
		echo '<script>
					window.top.postMessage(\''.$content.'\',window.top.location.href);
				</script>';

	}

}



?>