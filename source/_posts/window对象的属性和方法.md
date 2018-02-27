---
title: window对象的属性和方法
date: 2018-02-25 10:12:19
category: javascript
tags: [window, javascript]
---

在JavaScript语言中，DOM( Document Object Model) 是操作文档的API，document 是其的一个对象；而BOM是控制浏览器行为的API，window 是其的一个对象。

![](https://pic4.zhimg.com/80/0c273417eb835e0700bbe2ea7ce4c4bb_hd.jpg)

[引用知乎上的解释](https://www.zhihu.com/question/33453164),整个窗口中分为几个区域，其中：

1. DOM管辖区域：
E区归DOM管，是根据开发出来的网站文档（html,css,javascript）等渲染出来的页面。
2. BOM管辖区域
其余的几个区域都归BOM管。
    - A区：浏览器的地址栏、标签栏、搜索栏、书签栏、菜单栏等。
    - B区：浏览器右键菜单。
    - C区：状态栏，document加载时显示http状态等信息。
    - D区：滚动条。
## BOM
>BOM 是浏览器对象模型，window是BOM的一个对象，window对象下有很多子对象，一起控制浏览器的行为。在浏览器中window对想为global对象。

![](https://pic3.zhimg.com/80/v2-818759383c05737f5c626d7cd634e8ee_hd.jpg)

window 对象表示一个包含DOM文档的窗口，其 document 属性指向窗口中载入的 DOM文档 。使用 document.defaultView 属性可以获取指定文档所在窗口。




