//全局命名空间

/**
 * @class Lfw 
 */
var Lfw = window.Lfw || {};

(function(){
	var enumerables = true,enumerablesTest = {toString: 1},toString = Object.prototype.toString;
		
    for (i in enumerablesTest) {
        enumerables = null;
    }
    if (enumerables) {
        enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    }
    Lfw.enumerables = enumerables;
	/**
	 * 复制对象属性
	 * 
	 * @param {Object}  目标对象
	 * @param {Object} 源对象
	 */	
    Lfw.apply = function(object, config) {
        if (object && config && typeof config === 'object') {
            var i, j, k;
            for (i in config) {
                object[i] = config[i];
            }
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
        return object;
    };
    
    Lfw.apply(Lfw, {
		version:  '6.5',
		/**
		* IE浏览器
		*/
		IS_IE:  false,
		/**
		* FirFox浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_FF: false,
		/**
		* OPERA浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_OPERA: false,
		/**
		* CHROME浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_CHROME: false,
		/**
		* SAFARI浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_SAFARI: false,
		/**
		* WEBKIT内核浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_WEBKIT: false,
		/**
		* IE6浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE6: false,
		/**
		* IE7浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE7: false,
		/**
		* IE8浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE8: false,
		/**
		* IE8浏览器,使用兼容模式时也为true
		* @memberOf Lfw
		* @public
		*/
		IS_IE8_CORE: false,
		/**
		* IE9浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE9: false,
		/**
		* IE9浏览器,使用兼容模式时也为true
		* @memberOf Lfw
		* @public
		*/
		IS_IE9_CORE: false,
		/**
		* IE10浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE10: false,
		/**
		* IE10以上浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE10_ABOVE: false,
		/**
		* IE11浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IE11: false,
		/**
		* IOS系统浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IOS: false,
		/**
		* IPHONE浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IPHONE: false,
		/**
		* IPAD浏览器
		* @memberOf Lfw
		* @public
		*/
		IS_IPAD: false,
		/**
		* 标准浏览器(firefox, chrome, ie9以上,safari)
		* @memberOf Lfw
		* @public
		*/
		IS_STANDARD: false,
		BROWSER_VERSION: 0    
    });
    
	/**
	 *取浏览器版本信息 
	 */    
	function  getVersion(){
		var userAgent = navigator.userAgent,   
		rMsie = /(msie\s|trident.*rv:)([\w.]+)/,   
		rFirefox = /(firefox)\/([\w.]+)/,   
		rOpera = /(opera).+version\/([\w.]+)/,   
		rChrome = /(chrome)\/([\w.]+)/,   
		rSafari = /version\/([\w.]+).*(safari)/;  
		var browser;  
		var version;  
		var ua = userAgent.toLowerCase();  
		function uaMatch(ua) {  
			var match = rMsie.exec(ua);  
			if (match != null) {  
				return { browser : "IE", version : match[2] || "0" };  
			}  
			var match = rFirefox.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rOpera.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rChrome.exec(ua);  
			if (match != null) {  
				return { browser : match[1] || "", version : match[2] || "0" };  
			}  
			var match = rSafari.exec(ua);  
			if (match != null) {  
				return { browser : match[2] || "", version : match[1] || "0" };  
			}  
			if (match != null) {  
				return { browser : "", version : "0" };  
			}  
		}  
		var browserMatch = uaMatch(userAgent.toLowerCase())||{};  
	//	if (browserMatch.browser) {  
	//		browser = browserMatch.browser;  
	//		version = browserMatch.version;  
	//	} 
		return browserMatch;
	}
	var ua = navigator.userAgent.toLowerCase(), s, o = {};
	var version = getVersion();
	if (s=ua.match(/opera.([\d.]+)/)) {
	         Lfw.IS_OPERA = true;
	}else if(version.browser=="IE"&&version.version==11){
		Lfw.IS_IE11 = true;
		 Lfw.IS_IE = true;
	}else if (s=ua.match(/chrome\/([\d.]+)/)) {
	         Lfw.IS_CHROME = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/version\/([\d.]+).*safari/)) {
	         Lfw.IS_SAFARI = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/gecko/)) {
	         //add by licza : support XULRunner  
	         Lfw.IS_FF = true;
	         Lfw.IS_STANDARD = true;
	} else if (s=ua.match(/msie ([\d.]+)/)) {
	         Lfw.IS_IE = true;
	}
	
	/* else if (s=ua.match(/iphone/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPHONE = true;
	}*/ /*else if (s=ua.match(/ipad/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPAD = true;
	         Lfw.IS_STANDARD = true;
	}*/ else if (s=ua.match(/firefox\/([\d.]+)/)) {
	         Lfw.IS_FF = true;
	         Lfw.IS_STANDARD = true;
	} /*else if (s=ua.match(/webkit\/([\d.]+)/)) {
	         Lfw.IS_WEBKIT = true;
	} */
	if (ua.match(/webkit\/([\d.]+)/)) {
	         Lfw.IS_WEBKIT = true;
	}
	if (ua.match(/ipad/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPAD = true;
	         Lfw.IS_STANDARD = true;
	}
	if (ua.match(/iphone/i)){
	         Lfw.IS_IOS = true;
	         Lfw.IS_IPHONE = true;
	}
//	if (s && s[1]) {
//	         Lfw.BROWSER_VERSION = parseFloat( s[1] );
//	} else {
//	         Lfw.BROWSER_VERSION = 0;
//	}
	Lfw.BROWSER_VERSION = version ? (version.version ?  version.version : 0) : 0;
	if (Lfw.IS_IE) {
	         var intVersion = parseInt(Lfw.BROWSER_VERSION);
	         var mode = document.documentMode;
	         if(mode == null){
	                   if (intVersion == 6) {
	                            Lfw.IS_IE6 = true;
	                   } 
	                   else if (intVersion == 7) {
	                            Lfw.IS_IE7 = true;
	                   } 
	                   /*else if (intVersion == 8) {
	                            Lfw.IS_IE8_CORE = true;
	                            Lfw.IS_IE8 = true;
	                   } else if (intVersion == 9) {
	                            Lfw.IS_IE9 = true;
	                            Lfw.IS_IE9_CORE = true;
	                            Lfw.IS_STANDARD = true;
	                   }*/
	         }
	         else{
	                   if(mode == 7){
	                            Lfw.IS_IE7 = true;
	                   }
	                   else if (mode == 8) {
	                            Lfw.IS_IE8 = true;
	                   } 
	                   else if (mode == 9) {
	                            Lfw.IS_IE9 = true;
	                            Lfw.IS_STANDARD = true;
	                   }
	                   else if (mode == 10) {
	                            Lfw.IS_IE10 = true;
	                            Lfw.IS_STANDARD = true;
	                            Lfw.IS_IE10_ABOVE = true;
	                   }
	                   else{
	                            Lfw.IS_STANDARD = true;
	                   }
	                   if (intVersion == 8) {
	                            Lfw.IS_IE8_CORE = true;
	                   } 
	                   else if (intVersion == 9) {
	                            Lfw.IS_IE9_CORE = true;
	                   }
	                   else if(version.version==11){
	                	   Lfw.IS_IE11 = true;
	                   }
	                   else{
	                            
	                   }
	         }
	}
//	Lfw.ATTRFLOAT = Lfw.IS_IE ? "styleFloat" : "cssFloat";    
	Lfw.apply(Lfw,{
		ATTRFLOAT : Lfw.IS_IE ? "styleFloat" : "cssFloat",
		
		/**
		 * 定义命名空间
		 */
	    namespace : function(name){
	    	if (typeof name != 'string') {
	    		throw new Error("Invalid namespace, must be a string!");
	    	}	
	    	var parts = name.split(('.'));
	    	var root = window, part, i, nameLn;
            for (i = 0, nameLn = parts.length; i < nameLn; i++) {
                part = parts[j];
                if (typeof part != 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }
                    root = root[part];
                }
            }
            return root;
	    },
	    
	    isArray: Array.isArray ||  function(obj){
	    	return toString.call(obj) == '[object Array]';
	    },
	    
	    isNumber: function(obj){
	    	return toString.call(obj) == '[object Number]';
	    },
	    
	    isisBoolean: function(obj){
	    	return toString.call(obj) == '[object isBoolean]';
	    },
	    
	    isFunction: function(obj){
	    	return toString.call(obj) == '[object Function]';
	    },
	    
	    isString: function(obj){
	    	return toString.call(obj) == '[object String]';
	    },
	    
	    isDate: function(obj){
	    	return toString.call(obj) == '[object Date]';
	    },
	    
	    isRegExp: function(obj){
	    	return toString.call(obj) == '[object RegExp]';
	    },
	    
	    isArguments: function(obj){
	    	return toString.call(obj) == '[object Arguments]';
	    },
	    
  		isNaN: function(obj) {
    		return Lfw.isNumber(obj) && obj != +obj;
  		},

  		isBoolean: function(obj) {
    		return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  		},

  		isNull: function(obj) {
    		return obj === null;
  		},

 		 isUndefined: function(obj) {
    		return obj === void 0;
  		}
	});
	
	/**
	 * 定义命名空单简化方法
	 */
	Lfw.ns = Lfw.namaspace;
}());


