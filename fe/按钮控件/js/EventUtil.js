/**
 *@fileoverview 事件处理工具包
 */
EventUtil = {
	/**
	 * 当前事件对象
	 * @public
	 */
	//currentEvent: null,

	/**
	 * 增加事件
	 * @param {Node} oTarget 目标对象
	 * @param {String} sEventType 事件类型
	 * @param {Function} fnHandler 事件处理器
	 * @public
	 */
	addEventHandler: function(oTarget, sEventType, fnHandler, useCapture) {
		if(useCapture == undefined || useCapture == null) {
			useCapture = true;
		}
		if (oTarget.addEventListener) {  // 用于支持DOM的浏览器
			oTarget.addEventListener(sEventType, fnHandler, useCapture);
		} else if (oTarget.attachEvent) {  // 用于IE浏览器
			oTarget.attachEvent("on" + sEventType, fnHandler);
		} else {  // 用于其它浏览器
			oTarget["on" + sEventType] = fnHandler;
		}
	},
	
	/**
	 * 移除事件
	 * @param {Node} oTarget 目标对象
	 * @param {String} sEventType 事件类型
	 * @param {Function} fnHandler 事件处理器
	 * @public
	 */
	removeEventHandler: function(oTarget, sEventType, fnHandler) {
		if (oTarget.removeEventListener) {  // 用于支持DOM的浏览器
			oTarget.removeEventListener(sEventType, fnHandler, true);
		} else if (oTarget.detachEvent) {  // 用于IE浏览器
			oTarget.detachEvent("on" + sEventType, fnHandler);
		} else {  // 用于其它浏览器
			oTarget["on" + sEventType] = null;
		}
	},
	
	/**
	 * 格式化Event对象，使IE的event事件模型接近于DOM事件模型
	 * @param {Event} sEvent 事件
	 * @public
	 */
	formatEvent: function(oEvent) {
		if (window.event) { //如果是IE浏览器 
			oEvent.eventPhase = 2;
			oEvent.isChar = (oEvent.charCode > 0);
			oEvent.pageX = oEvent.clientX + document.body.scrollLeft;
			oEvent.pageY = oEvent.clientY + document.body.scrollTop;
			if (oEvent.type == "mouseout") {
				oEvent.relatedTarget = oEvent.toElement;
			} else if (oEvent.type == "mouseover") {
				oEvent.relatedTarget = oEvent.fromElement;
			}
			
			oEvent.preventDefault = function() {  // 在Event.js中有类似方法
				this.returnValue = false;
			};
			
			oEvent.stopPropagation = function() {  // 在Event.js中有类似方法
				this.cancelBubble = true;
			};
			
			oEvent.target = oEvent.srcElement;
			oEvent.time = (new Date()).getTime();
		}
		return oEvent;
	},
	
	/**
	 * 获取事件对象
	 * @return {Event} currentEvent 事件对象
	 * @public
	 */
	getEvent: function() {
		var currentEvent;
		if (window.event) {  // 如果是IE浏览器
			currentEvent = this.formatEvent(window.event);
		} 
		else {  // 如果是其他浏览器
			for (var i = 0; i< EventUtil.getEvent.caller.arguments.length; i++){
				if (typeof(EventUtil.getEvent.caller.arguments[i].type) != "unknown" && EventUtil.getEvent.caller.arguments[i].type != null){
					currentEvent = EventUtil.getEvent.caller.arguments[i];
					break;
				}
			}
		}
		if(currentEvent != null && currentEvent.type.startWith("key")){
			currentEvent.key = currentEvent.keyCode ? currentEvent.keyCode : currentEvent.charCode ? currentEvent.charCode : currentEvent.which ? currentEvent.which : void 0;
			currentEvent.lfwKey = currentEvent.keyCode ? currentEvent.keyCode : currentEvent.charCode ? currentEvent.charCode : currentEvent.which ? currentEvent.which : void 0;
		}
//		Lfw.EventUtil.currentEvent = currentEvent;
		return currentEvent;
	},
	/**
	 * 继承
	 */
	extend: function (subclass, superclass) {
			var oc = Object.prototype.constructor;
			var spp = superclass.prototype;
			var sbp = subclass.prototype;
			var F = function() {
			};
			F.prototype = spp;
			sbp = subclass.prototype = new F();
			subclass.superclass = spp;
			sbp.constructor = subclass;
			if (spp.constructor == oc) {
				spp.constructor = superclass;
			}
			subclass.prototype.toString = superclass.prototype.toString;
			return subclass;
		},
		

	/**
	 * 不再分派事件，该方法将停止事件的传播,阻止它被分派到其他Document节点.在事件传播的任何阶段都可以调用它
	 * @param {Event} e 事件对象
	 * @public
	 */
	stopEvent: function(e) {
		if(typeof(e) != "undefined"){
			if (e.stopPropagation)
				// stopPropagation()是DOM事件的核心方法,用于阻止将来事件的冒泡
				e.stopPropagation();
			else {
				// cancelBubble是IE中事件的方法,将其设为true,将会停止事件向上冒泡
				e.cancelBubble = true;
			}
		}
	},
	
	/**
	 * 取消事件的默认动作. 2级DOM Events 该方法将通知Web浏览器不要执行与事件关联的默认动作(如果存在这样的动作) 
	 * @param {Event} e 事件对象
	 * @public
	 */
	stopDefault: function(e) {
		//prevetnDefault()是DOM事件的核心方法,用于阻止事件的默认行为
		if(typeof(e) != "undefined"){
			if (e.preventDefault)
				e.preventDefault();
			else {
				//returnValue是IE中事件的默认属性,将其设置为false以取消事件的默认动做
				e.returnValue = false;
			}
		}
	},
	
	/**
	 * 取消事件分派和默认动作
	 * @param {Event} e 事件对象
	 * @public
	 */
	stopAll: function(e) {
		stopEvent(e);
		stopDefault(e);
	},
	
	/**
	 * 获取目标。在IE中目标包含在event对象的srcElement属性中 在DOM兼容的浏览器中,目标包含在target属性中
	 * 注:位于事件中心的对象称为目标(target)
	 * @param {Event} e 事件对象
	 * @public
	 */
	getTarget: function(e) {
		return e.target || e.srcElement;
	}
	
	/**
 * 删除无自定义属性的事件对象（用于清除依赖关系）
 * @param event
 * @return
 * @private
 */
 clearEventSimply：function(event) {
	if(event){
		if (window.event) {// 如果是IE浏览器
			if (event.originalTarget)
				event.originalTarget = null;
			if (event.target)
				event.target = null;
			if (event.currentTarget)
				event.currentTarget = null;
			if (event.relatedTarget)
				event.relatedTarget = null;
			try {
				event.fromElement = null;
			} catch (error) {
				
			}
			try {
				event.toElement = null;
			} catch (error) {
				
			}
			try {
				event.srcElement = null;
			} catch (error) {
				
			}
		}
		event = null;
	}
};
		
	
}; 

