

function Datepaciker(props){
	this.opts = {
		 date_bgColor:'#3366CC',
		 date_separator:'-',
	};
  
	//$.extend(this.opts, props);
	this.date =null;
    this.year=null;
  	this.month=null;
 	this.firstWeek=null;//第一天是星期几；
    this.days=null;//该月的天数；
    this.toDay=null;
    this.oDiv=null;
    this.oInput=null;
}

Datepaciker.prototype.getWeekInMonth=function (year,month){ //获取某年某月第一天是星期几； 
    var temp = new Date(year,month,1); 
    //alert("date:"+month+temp);
    //alert(temp.getDay());
    return temp.getDay(); 

}

Datepaciker.prototype.getDaysInMonth=function (year,month){ //获取某年某月有多少天；
    var temp = new Date(year,month,0); 
    return temp.getDate(); 
}
Datepaciker.prototype.init=function(){
	this.date =new Date();
    this.year=this.date.getFullYear();
  	this.month=this.date.getMonth()+1;
 	  this.firstWeek=this.getWeekInMonth(this.year,this.month-1);//第一天是星期几；
    this.days=this.getDaysInMonth(this.year,this.month-1);;//该月的天数；
    this.toDay=this.date.getDate();
    this.oDiv=document.getElementById('con');
    this.oInput=document.getElementById('dxx_date');
    var that=this;
    // this.oInput.onfocus=this.dateShow;
   this.oInput.onfocus=this.dateShow.call(that);
    //this.oInput.onblur=hide;
}
Datepaciker.prototype.setHead=function(){
	var s="<thead><th colspan='7' style='width:100%;'><div style='float:left;width:10%;text-align:center;color:black;' id='dxx_left' title='上一月'><</div><div style='float:left;text-align:center;width:80%;margin-bottom:20px;color:black;'>"+this.year+ "年"+this.month+ "月</div><div style='float:right;width:10%; text-align:center;color:black' id='dxx_right' title='下一月'>></div></th>";
    var week=['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    s+="<tr>";
    for(var i=0;i<7;i++){
         s+="<th style='text-align:left'>"+week[i]+"</th>";
    }
    s+="</tr></thead><tbody>";
    return s;
}

Datepaciker.prototype.setDay=function(){
      debugger;
      var str="",newYear=this.year;
      var  mon=(this.month-1>0)?this.month-1:12;
      if(mon==12) newYear=this.year-1;
      var lastdays=this.getDaysInMonth(newYear,mon),day=1;
      console.log(lastdays);
      console.log(mon);
      var temp = new Date(this.year,mon-1,lastdays); 
      console.log(temp);
    //alert("date:"+month+temp); 
      var lastWeek=temp.getDay();
//console.log(lastWeek);
      firstWeek=this.getWeekInMonth(this.year,this.month-1);
      firstDays=this.getDaysInMonth(this.year,this.month-1)
      this.days=this.getDaysInMonth(this.year,this.month);
  //    console.log(firstWeek);
      str+="<tr>";
      if(this.firstWeek<0){
       
        for(var i=0;i<7;i++){
             str+="<td class='dxx_lesser'>"+(lastdays-6+i)+"</td>";
        }
       
      }else{
        for(var i=0;i<7;i++){
          if(i<lastWeek+1){
            //console.log(lastdays-firstWeek+1+i);
             str+="<td class='dxx_lesser'>"+(firstDays-lastWeek+i)+"</td>";
             
           }else{
             if(day==this.toDay){
               str+="<td class='dxx_today'>"+day+"</td>";
             }else{
               str+="<td class='dxx_imp'>"+day+"</td>";
             }
             day++;
           }
        }
      }
      str+="</tr>";
      var dd=day;
      for(var i=0;i<5;i++){
      str+="<tr>";
      	for(var j=0;j<7;j++){
        	if(i*7+j<=this.days-dd){
           		 if(day==this.toDay){
             		 str+="<td class='dxx_today'>"+day+"</td>";
           		 }else{
             	 str+="<td class='dxx_imp'>"+day+"</td>";
            	 }
            
         	}else{
            	str+="<td class='dxx_lesser'>"+day+"</td>";
            }
          	day=day%this.days;
          	day++;
      	} 
        	str+="</tr>"; 
      }
       return str;
}

 
Datepaciker.prototype.drawDate = function(){
      var str="<table id='dxx_table'>";
      str+=this.setHead();
      str+=this.setDay();
      str+="<tbody/></table>";
      this.oDiv.innerHTML=str;
      var oLeft=document.getElementById('dxx_left');
      var oRight=document.getElementById('dxx_right');
      var oTd=document.getElementsByTagName('td');
      var oCon=document.getElementById("con");
      var oDate=document.getElementById("dxx_date");
      var that=this;
      for(var i=0;i<oTd.length;i++){
        oTd[i].onmouseover =function(){
          this.style.background="pink";
        }
        oTd[i].onmouseout =function(){
          this.style.background="";
        }
        oTd[i].onclick=function(){
          that.toDay=this.innerHTML;
          that.oInput.value=that.year+"-"+that.month+"-"+ that.toDay;
          that.hide();
        }
      }
      oLeft.onclick=function(){
        that.reducMonth();
      };
      oRight.onclick=function(){
        that.addMonth();
      };
      oCon.onclick=function(){
        that.dateShow();
      }
      oDate.onchange=function(){};
  }
Datepaciker.prototype.reducMonth = function(){
       this.month--;
       if(this.month==0) 
       {
        this.month=12;
        this.year--;
       }
       this.toDay=1;
       this.drawDate();
     
}
Datepaciker.prototype.addMonth = function(){
       this.month++;
       if(this.month>12) 
       {
        this.month=1;
        this.year++;
       }
       this.toDay=1;
      this.drawDate();
     
}
Datepaciker.prototype.dateShow = function(){
    //var s=this.oDiv.value;
   // var p=getPos(o);
    // if(s){
    //    this.drawDate();
    // }else{
    //    this.date=new Date();
    //    
    // }
    // alert(this+"dfsdf");
    this.drawDate();
    this.oDiv.style.display="block";
 }
 Datepaciker.prototype.hide = function(){
    this.oDiv.style.display="none";
}