/**
 * 数据类型定义
 * @namespace 
 */
Lfw.DataType = {
	/**
	 * STRING类型
	 */
	STRING: "String",
	/**
	 * Integer类型
	 */
	INTEGER: "Integer",
	/**
	 * int类型
	 */
	INT: "int",
	/**
	 * Double类型
	 */
	DOUBLE: "Double",
	/**
	 * double类型
	 */
	dOUBLE : "double",
	/**
	 * UFDouble类型
	 */
	UFDOUBLE: "UFDouble",
	/**
	 * Float类型
	 */
	FLOAT: "Float",
	/**
	 * float类型
	 */
	fLOAT: "float",
	/**
	 * Byte类型
	 */
	BYTE: "Byte",
	/**
	 * byte类型
	 */
	bYTE: "byte",
	/**
	 * Boolean类型
	 */
	BOOLEAN: "Boolean",
	/**
	 * boolean类型
	 */
	bOOLEAN: "boolean",
	/**
	 * UFBoolean类型
	 */
	UFBOOLEAN: "UFBoolean",
	/**
	 * Date类型
	 */
	DATE: "Date",
	/**
	 * BigDecimal类型
	 */
	BIGDECIMAL: "BigDecimal",
	/**
	 * Long类型
	 */
	LONG: "Long",
	/**
	 * long类型
	 */
	lONG: "long",
	/**
	 * char类型
	 */
	CHAR: "char",
	/**
	 * Character类型
	 */
	CHARACTER:"Character",
	/**
	 * UFDateTime类型
	 */
	UFDATETIME: "UFDateTime",
	/**
	 * UFDate类型
	 */
	UFDATE: "UFDate",
	/**
	 * UFTime类型
	 */
	UFTIME: "UFTime",
	/**
	 * UFLiteralDate类型
	 */
	UFLITERALDATE: "UFLiteralDate",
	
	UFDATEBEGIN:"UFDate_begin",
	
	UFDATEEND: "UFDate_end",
	/**
	 * UFNumberFormat类型
	 */
	UFNUMBERFORMAT: "UFNumberFormat",
	/**
	 * Decimal类型
	 */
	Decimal: "Decimal",
	/**
	 * Entity类型
	 */
	Entity: "Entity"
};

