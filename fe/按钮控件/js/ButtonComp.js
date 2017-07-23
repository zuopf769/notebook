/**
 * @fileoverview 按钮控件
 * 
 * @auther zuopf
 * @version 1.0
 * @since 1.0
 * 
 */

//ButtonComp.prototype = new BaseComponent;
ButtonComp.prototype.componentType = "BUTTON";

// 按钮宽高默认值
// 高度
ButtonComp.BUTTON_HEIGHT = 28;
// 宽度
ButtonComp.WIDTH = 90;

/**
 * 按钮控件的构造函数
 * @class 按钮控件类。用户可以指定图片显示于按钮之上，可以指定文字和图片的相对位置，不传入图片路径则只显示文字；用户可以
 *        指定宽和高    
 * @param{String} align 文字和图片的相对位置.相对位置均为文字相对图片的位置,有center,left,right,top,bottom
 *                5种相对位置
 * @param{String} text 显示于按钮上的文字
 * @param{String} tip 鼠标悬停于按钮之上时的提示文字
 * @param{String} refImg 按钮上要显示图片的绝对路径
 * @param{Boolean} disabled 初始是否为禁用状态
 * @extends BaseComponent
 * @constructor
 */
function ButtonComp(params) {

	if (arguments.length == 0)
		return;
	//this.base = BaseComponent;
	//this.base(params.name, params.left, params.top, params.width, params.height);
	this.className = params.className || "button_div";
	this.id = params.name || "button_name";
	this.left = params.left || 0;
	this.top = params.top || 0;
	this.width = params.width || 90;
	this.height = params.height || 28;	
	this.align = params.align || "right";
	this.parentOwner = params.parent;
	this.position =params.position || "absolute";
	this.tip = params.tip || "";
	this.text = params.text || "";
	this.disabled = params.disabled || false;
	this.documentClick = params.documentClick || true;
	this.refImg = params.refImg || "";
	this.create();
};


/**
 * 按钮的主体创建函数
 * @private
 */
ButtonComp.prototype.create = function() {
	var oThis = this;
	this.createDivGen();
	if(this.refImg != ""){
		if (this.align == "left") {
			this.createTextDiv();
			this.createImgDiv();
		}
		// 文字位于图片之右
		if (this.align == "right") {
			this.createImgDiv();
			this.createTextDiv();
		}
		// 文字位于图片之上
		if (this.align == "top") {
			this.createTextDiv();
			var brNode = $ce("br");
			this.Div_gen.appendChild(brNode);
			this.createImgDiv();
		}

		// 文字位于图片之下
		if (this.align == "bottom") {
			this.createImgDiv();
			var brNode = $ce("br");
			this.Div_gen.appendChild(brNode);
			this.createTextDiv();
		}
	}else{
		this.createTextDiv();
	}

};

/**
 * 创建整体DIV
 * @private
 */
ButtonComp.prototype.createDivGen = function() {
	var oThis = this;
	this.Div_gen = $ce("div");
	this.Div_gen.id = this.id;
	this.Div_gen.style.left = this.left + "px";
	this.Div_gen.style.top = this.top + "px";
	this.Div_gen.style.width = this.width;
	this.Div_gen.style.height = this.height;
	this.Div_gen.className = this.className;
	this.Div_gen.title = this.tip == ""?this.text:this.tip;
	this.Div_gen.style.cursor = "pointer";
	this.Div_gen.style.display = "table";
	this.Div_gen.style.tableLayout = "fixed";
	if (this.parentOwner)
		this.parentOwner.appendChild(this.Div_gen);
	
	if(this.disabled){
		this.Div_gen.className = "button_div_disabled";
	}
	
	this.Div_gen.onmousedown = function(e){
		if(oThis.disabled){
			return;
		}
		e = EventUtil.getEvent();
		oThis.onmousedown(e);
		// 删除事件对象（用于清除依赖关系）
		EventUtil.clearEventSimply(e);
	};
	
	this.Div_gen.onmouseup = function(e){
		if(oThis.disabled){
			return;
		}
		e = EventUtil.getEvent();
		oThis.onmouseup(e);
		// 删除事件对象（用于清除依赖关系）
		EventUtil.clearEventSimply(e);
	};
	
	
	this.Div_gen.onfocus = function(e){
		if(oThis.disabled){
			return;
		}
		e = EventUtil.getEvent();
		// 删除事件对象（用于清除依赖关系）
		EventUtil.clearEventSimply(e);
	};
	
	this.Div_gen.onblur = function(e){
		if(oThis.disabled){
			return;
		}
		e = EventUtil.getEvent();
//		oThis.onblur(e);
		// 删除事件对象（用于清除依赖关系）
		EventUtil.clearEventSimply(e);
	};

	this.Div_gen.onclick = function(e) {
		if (oThis.isDblEvent("onclick"))
			return;
		if(oThis.documentClick){
			document.onclick();	
		}
		if (oThis.disabled)
			return;
		e = EventUtil.getEvent();
		e.triggerObj = oThis;
		// 先调用一下document的onclick处理方法,然后执行按钮自己的点击处理方法
		oThis.onclick(e);
		stopEvent(e);
		// 删除事件对象（用于清除依赖关系）
//		clearEvent(e);
		e.triggerObj = null;
		EventUtil.clearEventSimply(e);
	};
};

