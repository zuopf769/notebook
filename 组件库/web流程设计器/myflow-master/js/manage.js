
var m = {
	url: 'manage/index.php?m='
	,mAlert: function(content){
		// var html = '<div class="myalert" style="top:'+($(window).height()/2-175)+'px;left:'+($(window).width()/2-250)+'px">'
		// 				+content
		// 			+'</div>'
		// 			+'<div class="cover" style="width:'+$(window).width()+';height:'+$(window).height()+';"></div>';
		// $('body').append(html);
		$('.myalert').html(content);
		$('.myalert')[0].style.top = $(window).height()/2-175+'px';
		$('.myalert')[0].style.left = $(window).width()/2-250+'px';
		$('.cover').show();
		$('.myalert').show(500);
	}
	,mAlertHide: function(){
		$('.myalert').html('');
		$('.myalert').hide(500);
		$('.cover').hide();
	}
	,checkuser: function(){
		var that = this;
		$.getJSON(that.url+'cu&c=?',function(json){
			// console.log(json);
			if(json == 'no loged!'){
				that.login();
			}else{
				$('.top .user .info span').html(json['nickname']);
				that.getFileList();
			}
		})
	}
	,login: function(){
		var that = this;
		var html = '<div class="cont">'
						+'<div class="inp">'
							+'<label class="span1" for="username">用户名</label>'
							+'<input class="span3" type="text" id="username" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span1" for="password">密&nbsp;&nbsp;&nbsp;码</label>'
							+'<input class="span3" type="password" id="password" />'
						+'</div>'
						+'<div class="butt" style="margin-left:30px">'
							// +'<input type="button" class="btn btn-warning btn-large" id="register" value="注册"/>'
							+'<a class="span2" href="#">没有账号？<br>现在去注册-></a>'
							+'<input type="button" style="margin-left:0;" class="btn btn-success btn-large span2" id="login" value="登陆"/>'
						+'</div>'
					+'</div>'
		that.mAlert(html);
		$('.myalert .cont .butt #login').bind('click', function(){
			$.getJSON(that.url+'l&username='+$('.myalert .cont .inp #username').val()+'&password='+$('.myalert .cont .inp #password').val()+'&c=?',function(json){
				// console.log('11');
				if(json && json['nickname']){
					that.mAlertHide();
					$('.top .user .info span').html(json['nickname']);
					that.getFileList();
				}
			})
		})
		$('.myalert .cont .butt a').bind('click', function(){
			that.register();
			
		})
	}
	,logout: function(){
		var that = this;
		$.getJSON(that.url+'lo&c=?',function(json){
			// console.log(json);
			if(json == 'Logout success!'){
				flow.canvas.can.clear();
				that.login();
			}
		})
	}
	,register: function(){
		var that = this;
		$('.myalert').hide();
		var html = '<div class="cont">'
						+'<div class="inp">'
							+'<label class="span2" for="username">用户名</label>'
							+'<input class="span3" type="text" id="username" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span2" for="password">密&nbsp;&nbsp;&nbsp;码</label>'
							+'<input class="span3" type="password" id="password" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span2" for="repassword">重复密码</label>'
							+'<input class="span3" type="password" id="repassword" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span2" for="nickname">昵&nbsp;&nbsp;&nbsp;称</label>'
							+'<input class="span3" type="text" id="nickname" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span2" for="email">邮&nbsp;&nbsp;&nbsp;箱</label>'
							+'<input class="span3" type="email" id="email" />'
						+'</div>'
						+'<div class="inp">'
							+'<label class="span1" style="margin-right:85px;">头&nbsp;&nbsp;&nbsp;像</label>'
							+'<input type="radio" name="head" value="1" checked="checked"/><img  src="img/photo" alt="" />'
							+'<input type="radio" name="head" value="2"/><img  src="img/photo" alt="" />'
							+'<input type="radio" name="head" value="3"/><img  src="img/photo" alt="" />'
							+'<label class="span1" style="margin-right:85px;"></label>'
							+'<input type="radio" name="head" value="1"/><img  src="img/photo" alt="" />'
							+'<input type="radio" name="head" value="2"/><img  src="img/photo" alt="" />'
							+'<input type="radio" name="head" value="3"/><img  src="img/photo" alt="" />'
						+'</div>'
						+'<div class="butt" style="margin-left:150px; margin-top:30px">'
							+'<input type="button" class="btn btn-success btn-large" id="register" value="注册"/>'
							+'<input type="button" class="btn btn-large" id="cancle" value="取消"/>'
						+'</div>'
					+'</div>'
		// that.mAlert(html);
		$('.myalert').html(html);
		$('.myalert')[0].style.top = $(window).height()/2-290+'px';
		$('.myalert')[0].style.left = $(window).width()/2-300+'px';
		$('.myalert')[0].style.height = '580px';
		$('.myalert')[0].style.width = '600px';
		$('.myalert').show(500);
		$('.myalert .cont .butt #register').bind('click', function(){
			if(!$('.myalert .cont .inp #username').val()){
				alert('请输入用户名！');
			}else if(!$('.myalert .cont .inp #password').val()){
				alert('请输入密码！');
			}else if(!$('.myalert .cont .inp #nickname').val()){
				alert('请输入昵称！');
			}else if(!$('.myalert .cont .inp #email').val()){
				alert('请输入邮箱！');
			}else if($('.myalert .cont .inp #password').val() != $('.myalert .cont .inp #repassword').val()){
				alert('重复密码与密码不一致，请重新输入！');
			}else{
				$.getJSON(that.url+'rg&username='+$('.myalert .cont .inp #username').val()+'&password='+$('.myalert .cont .inp #password').val()+'&nickname='+$('.myalert .cont .inp #nickname').val()+'&email='+$('.myalert .cont .inp #email').val()+'&head='+$('.myalert .cont .inp input[name="head"]:checked').val()+'&c=?',function(json){
					// console.log('11');
					if(json == 'Username exit!'){
						alert('用户名已经存在！')
					}else if(json['nickname']){
						$('.myalert')[0].style.height = '350px';
						$('.myalert')[0].style.width = '500px';
						that.mAlertHide();
						$('.top .user .info span').html(json['nickname']);
						that.getFileList();
					}
				})
			}
		})
		$('.myalert .cont .butt #cancle').bind('click', function(){
			$('.myalert')[0].style.height = '350px';
			$('.myalert')[0].style.width = '500px';
			that.mAlertHide();
			that.login();
		})
	}
	,getFileList: function(){
		var that = this;
		$.getJSON(that.url+'fl&c=?', function(json){
			flow.canvas.name = '新建流程图'+(json.length?(json.length+1):1);
			var html = '<option value="'+flow.canvas.name+'">'+flow.canvas.name+'</option>';
			$.each(json,function(i,u){
				// console.log(u)
				html += '<option value="'+u['name']+'">'+u['name']+'</option>';
			})
			$('.top .user .function .file #file').html(html);
		})
	}
	// 直接存数据
	,save_1: function(){
		var that = this;
		var dd = that.getData();
		$.post(that.url+'sv',{name:flow.canvas.name,data:dd},function(result){
			// console.log(result);
			if($.trim(result) == "'yes'"){
				$('.top .user .function .save input').removeAttr('disabled');
			}
		})
	}
	// 弹框更改名字再存
	,save_2: function(){
		var that = this;
		var html = '<div class="cont">'
						+'<div class="inp">'
							+'<label class="span1" for="name">名称</label>'
							+'<input class="span3" type="text" id="name" value="'+$('.top .user .function .file #file').val()+'"/>'
						+'</div>'
						+'<div class="butt">'
							+'<input type="button" class="btn btn-success btn-large" id="confirm" value="确定"/>'
							+'<input type="button" class="btn btn-large" id="cancle" value="取消"/>'
						+'</div>'
					+'</div>'
		that.mAlert(html);
		$('.myalert .cont .butt #confirm').bind('click', function(){
			var exist = 0;
			$('.top .user .function .file #file option').each(function(i,u){
				if(u.value == $('.myalert .cont .inp #name').val()){
					exist = 1;
				}
			})
			if(exist == 0 || confirm('您更改的名字与您其他文件的名字重复\n是否确定覆盖之前的文件')){
				flow.canvas.name = $('.myalert .cont .inp #name').val();;
				var dd = that.getData();
				$.post(that.url+'sv',{name:flow.canvas.name,data:dd},function(result){
					if($.trim(result) == "'yes'"){
						$('.top .user .function .save input').removeAttr('disabled');
						$('.top .user .function .file #file').find("option:selected").text($('.myalert .cont .inp #name').val()).val($('.myalert .cont .inp #name').val());
						that.mAlertHide();
					}
				})
			}
		})
		$('.myalert .cont .butt #cancle').bind('click', function(){
			$('.top .user .function .save input').removeAttr('disabled');
			that.mAlertHide();
		})
	}
	,changeFile: function(name){
		var that = this;
		$.getJSON(that.url+'gf&name='+name+'&c=?',function(json){
			// console.log(json['name'])
			if(json){
				flow.canvas.name = name;
				$('.top .user .function .file #file').val(name);
				flow.canvas.can.clear();
				$.each(json,function(i,u){
					if(u['type'] == 'path'){
						flow.main.makeline(flow.canvas.can.getById(json[u['op']]['id']),flow.canvas.can.getById(json[u['ed']]['id']),u['path'],u['text']['name'],u['text']['description'],u['text']['condition']);
					}else{
						var re = flow.main.makeFlow(u['origin'],u['position']['x'],u['position']['y'],u['text']['name'],u['text']['description'],u['text']['condition']);
						u['id'] = re.id;
					}
				})
			}
		})
	}
	,rename: function(){
		var that = this;
		var html = '<div class="cont">'
						+'<div class="inp">'
							+'<label class="span1" for="name">名称</label>'
							+'<input class="span3" type="text" id="name" value="'+$('.top .user .function .file #file').val()+'"/>'
						+'</div>'
						+'<div class="butt">'
							+'<input type="button" class="btn btn-success btn-large" id="confirm" value="确定"/>'
							+'<input type="button" class="btn btn-large" id="cancle" value="取消"/>'
						+'</div>'
					+'</div>'
		that.mAlert(html);
		$('.myalert .cont .butt #confirm').bind('click', function(){
			var exist = 0;
			$('.top .user .function .file #file option').each(function(i,u){
				if(u.value == $('.myalert .cont .inp #name').val()){
					exist = 1;
				}
			})
			if(exist == 0 || confirm('您更改的名字与您其他文件的名字重复\n是否确定覆盖之前的文件？')){
				var nm = $('.myalert .cont .inp #name').val();
				$.getJSON(that.url+'rn&oldname='+flow.canvas.name+'&newname='+nm+'&c=?',function(result){
					if(result == 'yes'){
						$('.top .user .function .save input').removeAttr('disabled');
						flow.canvas.name = $('.myalert .cont .inp #name').val();
						$('.top .user .function .file #file').find("option:selected").text(flow.canvas.name).val(flow.canvas.name);
						that.mAlertHide();

					}
				})
			}
		})
		$('.myalert .cont .butt #cancle').bind('click', function(){
			that.mAlertHide();
		})

	}
	,newFile: function(){
		var that = this;
		that.save_1();
		flow.canvas.name = '新建流程图'+($('.top .user .function .file #file option').length+1);
		$('.top .user .function .file #file').prepend('<option value="'+flow.canvas.name+'">'+flow.canvas.name+'</option>');
		$('.top .user .function .file #file option')[0].selected = true;
		flow.canvas.can.clear();

	}
	,delFile: function(){
		var that = this;
		if(confirm('您将删除此流程图所有的东西\n是否确定删除？')){
			$.getJSON(that.url+'dl&name='+flow.canvas.name+'&c=?',function(json){
				if(json == 'yes'){
					$('.top .user .function .file #file option:selected').remove();
					that.changeFile($('.top .user .function .file #file option')[0].value);
				}
			})
		}
	}
	,download: function(){
		var that = this;
		window.location.target = '_blank';
		window.location.href = that.url+'df&name='+flow.canvas.name; 
	}
	,upload: function(){
		var that = this;
		var html = '<iframe frameborder="0" width="500" height="350">'
					+'</iframe>'
		that.mAlert(html);
		$('.myalert iframe').contents().find('head').html('<link rel="stylesheet" href="css/bootstrap.min.css"><link rel="stylesheet" href="css/style.css">');
		var html2 = '<div class="cont">'
						+'<form method="post" action="'+that.url+'uf" enctype="multipart/form-data">'
							+'<div class="inp">'
								+'<label class="span1" for="f">名称</label>'
								+'<input class="span3" style="margin-top:10px;" type="file" name="f"/>'
							+'</div>'
							+'<div class="butt">'
								+'<input type="button" class="btn btn-success btn-large" id="confirm" value="确定"/>'
								+'<input type="button" class="btn btn-large" id="cancle" value="取消"/>'
							+'</div>'
						+'</form>'
					+'</div>';
		var iframe = $('.myalert iframe').contents().find('body');
		iframe.html(html2);
		iframe[0].style.background = 'none';
		iframe.find('form .butt #confirm').bind('click', function(){
			var nn = iframe.find('form .inp input[type="file"]').val().split('\\');
			var name = nn[nn.length-1].split('.')[0];
			$.getJSON(that.url+'cn&name='+name+'&c=?', function(json){
				function sub(){
					iframe.find('form').submit();
					window.addEventListener('message', function(ev){
						// console.log(ev.data);
						var json = $.parseJSON(ev.data)
						$.each(json,function(i,u){
							if(u['type'] == 'path'){
								flow.main.makeline(flow.canvas.can.getById(json[u['op']]['id']),flow.canvas.can.getById(json[u['ed']]['id']),u['path'],u['text']['name'],u['text']['description']);
							}else{
								var re = flow.main.makeFlow(u['origin'],u['position']['x'],u['position']['y'],u['text']['name'],u['text']['description']);
								u['id'] = re.id;
							}
						})

					})
				}
				if(json == 'yes'){
					if(confirm('您更改的名字与您其他文件的名字重复\n是否确定覆盖之前的文件？')){
						sub();
					}
				}else if(json == 'no'){
					sub();
				}
			})
			
		})
		$('.myalert .cont .butt #cancle').bind('click', function(){
			that.mAlertHide();
		})
	}
	,getData: function(){
		var json = {};
		// if($('.myalert .cont .inp #name')[0]){
		// 	json['name'] = $('.myalert .cont .inp #name').val();
		// }else{
		// 	json['name'] = $('.top .user .function .file #file').val();
		// }
		var r = flow.main.getE(['circle','rect','path']);
		$.each(r,function(i,u){
			json[i] = {};
			json[i]['type'] = u.type;
			json[i]['origin'] = u.origin;
			json[i]['text'] = {};
			json[i]['text']['name'] = u.text.attr('text');
			json[i]['text']['description'] = u.text.attr('description');
			json[i]['text']['condition'] = {}
			switch(u.type){
				case 'circle':
					json[i]['position'] = {'x':u.attr('cx'),'y':u.attr('cy')};
					u.num = i;
					break;
				case 'rect':
					// var x = parseFloat(u.attr('x'))
					// ,y = parseFloat(u.attr('y'));
					// if(u.origin == 'branch'){
					// 	json[i]['position'] = {'x':(y-x)/Math.SQRT2+Math.SQRT2*x,'y':(y-x)/Math.SQRT2};
					// }else{
						json[i]['position'] = {'x':u.attr('rex'),'y':u.attr('rey')};
					// }
					u.num = i;
					break;
				case 'path':
					json[i]['path'] = $(u[0]).attr('d');
					json[i]['op'] = u.op.num;
					json[i]['ed'] = u.ed.num;
					break;
			}
			for(var j in u.text.attrs.condition){
				json[i]['text']['condition'][j] = u.text.attrs.condition[j]
			}
		
		})
			return JSON.stringify(json);
	}
	,functionBind: function(){
		var that = this;

		//保存按钮绑定
		$('.top .user .function .save input').bind('click',function(){
			// 验证此流程图是否已经存在
			$.getJSON(that.url+'cn&name='+$('.top .user .function .file #file').val()+'&c=?',function(json){
				$('.top .user .function .save input').attr({'disabled':'true'});
				if(json == 'yes'){
					// 存在则直接保存
					that.save_1();
				}else{
					// 不存在则弹框要求更改名字
					that.save_2();
				}
			})
		});
		// 下拉列表绑定
		$('.top .user .function .file #file').bind('change',function(){
			// console.log($(this).val())
			if(that.getData().length>2)
				that.save_1();
			that.changeFile($(this).val());
		});

		$('.top .user .function .rename input').bind('click', function(){
			that.rename();
		})
		$('.top .user .function .new input').bind('click', function(){
			that.newFile();
		})
		$('.top .user .function .delete input').bind('click', function(){
			that.delFile();
		})
		$('.top .user .info').bind('mouseover', function(){
			$('.top .user .info .dropdown .dropdown-menu')[0].style.display = 'block';
		})
		$('.top .user .info').bind('mouseout', function(){
			$('.top .user .info .dropdown .dropdown-menu')[0].style.display = 'none';
		})
		$('.top .user .info li a').bind('click',function(){
			$('.top .user .info .dropdown .dropdown-menu')[0].style.display = 'none';
		})
		$('.top .user .info #logout').bind('click', function(){
			that.logout();
		})
		$('.top .user .info #download').bind('click', function(){
			that.download();
		})
		$('.top .user .info #upload').bind('click', function(){
			that.upload();
		})
	}
	,init: function(){
		this.checkuser();
		this.functionBind();
	}
}
m.init();