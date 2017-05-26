const express = require("express"),
	  router = express.Router(),
	  sql = require("../module/mysql"),
	  crypto = require("crypto"),
	  upload = require("../module/upload");

router.get('/',(req,res)=>{
	if(req.cookies.online && req.session.admin == 1){
			//样式
			res.locals.active = "active";
			sql("select  * from reader",(err,data)=>{ 
				res.render("./admin/index",{admin:req.session.admin,count:data});
			})
			
	}else{
		  sql("select * from article order by id desc limit 0,5",(err,data)=>{
				if(err){
					res.send("查询失败！");
					return;
				}
				res.locals.ac = "active";
				sql("select * from article",(err,data2)=>{
					res.render("index",{"gg":data,num:data2.length});
				})
			})
	}
})
//注册
router.use("/reg",require("./resg"));
//登录
router.use("/login",require("./login"));
//退出
router.use("/logout",(req,res)=>{
	res.clearCookie("online");
	//样式
	res.locals.active = "active";
	//返回首页  重定向
	res.redirect("/");
});
//用户管理 
router.use("/user",(req,res)=>{
	sql("select * from user order by id desc",(err,data)=>{
			if(err){
				res.send("查询失败");
				return;
			}
			//样式
			res.locals.hac = "active";
			res.render("./admin/user",{users:data});
	})
});
//用户删除
router.get("/delete",(req,res)=>{
	let id = req.query.id;
	sql("DELETE FROM user WHERE id = ?",[id],(err,data)=>{
			if(err){
				res.send("删除失败");
				return;
			}else{
				res.json({
					result:1
				})
			}
	})
});
//用户修改
router.post("/update",(req,res)=>{
	let id = req.body.id,
			username = req.body.username,
			admin = req.body.admin;
	sql("update user set username=?,admin=? where `id`=?",[username,admin,id],(err,data)=>{
		if(err){
				res.send("修改失败");
				return;
			}else{
				res.json({
					result:1
				})
			}
	})
})
//修改密码 
router.post("/udsecret",(req,res)=>{
		let useru = req.body.username,
				pwd = req.body.password,
				md5 = crypto.createHash("md5"),
				newpwd = md5.update(pwd).digest('hex');
		sql("update user set password=? where username=?",[newpwd,useru],(err,data)=>{
			if(err){
					res.send("修改失败");
					return;
				}else{
					res.json({
						result:1
					})
				}
		})
});

//发布文章  响应模板
router.get("/article",(req,res)=>{
		//样式
		res.locals.article = "active";
		sql("select * from article order by id desc",(err,data2)=>{
			if(data2.length == 0){
				res.send("暂无文章！");
				return;
			}
			res.render("./admin/article",{ress:data2});
		})
		
});
//图片上传
router.post("/uploadd",upload.single("wulv"),(req,res)=>{
	let pic = req.file.filename,
			id = req.body.mid;
	sql("update article set img=? where id=?",[pic,id],(err,data2)=>{
				if(err){
					res.send("上传失败");
					return;
				}
				sql("select * from article order by id desc",(err,data2)=>{
					if(data2.length == 0){
						res.send("暂无文章！");
						return;
					}
					res.render("./admin/article",{ress:data2});
				})
	})
})
//发布文章
router.post("/sendart",(req,res)=>{
	let title = req.body.title,
			tab = req.body.tab,
			author = req.body.author,
			con = req.body.content,
			time = new Date().toLocaleString().substring(0,10);
			sql("INSERT INTO `article` (`id`,`title`,`tab`,`author`,`content`,`time`,`colect`) VALUES (0,?,?,?,?,?,0)",[title,tab,author,con,time],(err,data)=>{
				if(err){
					res.send("发布失败");
					return;
				}else{
					res.json({
						result:1
					})
				}
				
			})
});
//导航管理
router.get("/nav",(req,res)=>{
	//样式
	res.locals.nav = "active";
	res.render("./admin/nav");
});
//添加导航
router.post("/navcon",(req,res)=>{
	let title = req.body.navcon,
			url = req.body.navurl;
	sql("INSERT INTO `nav` (`id`,`title`,`url`) VALUES (0,?,?)",[title,url],(err,data)=>{
		if(err){
			res.send("添加失败！");
			return;
		}
		res.json({
			result:1
		})
	})
});
//banner
router.get("/banner",(req,res)=>{
	//样式
	res.locals.ban = "active";
	res.render("./admin/banner");
});
//内容
router.post("/bancon",upload.single("banpic"),(req,res)=>{
	let pic = req.file.filename,
			title = req.body.bantitle,
			content = req.body.bancon;
	sql("select * from banner",(err,data)=>{
		if(err){
			res.send("查詢失敗");
			return;
		}
		if(data.length == 0){
			sql("INSERT INTO `banner` (`id`,`title`,`content`,`pic`) VALUES (0,?,?,?)",[title,content,pic],(err,data2)=>{
				if(err){
					res.send("添加失敗");
					return;
				}
				res.render("./admin/banner");
			})
		}else{
			sql("update `banner` set title=?,content=?,pic=? where id = 1",[title,content,pic],(err,data3)=>{
				if(err){
					res.send("修改失敗");
					return;
				}
				res.render("./admin/banner");
			})
		}
	})
})
module.exports = router;