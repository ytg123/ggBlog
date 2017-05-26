const express = require("express"),
	  router = express.Router(),
	  sql = require("../module/mysql"),
	  crypto = require("crypto");

//响应模板
router.get("/",(req,res)=>{
	res.render("./admin/login");
});
//登录功能
router.post("/",(req,res)=>{
	let username = req.body.username,
			password = req.body.password,
			md5 = crypto.createHash("md5");
	sql("select * from user where username = ?",[username],(err,data)=>{
		if(err){
			res.send("网络出现错误，请稍后重试！");
			return;
		}
		//判断用户名是否存在
		if(data.length == 0){
			res.send("用户名不存在");
			return;
		}
		//加密
		let newpwd = md5.update(password).digest("hex");
		if(data[0].password == newpwd){
				//保存用户名   参数：名称   数据   时间
				res.cookie("online",{username:username},{maxAge:1000*60*60*24});
				res.cookie("uid",{uid:data[0].id},{maxAge:1000*60*60*24});
				//保存管理员状态
				req.session.admin = data[0].admin;
				res.json({
					result:1
				})
		}else{
				res.json({
					result:0
				})
		}
	})
})
module.exports = router;