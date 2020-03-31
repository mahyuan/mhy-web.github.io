---
title: dispatchEvent的用法
category: 前端
tags:
  - javascript
  - dispatchEvent
  - Event
date: 2018-05-04 11:58:31
description: "javascript 浏览器事件，dispatchEvent事件触发器"
---

浏览器事件一般被称为DOM事件，通常的用法是给某个DOM元素添加事件。浏览器中原生的DOM事件有很多，最常用的有以下几大类：鼠标事件、键盘事件、框架/对象事件、表单事件、剪切板事件、打印事件、多媒体事件、动画事件等。每一类都有若干个DOM事件。
前端最常用的是鼠标事件和键盘事件，比如鼠标点击、键盘键入、移动端的touch等，Web页面与用户交互是通过DOM事件来完成的。
最常用的事件列表这里不在罗列，可以在[www.runoob.com][www.runoob.com]上查。之前总结过[DOM事件][事件]方面的知识，本文想说的是自定义事件的使用.

<!-- more -->
创建事件的方式早期的有`createEvent()`，但是目前已经过时了，现在常用的方式是使用构造函数的方式来创建事件。

事件触发一般通过用户在页面上的操作触发，但是也可以通过事件触发器来实现。在一些特殊情况下，用事件触发器来触发事件比用户的实际操作来触发事件更方便。

触发事件每种浏览器都有原生的方式，IE支持`fireEvent()`方法触发事件，标准浏览器都支持`dispatchEvent()`方法。
简单介绍一下`fireEvent()`方式吧，下面是一段prototype.js的源码：
```js
var fireEvent = function fireEvent(element,event){
    if (document.createEventObject){
        // IE浏览器支持fireEvent方法
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt)
    }
    else{
        // 其他标准浏览器使用dispatchEvent方法
        var evt = document.createEvent( 'HTMLEvents' );

        // initEvent接受3个参数：
        // 事件类型，是否冒泡，是否阻止浏览器的默认行为
        evt.initEvent(event, true, true);
        return !element.dispatchEvent(evt);
    }
};
```
## dispatchEvent 事件触发器

* 早期的创建事件的方式：
```js
var event = document.createEvent('Event'); // 一个参数， 表示事件类型
event.initEvent('build', true, true); // 三个参数，eventName事件类型、canBubble是否冒泡、preventDefault是否阻止事件的默认操作
document.dispatchEvent(event) // 参数为事件对象
```

* 构造函数方式
```js
var event = new Event('build');

//监听事件
document.addEventListener('build', function (e) {
  // e.target matches document from above
}, false);

// 触发事件
document.dispatchEvent(event);
```

再举个可以给事件传值的例子，可以将触发事件定义在一个方法内:
```js
let obj = {
    name: 'mhy',
    age: 23
}
let evt = new Event('haha')
function handler(e) {
    let o = e.eventBody
    console.log('addevt', o)
    console.log('evt', evt)
}
document.addEventListener('haha', handler, false)
function disPatchEvt(obj) {
  evt.eventBody = obj
  document.dispatchEvent(evt, obj)
}
disPatchEvt(obj)
```
以上例子中所传的数据可以是任任意类型的数据，通过这种方法基本可以满足任意标准浏览器环境下通过自定义事件的需求。

[事件]:http://mhynet.cn/2017/09/04/%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86%E7%A8%8B%E5%BA%8F/
[www.runoob.com]:http://www.runoob.com/jsref/dom-obj-event.html


