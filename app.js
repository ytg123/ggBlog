
//express框架创建服务器
const http = require("http"),
	  express = require("express"),
	  app = express(),
	  bodyParset = require("body-parser"),
	  cookiePerser = require("cookie-parser"),
	  sessionPerser = require("express-session"),
	  sql = require("./module/mysql"),
	  ws  = require("socket.io");
	  
//设置模板引擎目录
app.set("views",__dirname+"/views");
//模板引擎类型
app.set("view engine","ejs");
//静态资源目录
app.use(express.static(__dirname+"/public"));

//获取post方式的值  json
app.use(bodyParset.json());
app.use(bodyParset.urlencoded({extended:true}));

//设置cookieParser   秘钥
app.use(cookiePerser("wulv"));

//设置 session
app.use(sessionPerser({secret:"gg"}));

//富文本编辑器
app.use('/ueditor/ue',require('./ue'));

//自定义方法
app.use(function(req,res,next){
	  //判断用户是否处于登录状态
		if(req.cookies.online){
			res.locals.user = req.cookies.online.username;
			res.locals.uid = req.cookies.uid.uid;
			res.locals.ip = req.ip;
			sql("select * from userinfo where uid = ?",[req.cookies.uid.uid],(err,data)=>{
				if(data.length != 0){
						res.locals.pic = data[0].pic;
						res.locals.nicname = data[0].nicname;
				}
			})
			//统计浏览记录
			sql("select * from reader",(err,data)=>{
				if(data.length != 0){
					let time = new Date().toLocaleString();
					sql("INSERT INTO `reader` (`id`,`time`,`username`) VALUES (0,?,?)",[time,req.cookies.online.username],(err,data2)=>{
						if(err){
							res.send("添加失败！");
							return;
						}
					})
				}
			});
		}else{
			//统计浏览记录
			sql("select * from reader",(err,data)=>{
				if(data.length != 0){
					let time = new Date().toLocaleString();
					sql("INSERT INTO `reader` (`id`,`time`,`username`) VALUES (0,?,?)",[time,req.ip],(err,data2)=>{
						if(err){
							res.send("添加失败！");
							return;
						}
					})
				}
			});
		}
		
		
		//导航
		/*sql("select title,url from nav",(err,data)=>{
			if(data.length != 0){
				res.locals.navs = data;
			}
		});*/
		//banner
		/*sql("select title,content,pic from banner",(err,data)=>{
			if(data.length != 0){
				res.locals.bans = data;
			}
		});*/
		
		//判断管理员状态是否存在
		if(req.cookies.online && !req.session.admin){
			sql("select * from user where username = ?",[res.locals.user],(err,data)=>{
				res.locals.admin = Number(data[0].admin);
				//继续执行
	  		next();
			})
		}else{
			//继续执行
	  	next();
		};
		
});
//前台页面
app.use("/",require("./router/index"));
//后台页面
app.use("/admin",require("./router/admin"));
let server = http.createServer(app).listen(80);
//监听服务器
let io = ws(server);
let	usernum = 0,
		userlist = {};
//io.on()监听事件
io.on("connection",socket =>{
		
		//加入聊天室
		socket.on("login",(data)=>{
			//用户列表
			userlist[data.uid] = data.user;
			//保存名字
			socket.user = data.user;
			socket.uid = data.uid;
			usernum++;
			data.num = usernum;
			io.emit("join",{u:data,ulist:userlist});
			
		})
		//io.emit("名称"，"数据")
		socket.on("con",(data)=>{
			io.emit("em",{gg:data.con,name:socket.user,time:new Date().toLocaleString()});
		})
		//退出聊天室
		socket.on("disconnect",()=>{
			delete userlist[socket.uid];
			usernum--;
			io.emit("esc",{name:socket.user,num:usernum,ulist:userlist});
		})
})















//项目的总入口     node 基于chrome v8引擎  由c++编写的javascript运行环境   使用了一个事件驱动、非阻塞式 I/O 的模型
//console.log(__filename);//文件路径
//console.log(__dirname);//文件目录
//console.log(process.cwd());//node工作进程目录

//安装好node就有的模块   http
/*const http = require("http");
http.createServer((req,res)=>{
	//响应头部
	res.writeHeader(200,{"Content-Type":"text/html"});
	//响应结束
	res.end("Hello Beijing!");
}).listen(8080);*/