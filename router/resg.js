const express = require("express"),
	  router = express.Router(),
	  sql = require("../module/mysql"),
	  crypto = require("crypto");

//响应模板
router.get("/",(req,res)=>{
	res.render("./admin/resg");
})
/*router.get("/resg",(req,res)=>{
	let username = req.query.username,
		  password = req.query.pwd;
	sql("INSERT INTO `user` (`id`,`username`,`password`) VALUES (0,?,?)",[username,password],(err,data)=>{
		res.render("./admin/login");
	})
})*/
//注册功能
router.post("/",(req,res)=>{
	let username = req.body.username,
		  password = req.body.pwd,
		  md5 = crypto.createHash("md5");
	sql("select * from user where username = ?",[username],(err,data)=>{
		if(err){
			res.send("查询出错！");
			return;
		}
		//判断用户是否存在
		if(data.length == 0){
			//给密码加密
			let newpwd = md5.update(password).digest("hex");
			sql("INSERT INTO `user` (`id`,`username`,`password`,`admin`) VALUES (0,?,?,?)",[username,newpwd,0],(err,data)=>{
				if(err){
					res.send("注册出错！<a href='/admin/reg'>返回注册页</a>");
					return;
				}
				res.render("./admin/login");
			})
		}else{
			res.send("该用户已注册！<a href='/admin/reg'>返回注册页</a>");
		}
	})
	
})
module.exports = router;