/**
 * 创建图片DIV
 * @private
 */
ButtonComp.prototype.createImgDiv = function() {
	this.imgDiv = $ce("div");
	this.imgDiv.className = "button_img_div";
	if(Lfw.IS_IE7){
		this.imgDiv.style.display = "block";
		this.imgDiv.style.position = "absolute";
		this.imgDiv.style.right = "0px";
		this.imgDiv.style.top = "50%";
	}
	this.imgNode = $ce("img");
	this.imgNode.src = this.refImg;
	if(Lfw.IS_IE7){
		this.imgNode.style.position = "relative";
		this.imgNode.style.top = "-50%";
	}
	this.imgDiv.appendChild(this.imgNode);
	$(this.Div_gen).prepend(this.imgDiv);
//	this.Div_gen.appendChild(this.imgDiv);
};

/**
 * 创建文字DIV
 * @private
 */
ButtonComp.prototype.createTextDiv = function() {
	this.textDiv = $ce("div");
	this.textDiv.className = "button_text_div";
	if(Lfw.IS_IE7){
		this.textDiv.style.display = "block";
		this.textDiv.style.position = "absolute";
		this.textDiv.style.left = "4px";
		this.textDiv.style.top = "0px";
	}
	this.textDiv.innerHTML = this.text;
	this.Div_gen.appendChild(this.textDiv);
};
/**
 * 按钮控件的二级回调函数
 * @private
 */
ButtonComp.prototype.manageSelf = function() {
	if(Lfw.IS_IE7 || Lfw.IS_IE8){
		if(jQuery.curCSS){
			var wholeW = this.parentOwner.offsetWidth;
			var pl = getInteger(jQuery.curCSS(this.Div_gen,"paddingLeft"),0);
			var pr = getInteger(jQuery.curCSS(this.Div_gen,"paddingRight"),0);
			var bl = getInteger(jQuery.curCSS(this.Div_gen,"borderLeftWidth"),0);
			var br = getInteger(jQuery.curCSS(this.Div_gen,"borderRightWidth"),0);
			var w = wholeW - (pl + pr + bl + br);
			if(w > 0)
				this.Div_gen.style.width = w + "px"; //减去padding和border
			var wholeH = this.parentOwner.offsetHeight;
			var pt = getInteger(jQuery.curCSS(this.Div_gen,"paddingTop"),0);
			var pb = getInteger(jQuery.curCSS(this.Div_gen,"paddingBottom"),0);
			var bt = getInteger(jQuery.curCSS(this.Div_gen,"borderTopWidth"),0);
			var bb = getInteger(jQuery.curCSS(this.Div_gen,"borderBottomWidth"),0);
			var h = wholeH - (pt + pb + bt + bb);
			if(h > 0)
				this.Div_gen.style.height = h + "px";
			if(this.refImg != ""){
				if(this.align == "left" || this.align == "right"){
					var divWidth = this.Div_gen.offsetWidth - 24 < 0? 0 : this.Div_gen.offsetWidth - 24;
					this.textDiv.style.width =  divWidth + "px";
					var divHeight = this.Div_gen.offsetHeight - 8 < 0? 0 : this.Div_gen.offsetHeight - 8;
					this.textDiv.style.lineHeight = divHeight + "px";
				}
			}else{
				var divWidth = this.Div_gen.offsetWidth - 8 < 0? 0 : this.Div_gen.offsetWidth - 8;
				this.textDiv.style.width =  divWidth + "px";
				var divHeight = this.Div_gen.offsetHeight - 8 < 0? 0 : this.Div_gen.offsetHeight - 8;
				this.textDiv.style.lineHeight = divHeight + "px";
			}
		}
	}	
};

/**
 * 改变该button显示的图片
 * 
 * @param imgPath 新图片的路径
 * @public
 */
ButtonComp.prototype.changeImage = function(imgPath) {
	if (this.refImg != null && this.refImg != "") {
		this.refImg = imgPath;
		this.imgNode.src = imgPath;
	}
};

/**
 * 改变按钮上显示的文字
 * 
 * @param text 按钮上要显示的文字
 * @public
 */
ButtonComp.prototype.changeText = function(text) {
	this.text = text;
	this.textDiv.innerHTML = _.escape(this.text);
	this.Div_gen.title = getString(this.tip,"") == ""?this.text:getString(this.tip,"");
	this.ctxChanged = true;
	this.notifyChange(NotifyType.TEXT, this.text);
};

/**
 * 设置此按钮控件的激活状态.
 * 
 * @param isActive true表示处于激活状态,否则表示禁用状态
 * @public
 */
ButtonComp.prototype.setActive = function(isActive) {
	var isActive = getBoolean(isActive, false);
	// 控件处于激活状态变为非激活状态
	if (this.disabled == false && isActive == false) {
		this.disabled = true;
		this.Div_gen.className = "button_div_disabled";
	}
	// 控件处于禁用状态变为激活状态
	else if (this.disabled == true && isActive == true) {
		this.disabled = false;
		this.Div_gen.className = this.className;
	}
	this.ctxChanged = true;
	this.notifyChange(NotifyType.ENABLE, !this.disabled);
};

