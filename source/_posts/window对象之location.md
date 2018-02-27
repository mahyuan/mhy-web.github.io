---
title: window对象之location
date: 2018-02-25 00:21:28
category: 技术
tags: [window, JavaScript]
---
window.location 只读属性，返回一个 Location  对象，其中包含有关文档当前位置的信息。
>window.location : 所有字母必须小写！
尽管 window.location 是一个只读 Location 对象，你仍然可以赋给它一个 DOMString。这意味着您可以在大多数情况下处理 location，就像它是一个字符串一样：window.location = 'http://www.example.com'，是 window.location.href = 'http://www.example.com'的同义词 。
<!-- more -->
可以用location.href获取。要获得URL各个部分的值，可以这么写：
```js
location.protocol; // 'http'
location.host; // 'www.example.com'
location.port; // '8080'
location.pathname; // '/path/index.html'
location.search; // '?a=1&b=2'
location.hash; // 'TOP'
```
要加载一个新页面，可以调用
```js
location.assign(url)
location.href  = url
```
如果要重新加载当前页面，调用location.reload()方法非常方便。
- window.location.search

## 方法
- reload() 
重新加载页面
- assign()
加载新文档
```js
- location.assign('https://developer.mozilla.org/zh-CN/docs/Web/API/Window/location')
```
- replace()
使用新文档替换当前文档