/**
 * 编辑类型定义
 * @namespace
 */
Lfw.EditorType = {
	/**
	 * CheckBox类型
	 */
	CHECKBOX: "CheckBox",
	/**
	 * StringText类型
	 * @constant
	 */
	STRINGTEXT: "StringText",
	/**
	 * IntegerText类型
	 * @constant
	 */
	INTEGERTEXT: "IntegerText",
	/**
	 * DecimalText类型
	 * @constant
	 */
	DECIMALTEXT: "DecimalText",
	/**
	 * "自定义"元素类型,是form的一种element
	 * @constant
	 */
	SELFDEFELE: "SelfDef",
	/**
	 * RadioGroup类型
	 * @constant
	 */
	RADIOGROUP: "RadioGroup",
	/**
	 * CheckboxGroup类型
	 * @constant
	 */
	CHECKBOXGROUP: "CheckboxGroup",
	/**
	 * Reference类型
	 * @constant
	 */
	REFERENCE: "Reference",
	/**
	 * ComboBox类型
	 * @constant
	 */
	COMBOBOX: "ComboBox",
	/**
	 * LanguageComboBox类型
	 * @constant
	 */
	LANGUAGECOMBOBOX: "LanguageComboBox",
	/**
	 * List类型
	 * @constant
	 */
	LIST: "List",
	
	/**
	 * PwdText类型
	 * @constant
	 */
	PWDTEXT: "PwdText",
	/**
	 * DateText类型
	 * @constant
	 */
	DATETEXT: "DateText",
	/**
	 * DateTimeText类型
	 * @constant
	 */
	DATETIMETEXT: "DateTimeText",
	/**
	 * MonthText类型
	 * @constant
	 */
	MONTHTEXT: "MonthText",
	/**
	 * YearText类型
	 * @constant
	 */
	YEARTEXT: "YearText",
	/**
	 * YearMonthText类型
	 * @constant
	 */
	YEARMONTHTEXT: "YearMonthText",
	/**
	 * EmailText类型
	 * @constant
	 */
	EMAILTEXT: "EmailText",
	
	/**
	 * PhoneText类型
	 * @constant
	 */
	PHONETEXT: "PhoneText",
	
	/**
	 * LinkText类型
	 * @constant
	 */
	LINKTEXT: "LinkText",
	
	/**
	 * MoneyText类型
	 * @constant
	 */
	MONEYTEXT: "MoneyText",
	
	
	/**
	 * PrecentText类型
	 * @constant
	 */
	PERCENTTEXT: "PercentText",
	PRECENTTEXT: "PrecentText",
	
	/**
	 * TimeText类型
	 * @constant
	 */
	TIMETEXT: "TimeText",
	
	/**
	 * ShortDateTimeText类型
	 * @constant
	 */
	SHORTDATETEXT: "ShortDateText",
	
	LITERALDATE: "UFLiteralDate",
	/**
	 * TextArea类型
	 * @constant
	 */
	TEXTAREA: "TextArea",
	/**
	 * RichEditor类型
	 * @constant
	 */
	RICHEDITOR: "RichEditor",
	IMAGECOMP: "ImageComp",
	FILECOMP: "FileComp",
	SIGNCOMP: "SignComp"
};