/**
 * 得到按钮的激活状态.
 * @public
 */
ButtonComp.prototype.isActive = function() {
	return !this.disabled;
};

/**
 * 鼠标移出事件
 * @private
 */
ButtonComp.prototype.onmouseout = function(e) {
	var mouseEvent = {
			"obj" : this,
			"event" : e
		};
	this.doEventFunc("onmouseout", mouseEvent);
};

/**
 * 鼠标移入事件
 * @private
 */
ButtonComp.prototype.onmouseover = function(e) {
	var mouseEvent = {
			"obj" : this,
			"event" : e
		};
	this.doEventFunc("onmouseover", mouseEvent);
};

/**
 * 鼠标按下事件
 * @private
 */
ButtonComp.prototype.onmousedown = function(e) {
	var mouseEvent = {
			"obj" : this,
			"event" : e
		};
	this.doEventFunc("onmousedown", mouseEvent);
};

/**
 * 鼠标弹起事件
 * @private
 */
ButtonComp.prototype.onmouseup = function(e) {
	var mouseEvent = {
			"obj" : this,
			"event" : e
		};
	this.doEventFunc("onmouseup", mouseEvent);
};

/**
 * 单击事件
 * @private
 */
ButtonComp.prototype.onclick = function(e) {
	var mouseEvent = {
			"obj" : this,
			"event" : e
		};
	this.doEventFunc("onclick", mouseEvent);
};

/**
 * 响应快捷键
 * @private
 */
ButtonComp.prototype.handleHotKey = function(key) {
	if (this.isActive() == false)
		return null;
	if (this.hotKey != null) {
		if (key == this.hotKey && this.onclick) {
			this.onclick(null);
			return this;
		}
	}
	return null;
};

/**
 * 设置按钮是否可见
 * @param {} visible
 * @public
 */
ButtonComp.prototype.setVisible = function(visible) {
	if (visible != null && this.visible != visible) {
		if (visible == true)
			this.Div_gen.style.visibility = "";
		else
			this.Div_gen.style.visibility = "hidden";
		this.visible = visible;
	}
	this.ctxChanged = true;
	this.notifyChange(NotifyType.VISIBLE, visible);
};

/**
 * 设置按钮样式
 * @param {} className
 */
ButtonComp.prototype.changeClass = function(className){
	this.Div_gen.className = className;
};

/**
 * 设置按钮宽度
 * @param {} width
 * @public
 */
ButtonComp.prototype.changeWidth = function(width) {
	if (width != null && convertWidth(width) != this.width){
		this.width = (convertWidth(width));
		this.Div_gen.style.width = this.width;
		if(Lfw.IS_IE7){ 
			this.parentOwner.style.width = this.width;
		}
	}
};



/**
 * @description 设置文字字体
 * @param {String} family文字字体
 * @public
 */
ButtonComp.prototype.setFamily = function(family) {
	this.family = family;
	this.Div_gen.style.fontFamily = this.family;
};

/**
 * @description 设置文字字体大小
 * @param {String} size文字字体大小
 * @public
 */
ButtonComp.prototype.setSize = function(size) {
	this.size = size;
	this.Div_gen.style.fontSize = this.size + "px";
};

/**
 * @description 设置文字颜色
 * @param {String} color 文字颜色
 * @public
 */
ButtonComp.prototype.setColor = function(color) {
	this.color = color;
	this.Div_gen.style.color = this.color;
};

/**
 * @description 设置文字字体粗细（normal, bold, bolder, lighter, 100-900）
 * @param {String} weight文字字体粗细
 * @public 
 */
ButtonComp.prototype.setWeight = function(weight) {
	this.weight = weight;
	this.Div_gen.style.fontWeight = this.weight;
};

/**
 * @description 设置文字样式（normal, italic, oblique）
 * @param {String} style 文字样式
 * @public 
 */
ButtonComp.prototype.setStyle = function(style) {
	this.style = style;
	this.Div_gen.style.fontStyle = this.style;
};

/**
 * 设置被改变的对象信息
 * @since 6.3
 * @param context 后台发生变化的值，json对象
 * @private
 */
ButtonComp.prototype.setChangedContext = function(context) {
	if(context.enable != null)
		this.setActive(context.enable);		
	
	if(context.visible != null && this.visible != context.visible)
		this.setVisible(context.visible);	
		
	if(context.text != null && this.text != context.text)
		this.changeText(context.text);
	
	if(context.width != null && this.width != context.width)
		this.changeWidth(context.width);
		
};



if (Lfw.IS_IE && !Lfw.IS_STANDARD) {
	window.$ge = document.getElementById;
	window.$ce = document.createElement;
} 
else {
	/**
	 * 等同于document.getElementById(id);
	 */
	function $ge(id) {
		return document.getElementById(id);
	}
	/**
	 * 等同于document.createElement(obj);
	 * @param obj
	 * @return
	 */
	function $ce(obj) {
		return document.createElement(obj);
	}
}
