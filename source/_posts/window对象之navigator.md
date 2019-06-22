---
title: window对象之navigator
date: 2018-02-24 11:22:09
category: 前端
tags: [window, javascript]
---

从今天开始会陆续学习window对象的属性，今天先学习`window.navigator`。
`window.navigator`返回一个navigator对象的引用,可以用它来查询一些关于运行当前脚本的应用程序的相关信。
在chrome浏览器中按快捷键`alt + ⌘`打开开发者工具，在console下输入`navigator`、回车，即可打印出`navigator`对象。
<!-- more -->
![](http://wicdn.xiaohongchun.com/xhc-plat/1519441439885_WfktCB4fjm.png)

## 常用属性
- **navigator.userAgent**
返回当前浏览器的user agent字符串。
该属性是`navigatior`对象用的最多的，常用于判断客户端类型
### 判断浏览器类型
```js
function goPAGE() {
    return (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))
}
```
>请注意，navigator的信息可以很容易地被用户修改，所以JavaScript读取的值不一定是正确的。很多初学者为了针对不同浏览器编写不同的代码，喜欢用if判断浏览器版本;正确的方法是充分利用JavaScript对不存在属性返回undefined的特性，直接用短路运算符||计算。

判断浏览器类型:
```js
function getExploreName(){
  var userAgent = navigator.userAgent;
  if(userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1){
    return 'Opera';
  }else if(userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1){
    return 'IE';
  }else if(userAgent.indexOf("Edge") > -1){
    return 'Edge';
  }else if(userAgent.indexOf("Firefox") > -1){
    return 'Firefox';
  }else if(userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1){
    return 'Safari';
  }else if(userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1){
    return 'Chrome';
  }else if(!!window.ActiveXObject || "ActiveXObject" in window){
    return 'IE>=11';
  }else{
    return 'Unkonwn';
  }
}
```
- **navigator.appName**
返回当前浏览器的正式名称,该名称可能是不"正确"的.
- **navigator.appVersion**
返回当前浏览器的版本号,该值可能是不"正确"的.
- **navigator.language**
返回一个字符串,表明当前浏览器的语言种类.
- **navigator.platform**
返回一个字符串,表明当前所使用的系统平台类型.
## 不常用属性
- navigator.appCodeName
返回当前浏览器的内部“代码”名称,该名称可能是不"正确"的.
- navigator.buildID
返回当前浏览器的构建标识符 (例如: "2006090803").
- navigator.connection
提供有关设备的网络连接的信息.
- navigator.cookieEnabled
返回一个布尔值,表明当前浏览器是否启用了cookies.
- navigator.doNotTrack
返回用户配置中do-not-track项的值,如果值为"yes",则网站和应用程序不会跟踪用户.
- navigator.id
返回 `id` 对象,你可以用它来为自己的网站添加对BrowserID的支持.
- navigator.mimeTypes
返回当前浏览器支持的MIME类型列表.
- navigator.mozBattery
返回一个battery 对象,你可以用它来获取自己电脑上的电池的电量情况.
- navigator.mozNotification Mobile Only in Gecko 2.0
- navigator.webkitNotification
返回一个notification 对象,你可以用它来向使用你的web应用程序的用户发送通知.
- navigator.mozTelephony Mobile Only in Gecko
返回一个DOMTelephony 对象,你可以用它来创建和管理手机通话.
- navigator.onLine
返回一个布尔值,表明当前浏览器是否正常联网.
- navigator.oscpu
返回一个字符串,表明当前所使用的操作系统类型.
- navigator.plugins
返回一个包含了浏览器中所有已安装的插件对象的数组.
- navigator.product
返回当前浏览器的产品名称(例如: "Gecko").
- navigator.productSub
返回当前浏览器的构建编号(例如: "20060909").
- navigator.securitypolicy
返回一个空字符串. 在Netscape 4.7x中, 返回"US & CA domestic policy" 或者 "Export policy".
- navigator.vendor
返回当前浏览器的浏览器供应商名称, (例如: "Netscape6")
- navigator.vendorSub
返回当前浏览器的浏览器供应商名称的版本号 (e.g. "6.1").
- navigator.webkitPointer
返回一个Mouse Lock API中的PointerLock对象.

## 方法
- navigator.javaEnabled
表明当前浏览器是否启用了对Java的支持.
- navigator.mozIsLocallyAvailable
检测一个URI资源在脱机状态是否可用.
- navigator.preference 已废弃 Gecko 2.0
设置一个用户配置. 该方法只能在特权代码中使用,目前已经废弃,你应该使用XPCOM Preferences API 来代替.
- navigator.registerContentHandler
允许网站将自己注册成为一个给定MIME类型的内容的处理程序.
- navigator.registerProtocolHandler
允许网站将自己注册成为一个给定协议的处理程序.
- navigator.taintEnabled 已废弃 Gecko 1.7.8 已废弃 Gecko 9.0
返回false. 表明浏览器是否支持taint/untaint功能.已在JavaScript 1.2中删除.
- navigator.vibrate()
如果设备支持震动(手机或其他),则触发设备震动.






