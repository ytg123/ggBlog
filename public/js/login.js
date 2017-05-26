jQuery(".banner").slide({
	titCell: ".hd ul",
	mainCell: ".bd ul",
	effect: "fold",
	autoPlay: true,
	autoPage: true,
	trigger: "click"
});
//验证码
var code;
function change(objj){
	code = "";
	var len = 4;
	var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 
      'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','北','京','欢','迎','您'];
	for(var i = 0;i<len;i++){
		var h = Math.floor(Math.random()*57);
		code += arr[h];
	}
	objj.innerHTML = code;
};
var sjyzm = document.getElementById("sjyzm");
change(sjyzm);
function clickme(obj){
	change(obj)
};
//登录
$("#send-btn").click(function(){
	log();
});
//键盘控制
$("window").keyup(function(e){
	let ev = e || window.event;
	if(ev.keyCode == 13){
		log();
	}
})
function log(){
	let user = $("#username").val(),
		pwd = $("#password").val(),
		yzm = $("#yzm").val();
	if(user == ""){
		alert("用户名不能为空！");
	}else if(pwd == ""){
		alert("密码不能为空！");
	}else if(yzm == ""){
		alert("验证码不能为空！");
	}else{
		if(yzm.toUpperCase() != code.toUpperCase()){
			alert("您输入的验证码不匹配，请您重新输入！");
			change(sjyzm);
		}else{
			$.ajax({
				type:"post",
				url:"/admin/login",
				data:{
					username:user,
					password:pwd
				},
				async:true,
				dataType:"json",
				success:function(data){
					if(data.result ==1){
						location.href = "/admin";
					}else{
						alert("登录失败，请重新登录！");
						change(sjyzm);
					}
				},
				error:function(data){
					alert(data.responseText);
					location.href = "/admin/reg";
				}
			});
		}
		
	}
}

//修改密码
$("#subm").click(function(){
	let useru = $("#useru").val(),
		pwd = $("#pwd").val();
	if(useru == ""){
		alert("用户名不能空！");
	}else if(pwd == ""){
		alert("密码不能为空！");
	}else{
		$.ajax({
			type:"post",
			url:"/admin/udsecret",
			dataType:"json",
			data:{
				username:useru,
				password:pwd
			},
			async:true,
			success:function(data){
				if(data.result == 1){
					location.href = "/admin/login";
				}
			},
			error:function(data){
				alert(data.responseText);
				location.href = "/admin/login";
			}
		});
	}
});
