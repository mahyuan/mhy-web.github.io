---
title: cssText批量修改dom的样式
category: 前端
tags:
  - javascript
  - css
date: 2019-11-26 11:09:34
description: "使用cssText批量修改dom样式, 性能和兼容性都超级棒！"
---

之前用js修改dom的样式一般都是采用以下的方式：
```js
const element = this.$refs.target;
element.style.width = '200px';
element.style.height = '100px';
element.style.color = 'red';
```
样式不多的话，性能还可以，但是如果样式特别多，或者涉及到动画的时候，性能会不太理想。前者每一次设置都会reflow一次，后者之后reflow一次。
早上阅读某开源框架的源码时发现了一种用js覆写css的方式，查阅之后发现兼容性和性能都超级棒，这里记录一下以加深记忆。

## 功能和语法
MDN介绍:
> The cssText property of the CSSStyleDeclaration interface returns or sets the text of the element's inline style declaration only. To be able to set a stylesheet rule dynamically, see Using dynamic styling information.


语法：
```js
const element = this.$refs.target;
// 获取内联样式,好像只能获取到内联样式，写在style标签和css文件中的样式需要使用 window.getComputedStyle 获取
alert(element.style.cssText)
// 覆写样式
element.style.cssText = 'width:200px;height:100px;color:red;';
```
使用`cssText`会覆盖之前的所有样式，所以如果要保留之前的样式，则需要先获取到已有样式，然后追加新样式。

### 兼容性
各浏览器目前都兼容（包括IE6,7,8）`cssText`的方式设置样式，但是在IE下，累加的时候回丢失之前的样式中最后一个`;`， 所有需要做一下兼容，可以采用正则的方式对获取到的已有样式进行匹配。
获取已有属性可以用`window.getComputedStyle`，IE浏览器用`document.currentStyle`，此API仅用来覆写样式即可。

### 使用示例
```js
// 获取原有样式, IE 用 dom元素.currentStyle 火狐谷歌用window.getComputedStyle(dom, null)
const getStyle = (function(){
  if(window.document.currentStyle) {
    return (dom, attr) => dom.currentStyle[attr];
  } else {
    return (dom, attr) => getComputedStyle(dom, false)[attr];
  }
})()

const element = document.querySelecter('#target');
let widthExists = getStyle(element, 'width');
// 去除px
let width = Number(widthExists.replace(/\%/g, ''));
element.style.cssText += `;width: ${widthExists + 200}px;`
```

这里用到了`getComputedStyle和currentStyle`，其中`currentStyle`是IE浏览器的API，`getComputedStyle`是google等主流浏览器都支持的获取已有样式的接口。
该方法有两个参数，第一个参数是要获取样式的dom节点，第二个参数一般可设置为 `null`或`fasle`，仅在获取伪类元素时传入伪类的值，返回值是一个只读的对象，里面包含了该dom元素的样式。

```html
<style>
    h3::after {
        content: "rocks!";
    }
</style>

<h3>generated content</h3>

<script>
    let h3 = document.querySelector('h3'),
    result = getComputedStyle(h3, '::after').content;
    alert(`the generated content is: ${result}`);
    console.log(`the generated content is: ${result}`);
    // the generated content is: "rocks!"
</script>
```
