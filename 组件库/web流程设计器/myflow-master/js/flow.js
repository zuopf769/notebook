var t;
var flow = {
	
	//左边控制板
	main : {
		bind :function(){
			var that = this;
			$('.drag div').draggable({ helper: "clone" });
			$('.flow').droppable({drop: function(event,ui){
				// console.log(ui.draggable);
				// q = ui.draggable;
				var x = ui.position.left, y = ui.position.top;
				
				var type = ui.draggable[0].className.split(' ')[0];
				var name = $(ui.draggable[0]).find('span').html();
				//生成图框
				that.makeFlow(type,x,y,name,name);

				
			}})
			
			$('.line').bind('click', function(){
				that.lineBind();
				$('.handle h4').html('状态：连线中');
			})
			$('.choose').bind('click', function(){
				that.lineUnbind();
				$('.handle h4').html('状态：选择元素');
			})
		}
		,makeFlow: function(type,x,y,name,description,condition){
			var that = this;
			if( type == 'start'){
				var re = flow.canvas.can.circle(x,y,30).attr({fill: '#E0F1D0', stroke: "#03689a", cursor: "move"});
				var text = flow.canvas.can.text(x,y,name).attr({cursor:'pointer'});
			}else if(type == 'end'){
				var re = flow.canvas.can.circle(x,y,30).attr({fill: '#FFCCCC', stroke: "#03689a", cursor: "move"});
				var text = flow.canvas.can.text(x,y,name).attr({cursor:'pointer'});
			}else if(type == 'branch'){
				// var re = flow.canvas.can.rect((y-x)/Math.SQRT2,(y-x)/Math.SQRT2+Math.SQRT2*x,50,50,5).attr({fill: '#F4F4CC', stroke: "#03689a", cursor: "move"});
				var re = flow.canvas.can.rect(x,y,50,50,5).attr({fill: '#F4F4CC', stroke: "#03689a", cursor: "move"});
				re.rotate(45);
				re.attrs.rex = x
				,re.attrs.rey = y;
				var text = flow.canvas.can.text(x+25,y+25,name).attr({cursor:'pointer'});
			}else{
				var re = flow.canvas.can.rect(x,y,100,50,5).attr({fill: '#f6f7ff', stroke: "#03689a", cursor: "move"});
				re.attrs.rex = x
				,re.attrs.rey = y;
				var text = flow.canvas.can.text(x+50,y+25,name).attr({cursor:'pointer'});
				
			}
			text.attrs.description = description||name;
			text.attrs.condition = condition||{};

			re.origin = type;
			//关联文字和图框
			re.text = text;
			re.line = [];
			//点击显示属性图框
			that.focusBind(re);

			// flow.canvas.q.push(re);
			//如果是连线状态，绑定连线
			if($.lineFlag){
				that.lineBind();
			}

			//拖动canvas里的东西
			var start = function() {
		        this.animate();
		        if(this.type == 'circle'){
					this.ox =this.attr("cx");
	        		this.oy =this.attr("cy");
		        }else{
		        	this.ox =this.attr("x");
		        	this.oy =this.attr("y");
		        }
		        this.text.ox =this.text.attr("x");
		        this.text.oy =this.text.attr("y");
		    },
		    move = function(dx, dy) {
		        // that.lineUnbind();
		        // console.log(this.attrs.cx);
		        // console.log(this.ox);
		        // console.log(this);
				var x = this.ox + dx,
	    			y = this.oy + dy;
	    			
		        if(this.type == 'circle'){
		        	this.attr({
			            cx: x,
			            cy: y
			        });
		        }else{
			        if(this.origin == 'branch'){
			        	this.attr({
				            x: (dy-dx)/Math.SQRT2+Math.SQRT2*dx+this.ox,
				            y: (dy-dx)/Math.SQRT2+this.oy
				        });
				        
			        }else{
			        	this.attr({
				            x: x,
				            y: y,
				        });
			        }
			        this.attrs.rex = x
			        ,this.attrs.rey = y;
		        }
		        this.text.attr({
		            x: this.text.ox+dx,
		            y: this.text.oy+dy
		        });

		        x += this.getBBox().width/2; 
		        $.each(this.line, function(i,u){
		        	if(flow.canvas.can.getById(u[1])){
			        	that.lineReset(flow.canvas.can.getById(u[1]));
		        	}
			        
		        })
		      	 
		    },
		    up = function() {
		        this.animate();
		        // that.lineBind();
		    };
		    re.drag(move,start,up);
		    return re;
		}
		,lineUnbind: function(){
			var	that= this;
			var q = that.getE(['circle','rect']);
			$.each(q, function(i,u){
				$(u[0]).unbind('click',null);
				$(u.text[0]).unbind('click',null);
				that.focusBind(u);
			})
			$.lineFlag = 0;
		}
		,lineBind: function(){
			var that = this;
			$.lineStart = 0;
			var q = that.getE(['circle','rect']);
			$.each(q,function(i,u){
				$(u[0]).unbind('click',null);
				$(u.text[0]).unbind('click',null);
				that.focusBind(u);
				$(u[0]).bind('click', bind);
				$(u.text[0]).bind('click',bind);
				function bind(){
					// console.log(u);
					if(!$.lineStart){
						// console.log(i);
						$.lineStart = u;
					}else if(u.id != $.lineStart.id){
						// console.log(i)
						var op = $.lineStart
							,ed = u;
						if(op.type == 'circle'){
							opp = {x:op.attrs.cx, y:op.attrs.cy};
						}else{
							opp = {x:op.attrs.x, y:op.attrs.y};
						}
						if(ed.type == 'circle'){
							edp = {x:ed.attrs.cx, y:ed.attrs.cy};
						}else{
							edp = {x:ed.attrs.x, y:ed.attrs.y};
						}
						var path = 'M'+opp.x+' '+opp.y+'L'+edp.x+' '+edp.y;
						var name = 'To '+ed.text.attr('text')
						//生成连线
						that.makeline(op,ed,path,name,name);

						$.lineStart = 0;
					}

				}
			})
			$.lineFlag = 1;
		}
		,makeline: function(op,ed,path,name,description,condition){
			// console.log(op,ed);
			var that = this;
			var l = flow.canvas.can.path(path).attr({'stroke':'#808080','arrow-end': 'block-wide-long', 'stroke-width': '2px'});
			var path = path.split('L');
			var text;
			if(path.length>=3){
				// l.text.attr({'x':parseInt(path[1].split(',')[0])+25,'y':parseInt(path[1].split(',')[1])-15});
				text = flow.canvas.can.text(parseInt(path[1].split(',')[0])+25,parseInt(path[1].split(',')[1])-15,name).attr({cursor:'pointer'});
			}else{
				text = flow.canvas.can.text((parseInt(path[1].split(',')[0])+parseInt(path[0].split('M')[1].split(',')[0]))/2+25,(parseInt(path[1].split(',')[1])+parseInt(path[0].split(',')[1]))/2-15,name).attr({cursor:'pointer'});
			}
			text.attrs.description = description||name;
			text.attrs.condition = condition||{};
			l.origin = 'line'
			l.text = text;
			l.op = op;
			l.ed = ed;

			//重置直线开头和结尾的位置
			that.lineReset(l);
			//直线弯曲
			that.lineBend(l);
			//点击成为焦点
			that.focusBind(l);

			// flow.canvas.l.push(l);
			op.line.push(['start', l.id]);
			ed.line.push(['end', l.id]);
		}
		,lineBend: function(el){
			var that = this;
			$(el[0]).bind('click', bind);
			$(el.text[0]).bind('click', bind);
			function bind(e){
				e.stopPropagation();
				$.each(flow.canvas.lp, function(i,u){
					u.remove();
				})
				var path = $(el[0]).attr('d').split('L');
				// q=path;q
				var lp;
				if(path.length>=3){
					lp	= flow.canvas.can.rect(path[1].split(',')[0]-3,path[1].split(',')[1]-3,6,6,4).attr({fill: '#000', stroke: "#fff", 'stroke-width': '2px',cursor: "move"});
				}else{
					lp	= flow.canvas.can.rect((parseInt(path[1].split(',')[0])+parseInt(path[0].split(',')[0].split('M')[1]))/2-3,(parseInt(path[1].split(',')[1])+parseInt(path[0].split(',')[1]))/2-3,6,6,4).attr({fill: '#000', stroke: "#fff", 'stroke-width': '2px',cursor: "move"});
				}
				lp.origin = 'bend';
				//点的拖拽绑定
				that.lpDrag(lp,el,path);
			}
		}
		,lpDrag: function(lp,el,path){
			var that = this;
			var start = function() {
				// e.stopPropagation();
				// e.preventDefault();
		        this.ox = this.attr("x");
		        this.oy = this.attr("y");
		        this.animate();
		    },
		    move = function(dx, dy) {
		    	// e.stopPropagation();
		    	// e.preventDefault();					
	        	var x = this.ox + dx,
	    			y = this.oy + dy;
    			this.attr({
		            x: x-3,
		            y: y-3,
		        });
		        // console.log($(ll).attr('d'))
		       	
		       	$(el[0]).attr({'d':path[0]+'L'+x+','+y+'L'+path[path.length-1]});
		       	that.lineReset(el);
		    },
		    up = function() {
		    	// q=e;
		    	// e.stopPropagation();
		    	// e.preventDefault();
		        this.animate();
		        // console.log(this.attr('x'));
	        	var lp	= flow.canvas.can.rect(parseInt(this.attr('x')),parseInt(this.attr('y')),6,6,4).attr({fill: '#000', stroke: "#fff", 'stroke-width': '2px',cursor: "move"});
	        	lp.origin = 'bend';
		        setTimeout(function(){
		        	that.content(el);
		        	that.lpDrag(lp,el,path);
		        },10);
		    };
		    lp.drag(move,start,up);
		    flow.canvas.lp.push(lp);
		}
		,lineReset: function(l){
			var path = $(l[0]).attr('d').split('L');
			path[0] = path[0].split('M')[1];
			//取开始和结束关联的框的8个点
			var s = l.op.getBBox();
			var op = [
				[s.x,s.y]
				,[s.x+s.width/2,s.y-5]
				,[s.x2,s.y]
				,[s.x2+5,s.y+s.height/2]
				,[s.x2,s.y2]
				,[s.x+s.width/2,s.y2+5]
				,[s.x,s.y2]
				,[s.x-5,s.y+s.height/2]
			];
			var e = l.ed.getBBox();
			var ed = [
				[e.x,e.y]
				,[e.x+e.width/2,e.y-5]
				,[e.x2,e.y]
				,[e.x2+5,e.y+e.height/2]
				,[e.x2,e.y2]
				,[e.x+e.width/2,e.y2+5]
				,[e.x,e.y2]
				,[e.x-5,e.y+e.height/2]
			];
			var distanceOP = Math.pow($(window).width(),2)+Math.pow($(window).height(),2)
			,distanceED = Math.pow($(window).width(),2)+Math.pow($(window).height(),2)
			,num = [];
			$.each(op, function(i,u){
				var d = Math.pow((path[1].split(',')[0]-u[0]),2)+Math.pow((path[1].split(',')[1]-u[1]),2);
				if(d<distanceOP){
					distanceOP = d;
					num[0] = i;
				}
			})
			$.each(ed, function(i,u){
				var d = Math.pow((u[0]-path[(path.length-2)].split(',')[0]),2)+Math.pow((u[1]-path[(path.length-2)].split(',')[1]),2);
				if(d<distanceED){
					distanceED = d;
					num[1] = i;
				}
			})
			if(path.length>=3){
				$(l[0]).attr({'d':'M'+op[num[0]][0]+','+op[num[0]][1]+'L'+path[1].split(',')[0]+','+path[1].split(',')[1]+'L'+ed[num[1]][0]+','+ed[num[1]][1]});
				l.text.attr({'x':parseInt(path[1].split(',')[0])+25,'y':parseInt(path[1].split(',')[1])-15});
			}else{
				$(l[0]).attr({'d':'M'+op[num[0]][0]+','+op[num[0]][1]+'L'+ed[num[1]][0]+','+ed[num[1]][1]});
				l.text.attr({'x':(op[num[0]][0]+ed[num[1]][0])/2+25,'y':(op[num[0]][1]+ed[num[1]][1])/2-15});
			}

		}
		//检索特定元素集合
		,getE: function(type){
			var result = [];
			flow.canvas.can.forEach(function(el){
				$.each(type, function(i,u){
					if(el.type == u && el.origin && el.origin != 'bend'){
						result.push(el);
					}
				})
			})
			return result;
		}
		// //
		// ,checkL: function(num){
		// 	var w;
		// 	var q = that.getE(['circle','rect']);
		// 	$.each(q, function(i,u){
		// 		$.each(u.line,function(ei,eu){
		// 			if(eu[1] == num ){
		// 			// console.log([i,ei,eu]);
		// 				w = [i,ei,eu];
		// 			}
		// 		})
		// 	})
		// 	return (w||[]);
		// }

		//绑定焦点效果
		,focusBind: function(el){
			var that = this;
			if(el.origin != 'bend'){
				$(el[0]).bind('click',bind);
				$(el.text[0]).bind('click',bind);
				function bind(e){
					e.stopPropagation();
					that.focus(el);
				}
			}
		}
		//设置图框和连线的内容
		,content: function(el){
			var that = this;
			var p = flow.canvas.can.getById(el.id);
			var condition = '';
			if(p.type == "path"){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<label >条件</label>'
									+'<input class="span2" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}else if(p.origin == 'branch'){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<label >判断</label>'
									+'<input class="span2" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}else if(p.type == 'rect'){
				for(var i in p.text.attrs.condition){
					condition += '<div>'
									+'<input class="key span1" type="text" value="'+i+'"/>'
									+'<span>:</span>'
									+'<input class="value" type="text" value="'+p.text.attrs.condition[i]+'"/>'
								+'</div>';
				}
				condition +='<a class="add" href="#">+</a>'
							+'<a class="del" href="#">-</a>';
			}
			var html = '<div class="content" op="'+p.id+'">'
							+'<h4>属性</h4>'
							+'<div class="form">'
								+'<div>'
									+'<label for="name">显示</label>'
									+'<input class="span2" type="text" id="name" value="'+p.text.attr('text')+'"/>'
								+'</div>'
								+'<div>'
									+'<label for="description">描述</label>'
									+'<textarea class="span2" name="description" id="description" cols="20" rows="2">'+p.text.attr('description')+'</textarea>'
								+'</div>'
								+'<div class="condition">'
									+condition
								+'</div>'
								+'<div class="butt">'
									+'<input type="button" class="btn btn-success" id="confirm" value="确定"/>'
									+'<input type="button" class="btn" id="cancle" value="取消"/>'
								+'</div>'
								+'<div class="butt">'
									+'<input type="button" class="btn btn-danger span2" id="delete" value="删除此元素"/>'
								+'</div>'
							+'</div>'
						+'</div>';
			$('body').append(html);
			$('.content .add').unbind('click',null);
			$('.content .add').bind('click',function(){
				if(p.type == "path"){
					var html = '<div>'
									+'<label >条件</label>'
									+'<input class="span2" type="text" value=""/>'
								+'</div>'
					$(this).before(html)
				}else if(p.origin == 'branch'){
					var html = '<div>'
									+'<label >判断</label>'
									+'<input class="span2" type="text" value=""/>'
								+'</div>'
					$(this).before(html);
				}else if(p.type == 'rect'){
					var html = '<div>'
									+'<input class="key span1" type="text" value=""/>'
									+'<span>:</span>'
									+'<input class="value" type="text" value=""/>'
								+'</div>'
					$(this).before(html);
				}
			});
			$('.content .del').unbind('click',null);
			$('.content .del').bind('click',function(){
				$(this).prev().prev().remove();
			});
			$('.content #confirm').unbind('click',null);
			$('.content #confirm').bind('click', function(){
				var text = flow.canvas.can.getById($('.content').attr('op')).text;
				text.attr({'text':$('.content #name').val()});
				// console.log($('.content #description').val())
				// console.log(flow.canvas.can.getById($('.content').attr('op')).text.attr('description'));
				text.attrs.description = $('.content #description').val();
				// console.log(flow.canvas.can.getById($('.content').attr('op')).text.attr('description'));
				// $(p[0]).unbind('click',null);
				// if($.lineFlag){
				// 	that.lineUnbind();
				// 	that.lineBind();	
				// } 
				// that.focusBind(p);
				text.attrs.condition = {};
				if(p.type == "path" || p.origin == "branch"){
					$('.content .condition div').each(function(i,u){
						text.attrs.condition[i] = ($(u).find('input').val());
					})
				}else if(p.type == 'rect'){
					text.attrs.condition = {};
					$('.content .condition div').each(function(i,u){
						text.attrs.condition[$(u).find('.key').val()] = $(u).find('.value').val(); 
					})
				}
				
			})
			$('.content #cancle').unbind('click',null);
			$('.content #cancle').bind('click', function(){
				$('.content').remove();
				that.unfocus();
			})
			$('.content #delete').unbind('click',null);
			$('.content #delete').bind('click', function(){
				if(confirm('删除此项后将删除该项的所有相关事物\n\n是否确定删除？')){
					var p = flow.canvas.can.getById($('.content').attr('op'));
					if(p.type == 'path'){
						$.each(p.op.line,function(ei,eu){
	        				if(eu[1] == p.id){
	        					p.op.line.pop(eu);
	        				}
	        			})
						$.each(p.ed.line,function(ei,eu){
	        				if(eu[1] == p.id){
	        					p.ed.line.pop(eu);
	        				}
	        			})
					}else{
						//删除相关的连线几连线相关的图框的line属性里的该连线
						$.each(p.line, function(i,u){
							var l = flow.canvas.can.getById(u[1]);
				        	if(l){
				        		var num;
				        		if(u[0] == 'start'){
				        			$.each(l.ed.line,function(ei,eu){
				        				if(eu[0] == 'end' && eu[1] == l.id){
				        					num = ei;
				        				}
				        			})
				        			l.ed.line.pop(num);
						        }else if(u[0] == 'end'){
						        	$.each(l.op.line,function(ei,eu){
				        				if(eu[0] == 'start' && eu[1] == l.id){
				        					num = ei;
				        				}
				        			})
				        			l.op.line.pop(num);
					         	}
				        	}
				        	l.text.remove();
		        			l.remove();
				        })
					}
					//删除点
					$.each(flow.canvas.lp, function(i,u){
						u.remove();
					})
			        //删除文字
					p.text.remove();
					//删除本身
			        p.remove();
					$('.content').remove();
					//将连线开始标识符置0
					$.lineStart = 0;
				}

			})
		}
		,focus: function(el){
			this.unfocus();
			if(el.type != 'path' && el.origin && el.origin != 'bend')
				el.attr({ stroke: "#FF3300" , 'stroke-width': '2px'});
			this.content(el);
		}
		,unfocus: function(){
			$.each(this.getE(['circle','rect']),function(i,u){
				if(u.origin != 'bend'){
					$('.content').remove();
					u.attr({ stroke: "#03689a" , 'stroke-width': '1px'});
				}
			})
		}
		//点击画布，消除path上面的点，消除属性框
		,flowClick: function(){
			var that = this;
			$('svg').bind('click', function(e){
				// console.log(1)
				e.stopPropagation();
				that.unfocus();
				$.each(flow.canvas.lp, function(i,u){
					u.remove();
				})
				
				flow.canvas.lp.length = 0;
			})
			
		}
		,init: function(){
			this.bind();
			this.flowClick();
		}
	}
	,canvas: {
		//线上面点的队列
		lp : []
		,init: function(){
			$('.flow').width($(window).width()).height($(window).height());
			var p = Raphael($('.flow')[0],$('.flow').width(),$('.flow').height());
			
			flow.canvas.can = p;


		}
	}
	,init: function(){
		this.canvas.init();
		this.main.init();
	}
}

flow.init();