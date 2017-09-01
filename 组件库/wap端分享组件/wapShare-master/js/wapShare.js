"use strict";
/**
 * 
 * @authors xichen Liu
 * @date    2015-12-19 14:47:38
 * @version 10.0.0
 */


//	 分享媒体id对应表
//	 名称	   		ID
//	 一键分享		mshare
//	 QQ空间			qzone
//	 新浪微博		tsina
//	 人人网			renren
//	 腾讯微博		tqq
//	 百度相册		bdxc
//	 开心网			kaixin001
//	 腾讯朋友		tqf
//	 百度贴吧		tieba
//	 豆瓣网			douban
//	 搜狐微博		tsohu
//	 百度新首页		bdhome
//	 QQ好友			sqq
//	 和讯微博		thx
//	 百度云收藏		bdysc
//	 美丽说			meilishuo
//	 蘑菇街			mogujie
//	 点点网			diandian
//	 花瓣			huaban
//	 堆糖			duitang
//	 和讯			hx
//	 飞信			fx
//	 有道云笔记		youdao
//	 麦库记事		sdo
//	 轻笔记			qingbiji
//	 人民微博		people
//	 新华微博		xinhua
//	 邮件分享		mail
//	 我的搜狐		isohu
//	 摇篮空间		yaolan
//	 若邻网			wealink
//	 天涯社区		ty
//	 Facebook		fbook
//	 Twitter		twi
//	 linkedin		linkedin
//	 复制网址		copy
//	 打印			print
//	 百度个人中心	ibaidu
//	 微信			weixin
//	 股吧			iguba

/**
 * [wapShare 手机端网页分享功能]
 * @param  {[element]} clickBtn 	[点击显示分享按钮]
 * @param  {[array]}   arrCont 	    [自定义分享内容,自定义分享摘要,自定义分享url地址,自定义分享图片]
 * @param  {[array]}   newShare 	[新增分享]
 * @param  {[array]}   newShareName [新增分享名称]
 */

