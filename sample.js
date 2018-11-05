const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {
    ImageClient
} = require('../image-node-sdk');

//POST请求的包体解析器
var bodyParser = require('body-parser');
app.use(bodyParser());

//引入“表单/文件”上传模块，用于接收微信小程序上传的图片
const formidable = require('formidable');
var form = new formidable.IncomingForm();

//设置上传图片的存放路径，__dirname 是nodejs中的一个全局变量，它的值是当前文件所在的绝对路径，这一句意思是上传的图片放在当前程序文件所在目录下的upload目录。
form.uploadDir = __dirname + "/upload"
let AppId = ''; // 腾讯云 AppId
let SecretId = ''; // 腾讯云 SecretId
let SecretKey = ''; // 腾讯云 SecretKey
app.post("/", (req, res, next) => {
	
	//解析上传过来的表单，上传文件存在回调函数的files参数里
    form.parse(req, function (error, fields, files) {
		//新建腾讯云OCRAPI识别客户端对象，设置设置开发者和应用信息
        let imgClient = new ImageClient({ AppId, SecretId, SecretKey });
		imgClient.ocrHandWriting({//调用腾讯云的通用OCR识别接口,
			formData: {
				image: fs.createReadStream(files.image.path)//指明文件路径
				},
			headers: {
				'content-type': 'multipart/form-data'
				}
			}).then((result) => {
				console.log(result.body)
				res.end(result.body)
			}).catch((e) => {//对异常进行处理
				console.log(e);
			});
    });
});

//处理所有未匹配的请求
app.use((req, res, next) => {
    res.end("0");
});

//监听8000端口
const port = 8000;
app.listen(port);

console.log(`Server listening at http://127.0.0.1:${port}`);