/**
 * 控件改变时通知类型
 * @namespace
 */
Lfw.NotifyType = {
	VALUE: "value",
	VISIBLE: "visible",
	ENABLE: "enable",
	READONLY: "readOnly",
	EDITABLE: "editable",
	MAXVALUE: "maxValue",
	MINVALUE: "minValue",
	TEXT: "text",
	TEXTALIGN: "textAlign",
	WIDTH: "width",
	CHANGEIMG: "changeImg",
	CHECKED: "checked",
	COMBODATAID: "comboDataId",
	PRECISION: "precision",
	INDEX: "index",
	SHOWVALUE: "showValue",
	STATE: "state",
	SELECTED: "selected",
	FOCUS: "focus",
	ROWS: "rows",
	COLS: "cols",
	CHANGELINE: "changeLine",
	PAGESIZE: "pagesize",
	SELECTONLY: "selectOnly",
	LABELTEXT:"lableText"
};

/**
 * @namespace 屏幕ppi相关信息，单位长度对应的像素值
 */
Lfw.ScreenInfo = {
	/**
	 *1英寸宽度对应像素值 
	 * @type Number
	 * @public
	 */
	IN_X:0,
	/**
	 *1英寸高度对应像素值 
	 * @type Number
	 * @public
	 */
	IN_Y:0,
	/**
	 *1厘米宽度对应像素值 
	 * @type Number
	 * @public
	 */
	CM_X:0,
	/**
	 *1厘米高度对应像素值 
	 * @type Number
	 * @public
	 */
	CM_Y:0,
	/**
	 *1毫米宽度对应像素值 
	 * @type Number
	 * @public
	 */
	MM_X:0,
	/**
	 *1毫米高度对应像素值 
	 * @type Number
	 * @public
	 */
	MM_Y:0,
	/**
	 *1pt宽度对应像素值 
	 * @type Number
	 * @public
	 */
	PT_X:0,
	/**
	 *1pt高度对应像素值 
	 * @type Number
	 * @public
	 */
	PT_Y:0,
	/**
	 *1pc宽度对应像素值 
	 * @type Number
	 * @public
	 */
	PC_X:0,
	/**
	 *1pc高度对应像素值 
	 * @type Number
	 * @public
	 */
	PC_Y:0,
	/**
	 * 将不同单位转换成PX
	 * @public
	 */
	transPx: function(value){
		if (Lfw.isNumber(value)) return value;
	}
};

