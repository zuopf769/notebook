/*
plugin: zepto.mdatertimer
author: 吕大豹
desc: 移动端日期时间选择控件
version: 1.0
*/
(function ($) {
	/*tap event*/
	!function(a){var b={},c={};c.attachEvent=function(b,c,d){return"addEventListener"in a?b.addEventListener(c,d,!1):void 0},c.fireFakeEvent=function(a,b){return document.createEvent?a.target.dispatchEvent(c.createEvent(b)):void 0},c.createEvent=function(b){if(document.createEvent){var c=a.document.createEvent("HTMLEvents");return c.initEvent(b,!0,!0),c.eventName=b,c}},c.getRealEvent=function(a){return a.originalEvent&&a.originalEvent.touches&&a.originalEvent.touches.length?a.originalEvent.touches[0]:a.touches&&a.touches.length?a.touches[0]:a};var d=[{test:("propertyIsEnumerable"in a||"hasOwnProperty"in document)&&(a.propertyIsEnumerable("ontouchstart")||document.hasOwnProperty("ontouchstart")),events:{start:"touchstart",move:"touchmove",end:"touchend"}},{test:a.navigator.msPointerEnabled,events:{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}},{test:a.navigator.pointerEnabled,events:{start:"pointerdown",move:"pointermove",end:"pointerup"}}];b.options={eventName:"tap",fingerMaxOffset:11};var e,f,g,h,i={};e=function(a){return c.attachEvent(document.body,h[a],g[a])},g={start:function(a){a=c.getRealEvent(a),i.start=[a.pageX,a.pageY],i.offset=[0,0]},move:function(a){return i.start||i.move?(a=c.getRealEvent(a),i.move=[a.pageX,a.pageY],void(i.offset=[Math.abs(i.move[0]-i.start[0]),Math.abs(i.move[1]-i.start[1])])):!1},end:function(d){if(d=c.getRealEvent(d),i.offset[0]<b.options.fingerMaxOffset&&i.offset[1]<b.options.fingerMaxOffset&&!c.fireFakeEvent(d,b.options.eventName)){if(a.navigator.msPointerEnabled||a.navigator.pointerEnabled){var e=function(a){a.preventDefault(),d.target.removeEventListener("click",e)};d.target.addEventListener("click",e,!1)}d.preventDefault()}i={}},click:function(a){return c.fireFakeEvent(a,b.options.eventName)?void 0:a.preventDefault()}},f=function(){for(var a=0;a<d.length;a++)if(d[a].test)return h=d[a].events,e("start"),e("move"),e("end"),!1;return c.attachEvent(document.body,"click",g.click)},c.attachEvent(a,"load",f),a.Tap=b}(window);
	/*iscroll*/
	(function(g,n,f){function p(a,b){this.wrapper="string"==typeof a?n.querySelector(a):a;this.scroller=this.wrapper.children[0];this.scrollerStyle=this.scroller.style;this.options={resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:!0,useTransition:!0,useTransform:!0};for(var c in b)this.options[c]=
	b[c];this.translateZ=this.options.HWCompositing&&d.hasPerspective?" translateZ(0)":"";this.options.useTransition=d.hasTransition&&this.options.useTransition;this.options.useTransform=d.hasTransform&&this.options.useTransform;this.options.eventPassthrough=!0===this.options.eventPassthrough?"vertical":this.options.eventPassthrough;this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault;this.options.scrollY="vertical"==this.options.eventPassthrough?!1:this.options.scrollY;
	this.options.scrollX="horizontal"==this.options.eventPassthrough?!1:this.options.scrollX;this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough;this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold;this.options.bounceEasing="string"==typeof this.options.bounceEasing?d.ease[this.options.bounceEasing]||d.ease.circular:this.options.bounceEasing;this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling;
	!0===this.options.tap&&(this.options.tap="tap");"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1);this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1;3==this.options.probeType&&(this.options.useTransition=!1);this.directionY=this.directionX=this.y=this.x=0;this._events={};this._init();this.refresh();this.scrollTo(this.options.startX,this.options.startY);this.enable()}function s(a,b,c){var e=n.createElement("div"),d=n.createElement("div");!0===c&&(e.style.cssText=
	"position:absolute;z-index:9999",d.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px");d.className="iScrollIndicator";"h"==a?(!0===c&&(e.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",d.style.height="100%"),e.className="iScrollHorizontalScrollbar"):(!0===c&&(e.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",d.style.width="100%"),e.className=
	"iScrollVerticalScrollbar");e.style.cssText+=";overflow:hidden";b||(e.style.pointerEvents="none");e.appendChild(d);return e}function t(a,b){this.wrapper="string"==typeof b.el?n.querySelector(b.el):b.el;this.wrapperStyle=this.wrapper.style;this.indicator=this.wrapper.children[0];this.indicatorStyle=this.indicator.style;this.scroller=a;this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0};for(var c in b)this.options[c]=b[c];
	this.sizeRatioY=this.sizeRatioX=1;this.maxPosY=this.maxPosX=0;this.options.interactive&&(this.options.disableTouch||(d.addEvent(this.indicator,"touchstart",this),d.addEvent(g,"touchend",this)),this.options.disablePointer||(d.addEvent(this.indicator,d.prefixPointerEvent("pointerdown"),this),d.addEvent(g,d.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(d.addEvent(this.indicator,"mousedown",this),d.addEvent(g,"mouseup",this)));this.options.fade&&(this.wrapperStyle[d.style.transform]=
	this.scroller.translateZ,this.wrapperStyle[d.style.transitionDuration]=d.isBadAndroid?"0.001s":"0ms",this.wrapperStyle.opacity="0")}var u=g.requestAnimationFrame||g.webkitRequestAnimationFrame||g.mozRequestAnimationFrame||g.oRequestAnimationFrame||g.msRequestAnimationFrame||function(a){g.setTimeout(a,1E3/60)},d=function(){function a(a){return!1===e?!1:""===e?a:e+a.charAt(0).toUpperCase()+a.substr(1)}var b={},c=n.createElement("div").style,e=function(){for(var a=["t","webkitT","MozT","msT","OT"],b,
	e=0,d=a.length;e<d;e++)if(b=a[e]+"ransform",b in c)return a[e].substr(0,a[e].length-1);return!1}();b.getTime=Date.now||function(){return(new Date).getTime()};b.extend=function(a,b){for(var c in b)a[c]=b[c]};b.addEvent=function(a,b,c,e){a.addEventListener(b,c,!!e)};b.removeEvent=function(a,b,c,e){a.removeEventListener(b,c,!!e)};b.prefixPointerEvent=function(a){return g.MSPointerEvent?"MSPointer"+a.charAt(9).toUpperCase()+a.substr(10):a};b.momentum=function(a,b,c,e,d,k){b=a-b;c=f.abs(b)/c;var g;k=void 0===
	k?6E-4:k;g=a+c*c/(2*k)*(0>b?-1:1);k=c/k;g<e?(g=d?e-d/2.5*(c/8):e,b=f.abs(g-a),k=b/c):0<g&&(g=d?d/2.5*(c/8):0,b=f.abs(a)+g,k=b/c);return{destination:f.round(g),duration:k}};var d=a("transform");b.extend(b,{hasTransform:!1!==d,hasPerspective:a("perspective")in c,hasTouch:"ontouchstart"in g,hasPointer:g.PointerEvent||g.MSPointerEvent,hasTransition:a("transition")in c});b.isBadAndroid=/Android /.test(g.navigator.appVersion)&&!/Chrome\/\d/.test(g.navigator.appVersion);b.extend(b.style={},{transform:d,
	transitionTimingFunction:a("transitionTimingFunction"),transitionDuration:a("transitionDuration"),transitionDelay:a("transitionDelay"),transformOrigin:a("transformOrigin")});b.hasClass=function(a,b){return(new RegExp("(^|\\s)"+b+"(\\s|$)")).test(a.className)};b.addClass=function(a,c){if(!b.hasClass(a,c)){var e=a.className.split(" ");e.push(c);a.className=e.join(" ")}};b.removeClass=function(a,c){b.hasClass(a,c)&&(a.className=a.className.replace(new RegExp("(^|\\s)"+c+"(\\s|$)","g")," "))};b.offset=
	function(a){for(var b=-a.offsetLeft,c=-a.offsetTop;a=a.offsetParent;)b-=a.offsetLeft,c-=a.offsetTop;return{left:b,top:c}};b.preventDefaultException=function(a,b){for(var c in b)if(b[c].test(a[c]))return!0;return!1};b.extend(b.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3});b.extend(b.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(a){return a*(2-
	a)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(a){return f.sqrt(1- --a*a)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(a){return(a-=1)*a*(5*a+4)+1}},bounce:{style:"",fn:function(a){return(a/=1)<1/2.75?7.5625*a*a:a<2/2.75?7.5625*(a-=1.5/2.75)*a+.75:a<2.5/2.75?7.5625*(a-=2.25/2.75)*a+.9375:7.5625*(a-=2.625/2.75)*a+.984375}},elastic:{style:"",fn:function(a){return 0===a?0:1==a?1:.4*f.pow(2,-10*a)*f.sin(2*(a-.055)*f.PI/.22)+1}}});b.tap=function(a,b){var c=n.createEvent("Event");
	c.initEvent(b,!0,!0);c.pageX=a.pageX;c.pageY=a.pageY;a.target.dispatchEvent(c)};b.click=function(a){var b=a.target,c;/(SELECT|INPUT|TEXTAREA)/i.test(b.tagName)||(c=n.createEvent("MouseEvents"),c.initMouseEvent("click",!0,!0,a.view,1,b.screenX,b.screenY,b.clientX,b.clientY,a.ctrlKey,a.altKey,a.shiftKey,a.metaKey,0,null),c._constructed=!0,b.dispatchEvent(c))};return b}();p.prototype={version:"5.1.3",_init:function(){this._initEvents();(this.options.scrollbars||this.options.indicators)&&this._initIndicators();
	this.options.mouseWheel&&this._initWheel();this.options.snap&&this._initSnap();this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0);this._execEvent("destroy")},_transitionEnd:function(a){a.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(a){if(!(1!=d.eventType[a.type]&&0!==a.button||!this.enabled||this.initiated&&d.eventType[a.type]!==
	this.initiated)){!this.options.preventDefault||d.isBadAndroid||d.preventDefaultException(a.target,this.options.preventDefaultException)||a.preventDefault();var b=a.touches?a.touches[0]:a;this.initiated=d.eventType[a.type];this.moved=!1;this.directionLocked=this.directionY=this.directionX=this.distY=this.distX=0;this._transitionTime();this.startTime=d.getTime();this.options.useTransition&&this.isInTransition?(this.isInTransition=!1,a=this.getComputedPosition(),this._translate(f.round(a.x),f.round(a.y)),
	this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd"));this.startX=this.x;this.startY=this.y;this.absStartX=this.x;this.absStartY=this.y;this.pointX=b.pageX;this.pointY=b.pageY;this._execEvent("beforeScrollStart")}},_move:function(a){if(this.enabled&&d.eventType[a.type]===this.initiated){this.options.preventDefault&&a.preventDefault();var b=a.touches?a.touches[0]:a,c=b.pageX-this.pointX,e=b.pageY-this.pointY,k=d.getTime(),h;
	this.pointX=b.pageX;this.pointY=b.pageY;this.distX+=c;this.distY+=e;b=f.abs(this.distX);h=f.abs(this.distY);if(!(300<k-this.endTime&&10>b&&10>h)){this.directionLocked||this.options.freeScroll||(this.directionLocked=b>h+this.options.directionLockThreshold?"h":h>=b+this.options.directionLockThreshold?"v":"n");if("h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)a.preventDefault();else if("horizontal"==this.options.eventPassthrough){this.initiated=!1;return}e=0}else if("v"==this.directionLocked){if("horizontal"==
	this.options.eventPassthrough)a.preventDefault();else if("vertical"==this.options.eventPassthrough){this.initiated=!1;return}c=0}c=this.hasHorizontalScroll?c:0;e=this.hasVerticalScroll?e:0;a=this.x+c;b=this.y+e;if(0<a||a<this.maxScrollX)a=this.options.bounce?this.x+c/3:0<a?0:this.maxScrollX;if(0<b||b<this.maxScrollY)b=this.options.bounce?this.y+e/3:0<b?0:this.maxScrollY;this.directionX=0<c?-1:0>c?1:0;this.directionY=0<e?-1:0>e?1:0;this.moved||this._execEvent("scrollStart");this.moved=!0;this._translate(a,
	b);300<k-this.startTime&&(this.startTime=k,this.startX=this.x,this.startY=this.y,1==this.options.probeType&&this._execEvent("scroll"));1<this.options.probeType&&this._execEvent("scroll")}}},_end:function(a){if(this.enabled&&d.eventType[a.type]===this.initiated){this.options.preventDefault&&!d.preventDefaultException(a.target,this.options.preventDefaultException)&&a.preventDefault();var b,c;c=d.getTime()-this.startTime;var e=f.round(this.x),k=f.round(this.y),h=f.abs(e-this.startX),g=f.abs(k-this.startY);
	b=0;var l="";this.initiated=this.isInTransition=0;this.endTime=d.getTime();if(!this.resetPosition(this.options.bounceTime))if(this.scrollTo(e,k),this.moved)if(this._events.flick&&200>c&&100>h&&100>g)this._execEvent("flick");else if(this.options.momentum&&300>c&&(b=this.hasHorizontalScroll?d.momentum(this.x,this.startX,c,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:e,duration:0},c=this.hasVerticalScroll?d.momentum(this.y,this.startY,c,this.maxScrollY,
	this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:k,duration:0},e=b.destination,k=c.destination,b=f.max(b.duration,c.duration),this.isInTransition=1),this.options.snap&&(this.currentPage=l=this._nearestSnap(e,k),b=this.options.snapSpeed||f.max(f.max(f.min(f.abs(e-l.x),1E3),f.min(f.abs(k-l.y),1E3)),300),e=l.x,k=l.y,this.directionY=this.directionX=0,l=this.options.bounceEasing),e!=this.x||k!=this.y){if(0<e||e<this.maxScrollX||0<k||k<this.maxScrollY)l=d.ease.quadratic;
	this.scrollTo(e,k,b,l)}else this._execEvent("scrollEnd");else this.options.tap&&d.tap(a,this.options.tap),this.options.click&&d.click(a),this._execEvent("scrollCancel")}},_resize:function(){var a=this;clearTimeout(this.resizeTimeout);this.resizeTimeout=setTimeout(function(){a.refresh()},this.options.resizePolling)},resetPosition:function(a){var b=this.x,c=this.y;!this.hasHorizontalScroll||0<this.x?b=0:this.x<this.maxScrollX&&(b=this.maxScrollX);!this.hasVerticalScroll||0<this.y?c=0:this.y<this.maxScrollY&&
	(c=this.maxScrollY);if(b==this.x&&c==this.y)return!1;this.scrollTo(b,c,a||0,this.options.bounceEasing);return!0},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapperWidth=this.wrapper.clientWidth;this.wrapperHeight=this.wrapper.clientHeight;this.scrollerWidth=this.scroller.offsetWidth;this.scrollerHeight=this.scroller.offsetHeight;this.maxScrollX=this.wrapperWidth-this.scrollerWidth;this.maxScrollY=this.wrapperHeight-this.scrollerHeight;this.hasHorizontalScroll=
	this.options.scrollX&&0>this.maxScrollX;this.hasVerticalScroll=this.options.scrollY&&0>this.maxScrollY;this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth);this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight);this.directionY=this.directionX=this.endTime=0;this.wrapperOffset=d.offset(this.wrapper);this._execEvent("refresh");this.resetPosition()},on:function(a,b){this._events[a]||(this._events[a]=[]);this._events[a].push(b)},off:function(a,
	b){if(this._events[a]){var c=this._events[a].indexOf(b);-1<c&&this._events[a].splice(c,1)}},_execEvent:function(a){if(this._events[a]){var b=0,c=this._events[a].length;if(c)for(;b<c;b++)this._events[a][b].apply(this,[].slice.call(arguments,1))}},scrollBy:function(a,b,c,e){a=this.x+a;b=this.y+b;this.scrollTo(a,b,c||0,e)},scrollTo:function(a,b,c,e){e=e||d.ease.circular;this.isInTransition=this.options.useTransition&&0<c;!c||this.options.useTransition&&e.style?(this._transitionTimingFunction(e.style),
	this._transitionTime(c),this._translate(a,b)):this._animate(a,b,c,e.fn)},scrollToElement:function(a,b,c,e,k){if(a=a.nodeType?a:this.scroller.querySelector(a)){var h=d.offset(a);h.left-=this.wrapperOffset.left;h.top-=this.wrapperOffset.top;!0===c&&(c=f.round(a.offsetWidth/2-this.wrapper.offsetWidth/2));!0===e&&(e=f.round(a.offsetHeight/2-this.wrapper.offsetHeight/2));h.left-=c||0;h.top-=e||0;h.left=0<h.left?0:h.left<this.maxScrollX?this.maxScrollX:h.left;h.top=0<h.top?0:h.top<this.maxScrollY?this.maxScrollY:
	h.top;b=void 0===b||null===b||"auto"===b?f.max(f.abs(this.x-h.left),f.abs(this.y-h.top)):b;this.scrollTo(h.left,h.top,b,k)}},_transitionTime:function(a){a=a||0;this.scrollerStyle[d.style.transitionDuration]=a+"ms";!a&&d.isBadAndroid&&(this.scrollerStyle[d.style.transitionDuration]="0.001s");if(this.indicators)for(var b=this.indicators.length;b--;)this.indicators[b].transitionTime(a)},_transitionTimingFunction:function(a){this.scrollerStyle[d.style.transitionTimingFunction]=a;if(this.indicators)for(var b=
	this.indicators.length;b--;)this.indicators[b].transitionTimingFunction(a)},_translate:function(a,b){this.options.useTransform?this.scrollerStyle[d.style.transform]="translate("+a+"px,"+b+"px)"+this.translateZ:(a=f.round(a),b=f.round(b),this.scrollerStyle.left=a+"px",this.scrollerStyle.top=b+"px");this.x=a;this.y=b;if(this.indicators)for(var c=this.indicators.length;c--;)this.indicators[c].updatePosition()},_initEvents:function(a){a=a?d.removeEvent:d.addEvent;var b=this.options.bindToWrapper?this.wrapper:
	g;a(g,"orientationchange",this);a(g,"resize",this);this.options.click&&a(this.wrapper,"click",this,!0);this.options.disableMouse||(a(this.wrapper,"mousedown",this),a(b,"mousemove",this),a(b,"mousecancel",this),a(b,"mouseup",this));d.hasPointer&&!this.options.disablePointer&&(a(this.wrapper,d.prefixPointerEvent("pointerdown"),this),a(b,d.prefixPointerEvent("pointermove"),this),a(b,d.prefixPointerEvent("pointercancel"),this),a(b,d.prefixPointerEvent("pointerup"),this));d.hasTouch&&!this.options.disableTouch&&
	(a(this.wrapper,"touchstart",this),a(b,"touchmove",this),a(b,"touchcancel",this),a(b,"touchend",this));a(this.scroller,"transitionend",this);a(this.scroller,"webkitTransitionEnd",this);a(this.scroller,"oTransitionEnd",this);a(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var a=g.getComputedStyle(this.scroller,null),b;this.options.useTransform?(a=a[d.style.transform].split(")")[0].split(", "),b=+(a[12]||a[4]),a=+(a[13]||a[5])):(b=+a.left.replace(/[^-\d.]/g,""),a=+a.top.replace(/[^-\d.]/g,
	""));return{x:b,y:a}},_initIndicators:function(){function a(a){for(var b=f.indicators.length;b--;)a.call(f.indicators[b])}var b=this.options.interactiveScrollbars,c="string"!=typeof this.options.scrollbars,e=[],d,f=this;this.indicators=[];this.options.scrollbars&&(this.options.scrollY&&(d={el:s("v",b,this.options.scrollbars),interactive:b,defaultScrollbars:!0,customStyle:c,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(d.el),
	e.push(d)),this.options.scrollX&&(d={el:s("h",b,this.options.scrollbars),interactive:b,defaultScrollbars:!0,customStyle:c,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(d.el),e.push(d)));this.options.indicators&&(e=e.concat(this.options.indicators));for(b=e.length;b--;)this.indicators.push(new t(this,e[b]));this.options.fadeScrollbars&&(this.on("scrollEnd",function(){a(function(){this.fade()})}),this.on("scrollCancel",
	function(){a(function(){this.fade()})}),this.on("scrollStart",function(){a(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){a(function(){this.fade(1,!0)})}));this.on("refresh",function(){a(function(){this.refresh()})});this.on("destroy",function(){a(function(){this.destroy()});delete this.indicators})},_initWheel:function(){d.addEvent(this.wrapper,"wheel",this);d.addEvent(this.wrapper,"mousewheel",this);d.addEvent(this.wrapper,"DOMMouseScroll",this);this.on("destroy",function(){d.removeEvent(this.wrapper,
	"wheel",this);d.removeEvent(this.wrapper,"mousewheel",this);d.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(a){if(this.enabled){a.preventDefault();a.stopPropagation();var b,c,e,d=this;void 0===this.wheelTimeout&&d._execEvent("scrollStart");clearTimeout(this.wheelTimeout);this.wheelTimeout=setTimeout(function(){d._execEvent("scrollEnd");d.wheelTimeout=void 0},400);if("deltaX"in a)1===a.deltaMode?(b=-a.deltaX*this.options.mouseWheelSpeed,a=-a.deltaY*this.options.mouseWheelSpeed):
	(b=-a.deltaX,a=-a.deltaY);else if("wheelDeltaX"in a)b=a.wheelDeltaX/120*this.options.mouseWheelSpeed,a=a.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in a)b=a=a.wheelDelta/120*this.options.mouseWheelSpeed;else if("detail"in a)b=a=-a.detail/3*this.options.mouseWheelSpeed;else return;b*=this.options.invertWheelDirection;a*=this.options.invertWheelDirection;this.hasVerticalScroll||(b=a,a=0);this.options.snap?(c=this.currentPage.pageX,e=this.currentPage.pageY,0<b?c--:0>b&&c++,0<a?
	e--:0>a&&e++,this.goToPage(c,e)):(c=this.x+f.round(this.hasHorizontalScroll?b:0),e=this.y+f.round(this.hasVerticalScroll?a:0),0<c?c=0:c<this.maxScrollX&&(c=this.maxScrollX),0<e?e=0:e<this.maxScrollY&&(e=this.maxScrollY),this.scrollTo(c,e,0),1<this.options.probeType&&this._execEvent("scroll"))}},_initSnap:function(){this.currentPage={};"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap));this.on("refresh",function(){var a=0,b,c=0,e,d,h,g=0,l;e=this.options.snapStepX||
	this.wrapperWidth;var m=this.options.snapStepY||this.wrapperHeight;this.pages=[];if(this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(!0===this.options.snap)for(d=f.round(e/2),h=f.round(m/2);g>-this.scrollerWidth;){this.pages[a]=[];for(l=b=0;l>-this.scrollerHeight;)this.pages[a][b]={x:f.max(g,this.maxScrollX),y:f.max(l,this.maxScrollY),width:e,height:m,cx:g-d,cy:l-h},l-=m,b++;g-=e;a++}else for(m=this.options.snap,b=m.length,e=-1;a<b;a++){if(0===a||m[a].offsetLeft<=
	m[a-1].offsetLeft)c=0,e++;this.pages[c]||(this.pages[c]=[]);g=f.max(-m[a].offsetLeft,this.maxScrollX);l=f.max(-m[a].offsetTop,this.maxScrollY);d=g-f.round(m[a].offsetWidth/2);h=l-f.round(m[a].offsetHeight/2);this.pages[c][e]={x:g,y:l,width:m[a].offsetWidth,height:m[a].offsetHeight,cx:d,cy:h};g>this.maxScrollX&&c++}this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0);0===this.options.snapThreshold%1?this.snapThresholdY=this.snapThresholdX=this.options.snapThreshold:(this.snapThresholdX=
	f.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=f.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}});this.on("flick",function(){var a=this.options.snapSpeed||f.max(f.max(f.min(f.abs(this.x-this.startX),1E3),f.min(f.abs(this.y-this.startY),1E3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,a)})},_nearestSnap:function(a,b){if(!this.pages.length)return{x:0,
	y:0,pageX:0,pageY:0};var c=0,e=this.pages.length,d=0;if(f.abs(a-this.absStartX)<this.snapThresholdX&&f.abs(b-this.absStartY)<this.snapThresholdY)return this.currentPage;0<a?a=0:a<this.maxScrollX&&(a=this.maxScrollX);0<b?b=0:b<this.maxScrollY&&(b=this.maxScrollY);for(;c<e;c++)if(a>=this.pages[c][0].cx){a=this.pages[c][0].x;break}for(e=this.pages[c].length;d<e;d++)if(b>=this.pages[0][d].cy){b=this.pages[0][d].y;break}c==this.currentPage.pageX&&(c+=this.directionX,0>c?c=0:c>=this.pages.length&&(c=this.pages.length-
	1),a=this.pages[c][0].x);d==this.currentPage.pageY&&(d+=this.directionY,0>d?d=0:d>=this.pages[0].length&&(d=this.pages[0].length-1),b=this.pages[0][d].y);return{x:a,y:b,pageX:c,pageY:d}},goToPage:function(a,b,c,d){d=d||this.options.bounceEasing;a>=this.pages.length?a=this.pages.length-1:0>a&&(a=0);b>=this.pages[a].length?b=this.pages[a].length-1:0>b&&(b=0);var g=this.pages[a][b].x,h=this.pages[a][b].y;c=void 0===c?this.options.snapSpeed||f.max(f.max(f.min(f.abs(g-this.x),1E3),f.min(f.abs(h-this.y),
	1E3)),300):c;this.currentPage={x:g,y:h,pageX:a,pageY:b};this.scrollTo(g,h,c,d)},next:function(a,b){var c=this.currentPage.pageX,d=this.currentPage.pageY;c++;c>=this.pages.length&&this.hasVerticalScroll&&(c=0,d++);this.goToPage(c,d,a,b)},prev:function(a,b){var c=this.currentPage.pageX,d=this.currentPage.pageY;c--;0>c&&this.hasVerticalScroll&&(c=0,d--);this.goToPage(c,d,a,b)},_initKeys:function(a){a={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};var b;if("object"==typeof this.options.keyBindings)for(b in this.options.keyBindings)"string"==
	typeof this.options.keyBindings[b]&&(this.options.keyBindings[b]=this.options.keyBindings[b].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(b in a)this.options.keyBindings[b]=this.options.keyBindings[b]||a[b];d.addEvent(g,"keydown",this);this.on("destroy",function(){d.removeEvent(g,"keydown",this)})},_key:function(a){if(this.enabled){var b=this.options.snap,c=b?this.currentPage.pageX:this.x,e=b?this.currentPage.pageY:this.y,g=d.getTime(),h=this.keyTime||0,n;this.options.useTransition&&
	this.isInTransition&&(n=this.getComputedPosition(),this._translate(f.round(n.x),f.round(n.y)),this.isInTransition=!1);this.keyAcceleration=200>g-h?f.min(this.keyAcceleration+.25,50):0;switch(a.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?c+=b?1:this.wrapperWidth:e+=b?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?c-=b?1:this.wrapperWidth:e-=b?1:this.wrapperHeight;break;case this.options.keyBindings.end:c=
	b?this.pages.length-1:this.maxScrollX;e=b?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:e=c=0;break;case this.options.keyBindings.left:c+=b?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:e+=b?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:c-=b?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:e-=b?1:5+this.keyAcceleration>>0;break;default:return}b?this.goToPage(c,e):(0<c?this.keyAcceleration=c=0:c<this.maxScrollX&&
	(c=this.maxScrollX,this.keyAcceleration=0),0<e?this.keyAcceleration=e=0:e<this.maxScrollY&&(e=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(c,e,0),this.keyTime=g)}},_animate:function(a,b,c,e){function f(){var q=d.getTime(),r;q>=p?(g.isAnimating=!1,g._translate(a,b),g.resetPosition(g.options.bounceTime)||g._execEvent("scrollEnd")):(q=(q-m)/c,r=e(q),q=(a-n)*r+n,r=(b-l)*r+l,g._translate(q,r),g.isAnimating&&u(f),3==g.options.probeType&&g._execEvent("scroll"))}var g=this,n=this.x,l=this.y,m=d.getTime(),
	p=m+c;this.isAnimating=!0;f()},handleEvent:function(a){switch(a.type){case "touchstart":case "pointerdown":case "MSPointerDown":case "mousedown":this._start(a);break;case "touchmove":case "pointermove":case "MSPointerMove":case "mousemove":this._move(a);break;case "touchend":case "pointerup":case "MSPointerUp":case "mouseup":case "touchcancel":case "pointercancel":case "MSPointerCancel":case "mousecancel":this._end(a);break;case "orientationchange":case "resize":this._resize();break;case "transitionend":case "webkitTransitionEnd":case "oTransitionEnd":case "MSTransitionEnd":this._transitionEnd(a);
	break;case "wheel":case "DOMMouseScroll":case "mousewheel":this._wheel(a);break;case "keydown":this._key(a);break;case "click":a._constructed||(a.preventDefault(),a.stopPropagation())}}};t.prototype={handleEvent:function(a){switch(a.type){case "touchstart":case "pointerdown":case "MSPointerDown":case "mousedown":this._start(a);break;case "touchmove":case "pointermove":case "MSPointerMove":case "mousemove":this._move(a);break;case "touchend":case "pointerup":case "MSPointerUp":case "mouseup":case "touchcancel":case "pointercancel":case "MSPointerCancel":case "mousecancel":this._end(a)}},
	destroy:function(){this.options.interactive&&(d.removeEvent(this.indicator,"touchstart",this),d.removeEvent(this.indicator,d.prefixPointerEvent("pointerdown"),this),d.removeEvent(this.indicator,"mousedown",this),d.removeEvent(g,"touchmove",this),d.removeEvent(g,d.prefixPointerEvent("pointermove"),this),d.removeEvent(g,"mousemove",this),d.removeEvent(g,"touchend",this),d.removeEvent(g,d.prefixPointerEvent("pointerup"),this),d.removeEvent(g,"mouseup",this));this.options.defaultScrollbars&&this.wrapper.parentNode.removeChild(this.wrapper)},
	_start:function(a){var b=a.touches?a.touches[0]:a;a.preventDefault();a.stopPropagation();this.transitionTime();this.initiated=!0;this.moved=!1;this.lastPointX=b.pageX;this.lastPointY=b.pageY;this.startTime=d.getTime();this.options.disableTouch||d.addEvent(g,"touchmove",this);this.options.disablePointer||d.addEvent(g,d.prefixPointerEvent("pointermove"),this);this.options.disableMouse||d.addEvent(g,"mousemove",this);this.scroller._execEvent("beforeScrollStart")},_move:function(a){var b=a.touches?a.touches[0]:
	a,c,e,f=d.getTime();this.moved||this.scroller._execEvent("scrollStart");this.moved=!0;c=b.pageX-this.lastPointX;this.lastPointX=b.pageX;e=b.pageY-this.lastPointY;this.lastPointY=b.pageY;this._pos(this.x+c,this.y+e);1==this.scroller.options.probeType&&300<f-this.startTime?(this.startTime=f,this.scroller._execEvent("scroll")):1<this.scroller.options.probeType&&this.scroller._execEvent("scroll");a.preventDefault();a.stopPropagation()},_end:function(a){if(this.initiated){this.initiated=!1;a.preventDefault();
	a.stopPropagation();d.removeEvent(g,"touchmove",this);d.removeEvent(g,d.prefixPointerEvent("pointermove"),this);d.removeEvent(g,"mousemove",this);if(this.scroller.options.snap){a=this.scroller._nearestSnap(this.scroller.x,this.scroller.y);var b=this.options.snapSpeed||f.max(f.max(f.min(f.abs(this.scroller.x-a.x),1E3),f.min(f.abs(this.scroller.y-a.y),1E3)),300);if(this.scroller.x!=a.x||this.scroller.y!=a.y)this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=a,this.scroller.scrollTo(a.x,
	a.y,b,this.scroller.options.bounceEasing)}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(a){a=a||0;this.indicatorStyle[d.style.transitionDuration]=a+"ms";!a&&d.isBadAndroid&&(this.indicatorStyle[d.style.transitionDuration]="0.001s")},transitionTimingFunction:function(a){this.indicatorStyle[d.style.transitionTimingFunction]=a},refresh:function(){this.transitionTime();this.indicatorStyle.display=this.options.listenX&&!this.options.listenY?this.scroller.hasHorizontalScroll?
	"block":"none":this.options.listenY&&!this.options.listenX?this.scroller.hasVerticalScroll?"block":"none":this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none";this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(d.addClass(this.wrapper,"iScrollBothScrollbars"),d.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):
	(d.removeClass(this.wrapper,"iScrollBothScrollbars"),d.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=f.max(f.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+
	"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=-this.indicatorWidth+8,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX);this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=f.max(f.round(this.wrapperHeight*
	this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=-this.indicatorHeight+8,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&
	this.maxPosY/this.scroller.maxScrollY);this.updatePosition()},updatePosition:function(){var a=this.options.listenX&&f.round(this.sizeRatioX*this.scroller.x)||0,b=this.options.listenY&&f.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(a<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=f.max(this.indicatorWidth+a,8),this.indicatorStyle.width=this.width+"px"),a=this.minBoundaryX):a>this.maxBoundaryX?"scale"==this.options.shrink?(this.width=f.max(this.indicatorWidth-
	(a-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",a=this.maxPosX+this.indicatorWidth-this.width):a=this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),b<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=f.max(this.indicatorHeight+3*b,8),this.indicatorStyle.height=this.height+"px"),b=this.minBoundaryY):b>this.maxBoundaryY?"scale"==this.options.shrink?(this.height=f.max(this.indicatorHeight-
	3*(b-this.maxPosY),8),this.indicatorStyle.height=this.height+"px",b=this.maxPosY+this.indicatorHeight-this.height):b=this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px"));this.x=a;this.y=b;this.scroller.options.useTransform?this.indicatorStyle[d.style.transform]="translate("+a+"px,"+b+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=a+"px",this.indicatorStyle.top=b+"px")},_pos:function(a,
	b){0>a?a=0:a>this.maxPosX&&(a=this.maxPosX);0>b?b=0:b>this.maxPosY&&(b=this.maxPosY);a=this.options.listenX?f.round(a/this.sizeRatioX):this.scroller.x;b=this.options.listenY?f.round(b/this.sizeRatioY):this.scroller.y;this.scroller.scrollTo(a,b)},fade:function(a,b){if(!b||this.visible){clearTimeout(this.fadeTimeout);this.fadeTimeout=null;var c=a?250:500,e=a?0:300;this.wrapperStyle[d.style.transitionDuration]=c+"ms";this.fadeTimeout=setTimeout(function(a){this.wrapperStyle.opacity=a;this.visible=+a}.bind(this,
	a?"1":"0"),e)}}};p.utils=d;"undefined"!=typeof module&&module.exports?module.exports=p:g.IScroll=p})(window,document,Math);

    $.fn.mdatetimer = function(opts){
		var defaults = {
			mode : 1, //时间选择器模式：1：年月日，2：年月日时分（24小时），3：年月日时分（12小时），4：年月日时分秒
			format : 2, //时间格式化方式：1：2015年06月10日 17时30分46秒，2：2015-05-10  17:30:46
			years : [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017], //年份，数组或字符串'2000~2015'
			nowbtn : true,
			onOk : null,
			onCancel : null,
		};
		var option = $.extend(defaults, opts);

		//通用函数
		var F = {
			//计算某年某月有多少天
			getDaysInMonth : function(year, month){
			    return new Date(year, month+1, 0).getDate();
			},
			getMonth : function(m){
				return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
			},
			//计算年某月的最后一天日期
			getLastDayInMonth : function(year, month){
				return new Date(year, month, this.getDaysInMonth(year, month));
			},
			//小于10的数字前加0
			preZero : function(num){
				num = parseInt(num);
				if(num<10){
					return '0'+num;
				}
				else{
					return num;
				}
			},
			formatDate : function(year, month, day, hour, minute, second){
				month = F.preZero(month+1);
				day = F.preZero(day);
				hour = F.preZero(hour);
				minute = F.preZero(minute);
				if(option.mode!=3){
					second = F.preZero(second);
				}
				else{
					//可能点“现在”取时间，需根据时间判断上下午
					if(second == 'am'){
						second = '上午';
					}
					else if(second == 'pm'){
						second = '下午';
					}
					else{
						//传入的是秒数
						if(hour<12){
							second = '上午';
						}
						else{
							second = '下午';
						}
					}
					
				}
				
				var result = '';
				if(option.format==1){
					result += year+'年'+month+'月'+day+'日';
					if(option.mode!=1 && hour){
						result += ' '+hour+'时'+minute+'分';
						if(option.mode!=2){
							if(!isNaN(parseInt(second))){
								result += second+'秒';
							}
							else{
								result += ' '+second;
							}
						}
					}
				}
				else{
					result += year+'-'+month+'-'+day;
					if(option.mode!=1 && hour){
						result += ' '+hour+':'+minute+'';
						if(option.mode!=2){
							if(!isNaN(parseInt(second))){
								result += ':'+second+'';
							}
							else{
								result += ' '+second;
							}
						}
					}
				}
				return result;
			},
			getDateValue : function(value){
				if(option.format==2){
					return new Date(value);
				}
				else{
					var array = value.replace(/\D ?/g,',').slice(0,-1).split(',');
					if(array.length==7){
						//带有“上午、下午”
						if(value.indexOf('上午')>=0){
							return new Date(array[0], array[1]-1, array[2], array[3], array[4]);
						}
						else{
							return new Date(array[0], array[1]-1, array[2], parseInt(array[3])+12, array[4]);
						}
						
					}
					else{
						return new Date(array[0], array[1]-1, array[2], array[3], array[4], array[5]);
					}
				}
			}
		}

		//滑动配置项
		var scrollConf = {
			snap : 'li',
			snapSpeed: 600,
			probeType : 1,
			tap : true
		};

		var input = $(this),
			itemHeight = 40;
		var picker = {
			init : function(){
				var _this = this;

				_this.renderHTML();
				var container = $('.mt_poppanel'),
					mpYear = $('.mt_year', container),
					mpMonth = $('.mt_month', container),
					mpDay = $('.mt_day', container),
					mpHour = $('.mt_hour', container),
					mpMinute = $('.mt_minute', container),
					mpSecond = $('.mt_second', container);
				//初始化year
				
				var defaultDate = input.val()!='' ? F.getDateValue(input.val()) : new Date(),
					dYear = defaultDate.getFullYear(),
					dMonth = defaultDate.getMonth(),
					dDate = defaultDate.getDate(),
					dHour = defaultDate.getHours(),
					dMinute = defaultDate.getMinutes(),
					dSecond = defaultDate.getSeconds();

				var yearStr = '';
				for(var i=0; i<option.years.length; i++){
					var y = option.years[i];
					var sel = y==dYear ? 'selected' : '';
					yearStr += '<li class="'+sel+'" data-year="'+y+'">'+y+'年</li>';
				}
				yearStr += '<li></li><li></li>';
				mpYear.find('ul').append(yearStr);

				//初始化month
				var monthStr = '';
				for(var j=1; j<=12; j++){
					var sel = j==dMonth ? 'selected' : '';
					monthStr += '<li class="'+sel+'" data-month="'+(j-1)+'">'+F.preZero(j)+'月</li>';
				}
				monthStr += '<li></li><li></li>';
				mpMonth.find('ul').append(monthStr);

				//初始化day
				var dayStr = '';
				var defaultDays = F.getDaysInMonth(dYear, dMonth);
				for(var k=1; k<=defaultDays; k++){
					var sel = k==dDate ? 'selected' : '';
					dayStr += '<li class="'+sel+'" data-day="'+k+'">'+F.preZero(k)+'日</li>';
				}
				dayStr += '<li></li><li></li>';
				mpDay.find('ul').append(dayStr);

				if(option.mode==1){
					//把不该显示的删除掉
					$('.mt_body', container).css('height', 200);
					$('.mt_year, .mt_month, .mt_day', container).css('height', '100%');
					$('.mt_sepline, .mt_hour, .mt_minute, .mt_second, .mt_indicate.cate2', container).remove();
				}
				if(!option.nowbtn){
					$('.mt_setnow', container).remove();
					$('.mt_cancel, .mt_ok', container).css('float', 'none');
					$('.mt_cancel', container).css('border-right', '1px solid #4eccc4');
				}

				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
				//初始化scroll
				var elHeight = itemHeight;

				var yearScroll = new IScroll('.mt_year', scrollConf);
				yearScroll.on('scroll', function(){
					_this.updateSelected(mpYear, this);
				});
				yearScroll.on('scrollEnd', function(){
					_this.updateSelected(mpYear, this);
					_this.updateDay(mpYear, mpMonth, mpDay);
				});

				var monthScroll = new IScroll('.mt_month', scrollConf);
				monthScroll.on('scroll', function(){
					_this.updateSelected(mpMonth, this);
					
				});
				monthScroll.on('scrollEnd', function(){
					_this.updateSelected(mpMonth, this);
					_this.updateDay(mpYear, mpMonth, mpDay);
				});

				var dayScroll = new IScroll('.mt_day', scrollConf);
				dayScroll.on('scroll', function(){
					_this.updateSelected(mpDay, this);
				});
				dayScroll.on('scrollEnd', function(){
					_this.updateSelected(mpDay, this);
				});

				this.yearScroll = yearScroll;
				this.monthScroll = monthScroll;
				this.dayScroll = dayScroll;

				//初始化时分秒

				//初始化hour
				if(option.mode != 1){
					var hourStr = '';
					var hourcount = option.mode == 3 ? 12 : 24;
					for(var l=1; l<=hourcount; l++){
						var sel = l==dHour ? 'selected' : '';
						hourStr += '<li class="'+sel+'" data-hour="'+l+'">'+F.preZero(l)+'时</li>';
					}
					hourStr += '<li></li><li></li>';
					mpHour.find('ul').append(hourStr);

					var hourScroll = new IScroll('.mt_hour', scrollConf);
					hourScroll.on('scroll', function(){
						_this.updateSelected(mpHour, this);
					});
					hourScroll.on('scrollEnd', function(){
						_this.updateSelected(mpHour, this);
					});
					this.hourScroll = hourScroll;

					//初始化minute
					var minuteStr = '';
					for(var m=0; m<=60; m++){
						var sel = m==dMinute ? 'selected' : '';
						minuteStr += '<li class="'+sel+'" data-minute="'+m+'">'+F.preZero(m)+'分</li>';
					}
					minuteStr += '<li></li><li></li>';
					mpMinute.find('ul').append(minuteStr);

					var minuteScroll = new IScroll('.mt_minute', scrollConf);
					minuteScroll.on('scroll', function(){
						_this.updateSelected(mpMinute, this);
					});
					minuteScroll.on('scrollEnd', function(){
						_this.updateSelected(mpMinute, this);
					});
					this.minuteScroll = minuteScroll;

					//初始化second
					var secondStr = '';
					if(option.mode==4){
						for(var n=0; n<=60; n++){
							var sel = n==dSecond ? 'selected' : '';
							secondStr += '<li class="'+sel+'" data-second="'+n+'">'+F.preZero(n)+'秒</li>';
						}
					}
					else if(option.mode==3){
						var sel1 = dHour<=12 ? 'selected' : '';
						var sel2 = dHour>=12 ? 'selected' : '';
						secondStr += '<li class="'+sel1+'" data-second="am">上午</li><li class="'+sel2+'" data-second="pm">下午</li>';
					}
					
					secondStr += '<li></li><li></li>';
					mpSecond.find('ul').append(secondStr);

					var secondScroll = new IScroll('.mt_second', scrollConf);
					secondScroll.on('scroll', function(){
						_this.updateSelected(mpSecond, this);
					});
					secondScroll.on('scrollEnd', function(){
						_this.updateSelected(mpSecond, this);
					});
					this.secondScroll = secondScroll;

					if(option.mode==2 || option.mode==3){
						$('.mt_second .mt_note').html('&nbsp;');
					}
				}

				//初始化点击input事件
				input.on('tap', function(){
					if(container.hasClass('show')){
						_this.hidePanel();
					}
					else{
						_this.showPanel();
						var year = mpYear.find('.selected').data('year');
						var month = mpMonth.find('.selected').data('month');
						var day = mpDay.find('.selected').data('day');
						var hour = mpHour.find('.selected').data('hour');
						var minute = mpMinute.find('.selected').data('minute');
						var second = mpSecond.find('.selected').data('second');
						_this.setValue(year, month, day, hour, minute, second);
					}
				});

				//初始化点击li
				mpYear.on('tap', 'li', function(){
					_this.checkYear($(this));
				});
				mpMonth.on('tap', 'li', function(){
					_this.checkMonth($(this));
				});
				mpDay.on('tap', 'li', function(){
					_this.checkDay($(this));
				});
				if(option.mode != 1){
					mpHour.on('tap', 'li', function(){
						_this.checkHour($(this));
					});
					mpMinute.on('tap', 'li', function(){
						_this.checkMinute($(this));
					});
					mpSecond.on('tap', 'li', function(){
						_this.checkSecond($(this));
					});
				}
				

				//初始化点击事件
				$('.mt_ok', container).on('tap', function(){
					var year = mpYear.find('.selected').data('year');
					var month = mpMonth.find('.selected').data('month');
					var day = mpDay.find('.selected').data('day');
					var hour = mpHour.find('.selected').data('hour');
					var minute = mpMinute.find('.selected').data('minute');
					var second = mpSecond.find('.selected').data('second');
					input.val(F.formatDate(year, month, day, hour, minute, second));
					_this.hidePanel();
					option.onOk && typeof option.onOk=='function' && option.onOk(container);
				});
				$('.mt_cancel', container).on('tap', function(){
					_this.hidePanel();
					option.onCancel && typeof option.onCancel=='function' && option.onCancel(container);
				});
				$('.mt_setnow', container).on('tap', function(){
					var n = new Date();
					input.val(F.formatDate(n.getFullYear(), n.getMonth(), n.getDate(), n.getHours(), n.getMinutes(), n.getSeconds()));
					_this.hidePanel();
				});
				
				$('.mt_mask').on('tap', function(){
					_this.hidePanel();
				});


				//初始化原有的数据
				this.setValue(dYear, dMonth, dDate, dHour, dMinute, dSecond);
			},
			renderHTML : function(){
				var stime = option.timeStart + ':00';
				var etime = option.timeStart + option.timeNum + ':00';
				var html = '<div class="mt_mask"></div><div id="mdatetimer" class="mt_poppanel"><div class="mt_panel"><h3 class="mt_title">请选择时间</h3><div class="mt_body"><div class="mt_year"><ul><li class="mt_note">选择年份</li><li></li></ul></div><div class="mt_month"><ul><li class="mt_note">选择月份</li><li></li></ul></div><div class="mt_day"><ul><li class="mt_note">选择日期</li><li></li></ul></div><div class="mt_sepline"></div><div class="mt_hour"><ul><li class="mt_note">选择时</li><li></li></ul></div><div class="mt_minute"><ul><li class="mt_note">选择分</li><li></li></ul></div><div class="mt_second"><ul><li class="mt_note">选择秒</li><li></li></ul></div><div class="mt_indicate"></div><div class="mt_indicate cate2"></div></div><div class="mt_confirm"><a href="javascript:void(0);" class="mt_ok">确定</a><a href="javascript:void(0);" class="mt_setnow">现在</a><a href="javascript:void(0);" class="mt_cancel">取消</a></div></div></div>';
				$(document.body).append(html);
			},
			updateSelected : function(container, iscroll){
				var index = (-iscroll.y) / itemHeight + 2;
				var current = container.find('li').eq(index);
				current.addClass('selected').siblings().removeClass('selected');
			},
			showPanel : function(container){
				$('.mt_poppanel, .mt_mask').addClass('show');
			},
			hidePanel : function(){
				$('.mt_poppanel, .mt_mask').removeClass('show');
			},
			setValue : function(y, m, d, h, min, s){
				var yearItem = $('.mt_year li[data-year="'+y+'"]'),
					monthItem = $('.mt_month li[data-month="'+m+'"]'),
					dayItem = $('.mt_day li[data-day="'+d+'"]'),
					hourItem = $('.mt_hour li[data-hour="'+h+'"]'),
					minuteItem = $('.mt_minute li[data-minute="'+min+'"]'),
					secondItem = $('.mt_second li[data-second="'+s+'"]');
				if(option.mode==3){
					if(h-12>0){
						s = 'pm';
						hourItem = $('.mt_hour li[data-hour="'+(h-12)+'"]');
					}
					else{
						s = 'am';
					}
					secondItem = $('.mt_second li[data-second="'+s+'"]');
				}
				this.checkYear(yearItem);
				this.checkMonth(monthItem);
				this.checkDay(dayItem);
				if(option.mode!=1){
					this.checkHour(hourItem);
					this.checkMinute(minuteItem);
					this.checkSecond(secondItem);	
				}
				
			},
			//滚动的时候动态调节日期，用于计算闰年的日期数
			updateDay : function(mpYear, mpMonth, mpDay){
				var _this = this;
				
				var checkedYear = mpYear.find('li.selected').data('year');
				var checkedMonth = mpMonth.find('li.selected').data('month');
				var checkedDay = mpDay.find('li.selected').data('day');
				var days = F.getDaysInMonth(checkedYear, checkedMonth);
				var dayStr = '<li class="mt_note">选择日期</li><li></li>';
				for(var k=1; k<=days; k++){
					var sel = k==checkedDay ? 'selected' : '';
					dayStr += '<li class="'+sel+'" data-day="'+k+'">'+F.preZero(k)+'日</li>';
				}
				dayStr += '<li></li><li></li>';
				mpDay.find('ul').html(dayStr);

				//内容改变后，iscroll的滚动会发生错误，所以在此将日期scorll重新初始化一遍
				this.dayScroll.destroy();
				this.dayScroll = new IScroll('.mt_day', scrollConf);
				this.dayScroll.on('scroll', function(){
					_this.updateSelected(mpDay, this);
				});
				this.dayScroll.on('scrollEnd', function(){
					_this.updateSelected(mpDay, this);
				});

				//然后给day重新选择
				setTimeout(function(){
					var dayEl = mpDay.find('li[data-day="'+checkedDay+'"]');
					if(dayEl.length>0){
						_this.checkDay(dayEl);
					}
				},10);
				
			},
			checkYear : function(el){
				if(el.text()=='')return;
				var target = el.prev('li').prev('li');
				this.yearScroll.scrollToElement(target[0]);
			},
			checkMonth : function(el){
				if(el.text()=='')return;
				var target = el.prev('li').prev('li');
				this.monthScroll.scrollToElement(target[0]);
			},
			checkDay : function(el){
				if(el.text()=='')return;
				var target = el.prev('li').prev('li');
				this.dayScroll.scrollToElement(target[0]);
			},
			checkHour : function(el){
				if(el.text()=='')return;
				var target = el.prev('li').prev('li');
				this.hourScroll.scrollToElement(target[0]);
			},
			checkMinute : function(el){
				if(el.text()=='')return;
				var target = el.prev('li').prev('li');
				this.minuteScroll.scrollToElement(target[0]);
			},
			checkSecond : function(el){
				if(el.text()=='')return;
				if(option.mode<3)return;
				var target = el.prev('li').prev('li');
				this.secondScroll.scrollToElement(target[0]);
			}
		}
		picker.init();
		return picker;
	}
	return $.fn.mdatetimer;
})(Zepto);
