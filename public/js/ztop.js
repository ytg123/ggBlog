//一键置顶
$("#scroll").click(function(){
	$("html,body").animate({
		scrollTop:0
	},200);
});
//滑动条淡入淡出
$(window).scroll(function(){
	if($(window).scrollTop() >= 200){
		$(".icon").fadeIn(1000);
	}
	else{
		$(".icon").stop(true,true).fadeOut(2000);
	}
});