let http = require("http");

//get请求

/*http.get("http://yangtengguang.com",(res)=>{
	//res.on() 监听  有数据时触发
	let html = "";
	res.on("data",(data)=>{
		html += data;
	});
	
	//完成时触发
	res.on("end",()=>{
		console.log(html);
	})
})*/
let obj = {
	hostname:"yangtengguang.com",
	path:"/admin",
	port:"80"
}
http.get(obj,(res)=>{
	//res.on() 监听  有数据时触发
	let html = "";
	res.on("data",(data)=>{
		html += data;
	});
	
	//完成时触发
	res.on("end",()=>{
		console.log(html);
	})
})
