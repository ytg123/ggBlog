const multer = require("multer"),
	  path = require("path");
	  
//图片上传  路径
let storage = multer.diskStorage({
	//上传路径
	destination:path.join(process.cwd(),"public"),
	//重命名
	filename:function(req,file,cb){
		var filename = (file.originalname).split(".")[1];
		cb && cb(null,`${Date.now()}.${filename}`)
	}
});
/*let fileFilter = function(req,file,cb){
	//限定上传类型
	if(file.mimetype == "imgage/gif"){
		cb && cb(null,false)
	}
}*/
let upload = multer({
	storage:storage,
	//fileFilter:fileFilter
});

module.exports = upload;