/**
 * 兼容v63
 */
// Lfw.apply(window, Lfw);

/**
 * 计算屏幕信息
 */

$(function(){
	var tmpDiv = document.createElement("DIV");
	tmpDiv.style.position = 'absolute';
	tmpDiv.style.top = "0px";
	tmpDiv.style.left = "0px";
	tmpDiv.style.visibility = 'hidden';
	document.body.appendChild(tmpDiv);
	tmpDiv.style.width = '1in';
	tmpDiv.style.height = '1in';
	Lfw.ScreenInfo.IN_X = tmpDiv.offsetWidth;
	Lfw.ScreenInfo.IN_Y = tmpDiv.offsetHeight;
	tmpDiv.style.width = '1cm';
	tmpDiv.style.height = '1cm';
	Lfw.ScreenInfo.CM_X = tmpDiv.offsetWidth;
	Lfw.ScreenInfo.CM_Y = tmpDiv.offsetHeight;
	tmpDiv.style.width = '1mm';
	tmpDiv.style.height = '1mm';
	Lfw.ScreenInfo.MM_X = tmpDiv.offsetWidth;
	Lfw.ScreenInfo.MM_Y = tmpDiv.offsetHeight;
	tmpDiv.style.width = '1pt';
	tmpDiv.style.height = '1pt';
	Lfw.ScreenInfo.PT_X = tmpDiv.offsetWidth;
	Lfw.ScreenInfo.PT_Y = tmpDiv.offsetHeight;
	tmpDiv.style.width = '1pc';
	tmpDiv.style.height = '1pc';
	Lfw.ScreenInfo.PC_X = tmpDiv.offsetWidth;
	Lfw.ScreenInfo.PC_Y = tmpDiv.offsetHeight;
//	document.body.removeChild(tmpDiv);
	$(tmpDiv).remove();
});




/**
 * @author linxq
 * 类构造器
 * 依赖于jQuery
 */

