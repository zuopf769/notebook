$(document).ready(function(){
	// alert("hello!");
	var sub=$('#sub');
	// console.log(sub);
	var activeRow;
	var activeMenu;
	var timer;
	var mouseInSub = false;
	sub.on("mouseenter",function(e){
		mouseInSub = true;
	}).on('mouseleave',function(e){
		mouseInSub = false;
	})

	var mouseTrack = []
	var moveHanlder=function(e){
        mouseTrack.push({
        	x: e.pageX,
        	y: e.pageY
        })

        if(mouseTrack.length>3){
        	mouseTrack.shift()
        }
	}


	$("#test")
	.on('mouseenter',function(e){
        sub.removeClass('none');
        $(document).bind('mousemove',moveHanlder)

	})
	.on('mouseleave',function(e){
         console.log('fire mouse leave')
		sub.addClass("none");
		if (activeRow) {
    
		    //如果存在一级菜单激活
		    activeRow.removeClass('active');
		    //去除样式一级菜单的active样式
		    activeRow = null;
		   }
		   if (activeMenu) {
		    //如果存在二级菜单激活
		    activeMenu.addClass('none')
		    //给二级菜单添加none样式
		    activeMenu = null
		   }

           $(document).unbind('mousemove',moveHanlder)

		  })
	.on('mouseenter','li',function(e){
           if(!activeRow){
           	activeRow= $(e.target)
           	activeRow.addClass('active')
           	activeMenu=$('#'+activeRow.data('id'))
           	activeMenu.removeClass('none')
           	return
           } 

           //setTimeout设置延迟
	       //debounce去抖技术
	       if(timer){
	       	clearTimeout(timer);
	       }

	       var currMousePos = mouseTrack[mouseTrack.length-1]
	       var leftCorner = mouseTrack[mouseTrack.length-2]
           var delay = needDelay(sub,leftCorner,currMousePos)
           
           if(delay){
           	timer =setTimeout(function(){
           	if(mouseInSub){
           		return
           	}
           activeRow.removeClass('active')
           activeMenu.addClass('none')

           activeRow= $(e.target)
           activeRow.addClass('active')
           activeMenu=$('#'+activeRow.data('id'))
           activeMenu.removeClass('none')
           timer=null
           },300)
           }
           
           else{
           	var prevActiveRow = activeRow;
           	var prevActiveMenu = activeMenu;

           	activeRow = $(e.target)
           	activeMenu = $('#'+ activeRow.data('id'))

           	prevActiveRow.removeClass('active')
           	prevActiveMenu.addClass('none')

           	activeRow.addClass('active')
           	activeMenu.removeClass('none')

           }
           
	})
})