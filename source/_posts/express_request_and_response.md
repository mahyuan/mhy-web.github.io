---
title: express之request和response对象
category: javascript
tags:
	- javascript
	- node
date: 2018-12-25 21:37:53
---
express是基于Node搭建web应用的框架，使用express可以快速的搭建一个网站，express的和核心功能有以下三点：
- 可以设置中间件来响应 HTTP 请求。
- 定义了路由表用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。

<!-- more -->

## request 和 response 对象的具体介绍：

### Request 对象

- request 对象表示 HTTP 请求，包含了请求查询字符串，参数，内容，HTTP 头部等属性。

常见属性有：
- req.app：当callback为外部文件时，用req.app访问express的实例
- req.baseUrl：获取路由当前安装的URL路径
- req.body / req.cookies：获得「请求主体」/ Cookies
- req.fresh / req.stale：判断请求是否还「新鲜」
- req.hostname / req.ip：获取主机名和IP地址
- req.originalUrl：获取原始请求URL
- req.params：获取路由的parameters
- req.path：获取请求路径
- req.protocol：获取协议类型
- req.query：获取URL的查询参数串
- req.route：获取当前匹配的路由
- req.subdomains：获取子域名
- req.accepts()：检查可接受的请求的文档类型
req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages：返回指定字符集的第- 一个可接受字符编码
- req.get()：获取指定的HTTP请求头
- req.is()：判断请求头Content-Type的MIME类型

### Response 对象
- response 对象表示 HTTP 响应，即在接收到请求时向客户端发送的 HTTP 响应数据。

常见属性有：
- res.app：同req.app一样
- res.append()：追加指定HTTP头
- res.set()在res.append()后将重置之前设置的头
- res.cookie(name，value [，option])：设置Cookie
- opition: domain / expires / httpOnly / maxAge / path / secure / signed
- res.clearCookie()：清除Cookie
- res.download()：传送指定路径的文件
- res.get()：返回指定的HTTP头
- res.json()：传送JSON响应
- res.jsonp()：传送JSONP响应
- res.location()：只设置响应的Location HTTP头，不设置状态码或者close response
- res.redirect()：设置响应的Location HTTP头，并且设置状态码302
- res.render(view,[locals],callback)：渲染一个view，同时向callback传递渲染后的字符串，如果在渲染过程中有错误发生next(err)将会被自动调用。callback将会被传入一个可能发生的错误以及渲染后的- 页面，这样就不会自动输出了。
- res.send()：传送HTTP响应
- res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定- Content-Type
- res.set()：设置HTTP头，传入object可以一次设置多个头
- res.status()：设置HTTP状态码
- res.type()：设置Content-Type的MIME类型

### 路由
```js
var express = require('express');
var app = express();

//  主页输出 "Hello World"
app.get('/', function (req, res) {
   console.log("主页 GET 请求");
   res.send('Hello GET');
})


//  POST 请求
app.post('/', function (req, res) {
   console.log("主页 POST 请求");
   res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
   console.log("/del_user 响应 DELETE 请求");
   res.send('删除页面');
})

//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
   console.log("/list_user GET 请求");
   res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function(req, res) {
   console.log("/ab*cd GET 请求");
   res.send('正则匹配');
})


var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```

### 静态文件
Express 提供了内置的中间件 express.static 来设置静态文件如：图片， CSS, JavaScript 等。

你可以使用 express.static 中间件来设置静态文件路径。例如，如果你将图片， CSS, JavaScript 文件放在 public 目录下，你可以这么写：
```js
app.use(express.static('public'));
```
假设有一张图片/public/images/logo.png，应用添加处理静态文件的功能实例：
```js
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.send('Hello World');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```
用node启动该文件后，在浏览器中访问 http://127.0.0.1:8081/images/logo.png， 即可看到/public/images/logo图片

使用post请求的实例
```js
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})

app.post('/process_post', urlencodedParser, function (req, res) {

   // 输出 JSON 格式
   var response = {
       "first_name":req.body.first_name,
       "last_name":req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})
```
使用中间件向node服务器发送cookie的实例
```js
// express_cookie.js 文件
var express      = require('express')
var cookieParser = require('cookie-parser')
var util = require('util');

var app = express()
app.use(cookieParser())

app.get('/', function(req, res) {
    console.log("Cookies: " + util.inspect(req.cookies));
})

app.listen(8081)
```
### 总结：
express是基于node快速搭建网站的框架，底层实现使用了promise + callback的方式，功能全面。但是比较推荐的是koa2，koa2是koa2.0版本之后的称呼，koa1.0版本使用了generator函数实现，2.0使用了async/await函数实现，非常精简，但是功能并不比Express少，express能做的koa都能做，而且做得更好。不同的是，koa把express的部分功能拆分出去了，使用的时候可以根据需求合理引入中间件，比如koa-router。在上一家公司的时候使用过koa1.0多页面的电商网站，前端项目集成了部分node代码实现页面路由和服务的渲染，体验非常棒，也阅读过公司内部使用koa2.0的后台项目，感觉更友好一些。
本篇博客大部分内容都是摘自[runoob](http://www.runoob.com/nodejs/nodejs-express-framework.html)，不是原创，算是一篇介绍express的笔记吧。
