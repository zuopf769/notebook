<?php


class XYObject {

    protected $errno = 'XY_Success';
    protected $errmsg;
    static $db;

    //实现自动建表
    public function __construct() {
        $this->errmsg = "_XY_OK_";
        static $inited = false;
        //只初始化一次
        if ($inited)
            return;       
        self::$db = get_class($this) == "XYMysql" ? $this : new XYMysql();        
        $inited = true;
    }

    //获得错误代码
    public function errno() {
        return $this->errno;
    }

    //获得错误信息
    public function errmsg() {
        return $this->errmsg;
    }

    public function setAuth($accesskey, $secretkey) {
        
    }

}

?>