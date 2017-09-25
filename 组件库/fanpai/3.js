var pai = {};
	pai.className =[
	                'cardAK','cardAK','cardAQ','cardAQ',
	                'cardBK','cardBQ','cardBK','cardBQ',
	                'cardCK','cardCK','cardCQ','cardCQ'
	               ];
	pai.success=0;
	pai.total=6;
	
$(function(){
	$('#start').click(function(){
		$(this).fadeOut();
		$('.cards').show();
		pai.className.sort(shuffle);
	for(var i=0;i<11;i++){
		$('.card:first-child').clone().appendTo('#cards');
	}
 	$("#cards").children().each(function(index){
		$(this).css({
			"left" : ($(this).width()+20)*(index%4)+50/* +position.left+20 */,
			"top" : ($(this).height()+20)*Math.floor(index/4)+50/* +position.top+20 */
		});
		var pattern = pai.className.pop();
		$(this).find('.back').addClass(pattern);
		$(this).attr('data-pattern',pattern);
		$(this).click(selectCard);
	});
	function shuffle(){
		return 0.5-Math.random();
	}
	function selectCard(){
		if($('.card-flipped').size()>1)
			return;
		$(this).addClass('card-flipped');
		if($('.card-flipped').size()==2)
			setTimeout(cheakPattern,700);
	}
	function cheakPattern(){
		if(isMatch()){
				$(".card-flipped").removeClass('card-flipped').addClass('card-removed');
				$(".card-removed").bind('webkitTransitionEnd',removeTookCards);
				//alert(pai.success);
				pai.success++;
				if(pai.success==pai.total) alert("恭喜过关");
			}
		else{
			$('.card-flipped').removeClass('card-flipped');
		}
		
	}
	function isMatch(){
		var cards = $(".card-flipped");
		var pattern = $(cards[0]).data('pattern');
		var antherPattern = $(cards[1]).data('pattern');
		return (pattern == antherPattern);
	}
	function removeTookCards(){
		$('.card-removed').remove();
	}
	});
	
	
		
});