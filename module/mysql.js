const mysql = require("mysql");

//对外暴露接口
module.exports = function(sql,datas,callback){
	let config = mysql.createConnection({
		host:"localhost",//数据库地址
		user:"root",
		password:"y12345",
		port:"3306",
		database:"node"
	})
	//开始连接
	config.connect();
	//数据库操作
	config.query(sql,datas,(err,data)=>{
		callback &&　callback(err,data);
	})
	//关闭连接
	config.end();
}