var wapShare = Class.extend({
	ctor:function(){
		this._init.apply(this,arguments);
	},
	_init:function(clickBtn,arrCont,newShare,newShareName){

		if(!clickBtn){
			return;
		}

		this._clickBtn = clickBtn;

		this._arrCont = arrCont;

		this._newShare = newShare || [];

		this._newShareName = newShareName || [];

		this._bodyW = document.body.offsetWidth;

		this._bodyH = document.body.offsetHeight;

		this._shareBtn = ['qzone', 'tsina', 'weixin', 'tqq']; //分享平台

		this._shareBtnName = ['QQ空间', '新浪微博', '微信', '腾讯微博']; //分享平台名称

		this._compatArray = ['', '-moz-', '-webkit-', '-ms-', '-o-']; //事件兼容

		this._timer = null; //定时器

		this._proData();

	},
	/**
	 * [_proData 处理传入数据]
	 */
	_proData:function(){

		var shareBtnLen = this._newShare.length;

		var shareNameLen = this._newShareName.length;

		var minLen = shareBtnLen <= shareNameLen ? shareBtnLen : shareNameLen;

		for(var i=0;i<minLen;i++){

			this._shareBtn.push(this._newShare[i]);

			this._shareBtnName.push(this._newShareName[i]);

		}
		this._addBdShare();
	},
	/**
	 * [_addBdShare 创建百度分享]
	 */
	_addBdShare:function(){

		this._maskLayer = document.createElement('div');//遮罩层

		this._maskLayer.className = 'maskLayer';

		this._maskLayer.style.display = 'none';


		this._bdShareView = document.createElement('div');//分享显示层

		this._bdShareView.className = 'bdsharebuttonbox';

		this._bdShareView.setAttribute('data-tag','share_1');

		for(var i=0;i<this._compatArray.length;i++){
			var compatible = this._compatArray[i];
			this._bdShareView.style[compatible+'transform'] = 'translateY('+this._bodyH+'px)';
		}

		this._appShareBtn(this._maskLayer,this._bdShareView);

		this._newShareBtn();
	},
	/**
	 * [_newShareBtn 分享按钮]
	 */
	_newShareBtn:function(){

		for(var i=0;i<this._shareBtn.length;i++){

			var shareBtnPar = document.createElement('div');

			shareBtnPar.className = 'shareBtnPar';

			var shareBtn = document.createElement('a');

			shareBtn.className = 'bds_' + this._shareBtn[i];

			shareBtn.setAttribute('data-cmd',this._shareBtn[i]);

			shareBtn.innerHTML = this._shareBtnName[i];

			this._appShareBtn(shareBtnPar,shareBtn);

			this._appShareBtn(this._bdShareView,shareBtnPar);

		}
		this._bdShareJs();
	},
	/**
	 * [_appShareBtn 添加子按钮]
	 * @param  {[element]} parElem   [父级元素]
	 * @param  {[element]} childElem [子级元素]
	 */
	_appShareBtn:function(parElem,childElem){

		if(!parElem || !childElem){

			return;

		}
		parElem.appendChild(childElem);
	},
	/**
	 * [_bdShareJs 引入百度分享js]
	 */
	_bdShareJs:function(){
		var arrCont = this._arrCont;
		document.body.appendChild(this._maskLayer);

		window._bd_share_config = {

			common : {
				bdText : arrCont[0],
				bdDesc : arrCont[1],
				bdUrl : arrCont[2],
				bdPic : arrCont[3]
			},
			share : [{
				"tag" : "share_1",
				"bdSize" : 32
			}]
		}
		var bdJsPos = document.body || document.getElementsByTagName('head')[0];

		var script = document.createElement('script');

		script.src = 'http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=' + ~(-new Date() / 36e5);

		bdJsPos.appendChild(script);

		this._viewShare();
	},
	/**
	 * [_viewShare 百度分享事件]
	 */
	_viewShare:function(){
		var _self = this;

		this._shareView = function(e){//显示分享
			_self._animViewShare(e);
		}

		this._shareHide = function(e){//隐藏分享
			_self._animHideShare(e);
		}

		this._addEvent(this._clickBtn,'click',this._shareView,false);
		this._addEvent(this._maskLayer,'click',this._shareHide,false);
		this._addEvent(this._maskLayer,'touchmove',function(e){
			var oEvent = e || event;
			oEvent.preventDefault();
		},false);
	},
	/**
	 * [_animViewShare 动画显示分享]
	 * @param  {[object]} e [事件对象]
	 */
	_animViewShare:function(e){

		var _self = this;

		var oEvent = e || event;

		this._maskLayer.style.display = 'block';

		this._timer = setTimeout(function(){

			for(var i=0;i<_self._compatArray.length;i++){

				var compatible = _self._compatArray[i];

				_self._bdShareView.style[compatible+'transition'] = 'all 400ms linear';

				_self._bdShareView.style[compatible+'transform'] = 'translateY(0px)';

			}

			clearTimeout(_self._timer);

		},50);

		if(oEvent.stopPropagation){
			oEvent.stopPropagation();
		}
		else {
			oEvent.cancelBubble = true;
		}

	},
	/**
	 * [_animHideShare 动画隐藏分享]
	 * @param  {[object]} e [事件对象]
	 */
	_animHideShare:function(e){

		var _self = this;

		var oEvent = e || event;

		for(var i=0;i<_self._compatArray.length;i++){

			var compatible = _self._compatArray[i];

			_self._bdShareView.style[compatible+'transition'] = 'all 400ms linear';

			_self._bdShareView.style[compatible+'transform'] = 'translateY('+this._bodyH+'px)';

		}
		this._timer = setTimeout(function(){

			_self._maskLayer.style.display = 'none';

			clearTimeout(_self._timer);


		},300);

	},
	/**
	 * [_addEvent 添加监听事件]
	 * @param {[element]}   obj   [事件元素]
	 * @param {[string]}    event [执行事件]
	 * @param {[Function]}  fn    [事件回调]
	 * @param {[boolean]}   state [事件状态]
	 */
	_addEvent:function(obj,event,fn,state){
		if(obj.addEventListener){
			obj.addEventListener(event,fn,state);
		}
		else {
			obj.attachEvent('on'+event,fn);
		}
	},
});