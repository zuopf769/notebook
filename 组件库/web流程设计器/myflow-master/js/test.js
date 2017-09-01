//(function($){
	var p = Raphael(30,30,700,700);
	dashed = {fill: Raphael.getColor(), stroke: "#666", cursor: "move"};
	var re = [p.rect(10,10,40,40,5).attr(dashed),p.rect(150,150,40,40,5).attr(dashed)];

	// re[1].drag(function(dx,dy){
	// 	// console.log(event);
	// 	this.attr({ x: this.ox + dx, y: this.oy + dy});

	// },function(){
	// 	console.log(this);
	// 	this.ox = this.attr('x');
	// 	this.oy = this.attr('y');

	// },function(){
	// 	console.log(this);
	// })

	var start = function() {
        this.ox = this.attr("x");
        this.oy = this.attr("y");
        this.animate();
    },
    move = function(dx, dy) {
    	var x = this.ox + dx,
    		y = this.oy + dy;
    	console.log(x+','+y);
        this.attr({
            x: x,
            y: y
        });
        x += this.getBBox().width/2; 
      	$(l[0]).attr({'d':'M50 50L'+x+' 50 '+x+' '+y});
    },
    up = function() {
        this.animate();
    };
	
	var l = p.path('M50ioio 50L170 50 170 150').attr({'arrow-end': 'clissic', 'stroke-width': '3px'});

	re[1].drag(move,start,up);
//})(jQuery);