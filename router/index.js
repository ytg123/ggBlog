const express = require("express"),
	  router = express.Router(),
	  sql = require("../module/mysql"),
	  upload = require("../module/upload");
	  
//首页	  
router.get("/",(req,res)=>{
	//res.send("首页"); res.json()
	//绝对路径
	//res.sendFile(process.cwd()+"/views/index.html");
	//响应ejs模板  文章列表
	sql("select * from article order by id desc limit 0,3",(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		res.locals.ac = "active";
		sql("select * from article",(err,data2)=>{
			res.render("index",{"gg":data,num:data2.length});
		})
	})
});
//分页
router.get("/list-:page.html",(req,res)=>{
	let page = req.params.page;
	sql("select * from article order by id desc limit ?,3",[(page-1)*3],(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		res.locals.ac = "active";
		if(data.length == 0){
			res.render("index",{cont:"暂无数据！"});
		}
		sql("select * from article",(err,data2)=>{
			res.render("index",{"gg":data,num:data2.length});
		})
		
	})
})
//联系我
router.get("/contcat",(req,res)=>{
	if(req.cookies.online){
		//样式
		res.locals.conct = "active";
		//响应ejs模板
		res.render("contact");
	}else{
		res.send("您还没有登录，请您前去登录！<a href='/admin/login'>前去登录</a>");
	}
});
//关于我
router.get("/about",(req,res)=>{
	//样式
	res.locals.abo = "active";
	//响应ejs模板
	res.render("about");
});
//搜索
router.get("/search",(req,res)=>{
	let title = req.query.title;
	sql(`select * from article where title like '%${title}%' order by id desc`,(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		sql("select title,id from article order by id desc limit 0,3",(err,data2)=>{
			res.render("search",{cons:data,lists:data2});
		})
		
	})
});
//文章详情
router.get("/artdetail/:id.html",(req,res)=>{
	let id = req.params.id;
	sql("select * from article where id = ?",[id],(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		if(data.length == 0){
			res.status(404).render("404");
			return;
		}
		//评论列表
		sql("Select userinfo.pic,userinfo.nicname,discuss.content,discuss.time,discuss.id from userinfo Left Join discuss on discuss.uid=userinfo.uid where pid = ? order by time desc",[id],(err,data2)=>{
			if(err){
				res.send("查询失败！");
				return;
			}
			//回复列表
			sql("Select userinfo.pic,userinfo.nicname,reply.content,reply.time,reply.did from userinfo Left Join reply on reply.uid=userinfo.uid where pid = ? order by time desc",[id],(err,data3)=>{
				if(err){
					res.send("查询失败！");
					return;
				}
				res.render("artd",{"gg":data,"pluns":data2,pid:id,"hfus":data3});
			})
			
		})
		
	})
	
});
//评论
router.post("/plun",(req,res)=>{
	let uid = req.body.uid,
			pid = req.body.pid,
			content = req.body.content,
			time = new Date().toLocaleString();
	sql("INSERT INTO `discuss` (`id`,`uid`,`pid`,`content`,`time`) VALUES (0,?,?,?,?)",[uid,pid,content,time],(err,data)=>{
		if(err){
			res.send("发表评论失败！");
			return;
		}
		res.json({
			result:1
		})
	})
	
});
//评论回复
router.get("/reply/:id/:pid/:did",(req,res)=>{
	let uid = req.params.id,
			pid = req.params.pid,
			did = req.params.did;
	res.render("reply",{uid:uid,pid:pid,did:did});
});
//回复内容
router.post("/rep",(req,res)=>{
	let uid = req.body.uid,
			pid = req.body.pid,
			did = req.body.did,
			reply = req.body.reply,
			time = new Date().toLocaleString();
	sql("INSERT INTO `reply` (`id`,`uid`,`pid`,`content`,`time`,`did`) VALUES (0,?,?,?,?,?)",[uid,pid,reply,time,did],(err,data)=>{
		if(err){
			res.send("回复失败！");
			return;
		}
		res.json({
			result:1,
			pid:pid
		})
	})
});
//收藏
router.get("/colect",(req,res)=>{
	let pid = req.query.pid,
			uid = req.query.uid;
	sql("select colect from article where id = ?",[pid],(err,data)=>{
		if(err){
			res.send("收藏失败！");
			return;
		}
		let colect = data[0].colect;
		if(colect == 0){
			sql("update article set colect = 1,uid=? where id = ?",[uid,pid],(err,data2)=>{
				if(err){
					res.send("收藏失败！");
					return;
				}
				res.json({
					result:1
				})
			})
		}else{
			sql("update article set colect = 0,uid=? where id = ?",[null,pid],(err,data2)=>{
				if(err){
					res.send("收藏失败！");
					return;
				}
				res.json({
					result:0
				})
			})
		}
	})
});
//我的收藏
router.get("/mycolc/:uid",(req,res)=>{
	let uid = req.params.uid;
	sql("select title,id,img from article where colect = 1 and uid = ?",[uid],(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		res.render("mycolec",{scs:data});
	})
	
})
//个人中心
router.get("/pcenter",(req,res)=>{
		res.render("pcenter");
});
//个人信息
router.post("/upmine",upload.single("txpic"),(req,res)=>{
	let pic = req.file.filename,
			nicname = req.body.nicname,
			sex = req.body.sex,
			uid = req.body.uid;
	sql("select * from userinfo where uid = ?",[uid],(err,data)=>{
		if(err){
			res.send("查询失败！");
			return;
		}
		if(data.length == 0){
			sql("INSERT INTO `userinfo` (`id`,`pic`,`nicname`,`sex`,`uid`) VALUES (0,?,?,?,?)",[pic,nicname,sex,uid],(err,data2)=>{
				if(err){
					res.send("添加失败！");
					return;
				}
				res.render("pcenter");
			})
		}else{
			sql("update `userinfo` set `pic`=?,nicname=?,sex=? where `uid`=?",[pic,nicname,sex,uid],(err,data3)=>{
				if(err){
					res.send("修改失败！");
					return;
				}
				res.render("pcenter");
			})
		}
	})
})
module.exports = router;