$.extend({
        dataContent:{yy:{}},
        namespace: function (nsStr,nsEle){
            var strArr = nsStr.split("."),
                reset = $.dataContent.yy,
                one,
                i = strArr[0]=="yy"?1:0,
                l = strArr.length;
            for(;i<l;i++){
                one = strArr[i]
                    if(i==(l-1)){
                        if(nsEle){
                            //添加命名空间
                            reset[one] = nsEle;
                            return reset;
                        }else{
                            //获得命名空间下的函数。
                            return reset[one];
                        }
                    }else{
                    	if(!reset)return null;
                        if(!reset[one]&&nsEle){
                            reset[one]={};
                        }
                    }
                reset = reset[one];
                
            }
            return undefined;
        },
        getUnique:(function (){
            var i = 0;
            return function (){
                return  i++;            
            };
        })(),
    getId:function (){
            return "e" + this.getUnique();
        }
});
(function ($){
var key = 0;
$.Class = function (namespace,objectFuns,staticFuns,extendClass){
	var l = arguments.length,
		//重构函数方法，使其允许3个参数与4个参数。
		extendClass = l == 4?extendClass:staticFuns,
		constructor = function (){
					  		return this.init.apply(this,arguments);
					  };
	//初始化构造器
	$.namespace(namespace,constructor);
	//继承自父类。
	if(extendClass){
		$.Class.extend(constructor,$.namespace(extendClass));
		//重构init方法，使其继承父类构造器。
		if(objectFuns.init){
			var old = objectFuns.init
			objectFuns.init = function (){
				constructor.superConstructor.call(this,arguments);
				old.apply(this,arguments);
			}
		}
	}
	//初始化静态方法
	if(l==4){
		staticFuns = staticFuns||{};
		staticFuns.getInstance = function (){
			return new constructor();
		}
		$.extend(constructor,staticFuns||{});
	}
	//初始化类方法。
	objectFuns = objectFuns||{};
	objectFuns.init = objectFuns.init||function(){};
	objectFuns.constructor = constructor;
	$.extend(constructor.prototype,objectFuns);
	return constructor;
};

/**
 * 原型继承
 * @param {Object} subClass
 * @param {Object} superClass
 */
$.Class.extend = function(subClass,superClass){
	var f = function (){},
		instance = null;
	f.prototype = superClass.prototype;
	f.prototype.constructor = subClass;
	instance = new f();
	if(instance.init){
		subClass.superConstructor = instance.init;
		delete instance.init;
	}else{
		subClass.superConstructor = superClass;
	}
	subClass.prototype = instance;
};
/**
 * 代理
 * @param {Object} namespace
 */
$.Class.proxy = function (domain,fun){
	return func.apply(domain,fun);
};
/**
 * 通过命名空间生成
 * @param {Object} ns
 * @param {Object} param
 */
$.newInstance = function (ns,param){
	return new ($.namespace(ns))(param);
};
/**
 * 通过命名空间获取类
 * @param {Object} namespace
 */
$.getClass = function (namespace){
	return $.namespace(namespace);
};
$.getKey = function (){
	return key ++;
};
var preWord = "eventspace.",
	fixWord = ".ele",
	customWord = "customEvent.";

	
$.bookEvent = function (namespace,callback){
	var events =  $.namespace(preWord+namespace),
		names = namespace.split("."),
		names = names.splice(names.length-1,1);
		
	if(events){
		var $ele = $.namespace(preWord+names.join("."));
		$.bindEvent(preWord+names.join("."),$ele);
	}else{
		$.namespace(preWord+namespace,callback);
	}
};
$.bindEvent = function (namespace,$ele){
	var ele = $.namespace(preWord+namespace+fixWord);
	if(!ele){
		$.namespace(preWord+namespace+fixWord,$ele);
	}
	var events =  $.namespace(preWord+namespace);
	if(!events)return;
	for(var key in events){
		$ele.bind(key,events[key]);
	}
};

$.customEvent = function (namespace,fun){
	if(!fun){
		var fun = $.namespace(customWord+namespace);
		if(fun&&$.isFunction(fun)){
			return fun;
		}else{
			return function (){}
		}
	}else{
		$.namespace(customWord+namespace,fun);
	}
};

})($);

$.fn.extend({
    pressEnter:function (fun){
        this.each(function (i,n){
            $(n).bind("keyup",function (event){
                var keyCode = event.keyCode,
                    state = false;
                if(keyCode == 13){
                    var newfun = $.proxy(fun,this);
                    newfun(event);
                }
                return state;
            })
        })
    },
    pressEsc:function (fun){
         this.each(function (i,n){
            $(n).bind("keyup",function (event){
                var keyCode = event.keyCode,
                    state = false;
                if(keyCode == 27){
                    var newfun = $.proxy(fun,this);
                    newfun(event);
                }
                return state;
            })
        })
    },
    dbclick:function(fun){
        var self = this;
        this.each (function (i,n){
            var dbState = false;
            var num = 0;
            $(n).bind("click",function (event){
                var s = false;
                if(!dbState){
                    dbState = true;
                    setTimeout(function (){
                        dbState = false;
                    },200);
                }else{
                    var newfun = $.proxy(fun,this);
                    newfun(event);
                }
                return s
            })
        })
    },
    ctrlEnter : function (fun){
        var self = this;
        var ctrlDown = false;
        $(this).keydown(function (event){
            var keyCode = event.keyCode;
            if(keyCode == 17){
                ctrlDown = true;
            }
            if(keyCode == 13 && ctrlDown){
                $.proxy(fun,self)(event); 
            }
        })
        $(this).keyup(function (event){
            var keyCode = event.keyCode;
            if(keyCode == 17){
                ctrlDown = false;
            }
        })
    }
});

	
