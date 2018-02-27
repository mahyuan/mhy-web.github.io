---
title: window对象之screen
date: 2018-02-28 12:49:02
category: javascript
tags: [window, javaScript]
---
`window.screen`返回当前window的screen对象。screen对象实现了Screen接口，它是个特殊的对象，返回当前渲染窗口中和屏幕有关的属性。

- screen.availWidth - 可用的屏幕宽度
screen.availWidth 属性返回访问者屏幕的宽度，以像素计，减去界面特性，比如窗口任务栏。
- screen.availHeight - 可用的屏幕高度
screen.availHeight 属性返回访问者屏幕的高度，以像素计，减去界面特性，比如窗口任务栏。

|属性|	说明|
|:---|:-------|
|availHeight |返回屏幕的高度（不包括Windows任务栏）|
|availWidth |返回屏幕的宽度（不包括Windows任务栏）|
|colorDepth |返回目标设备或缓冲器上的调色板的比特深度|
|height|返回屏幕的总高度|
|pixelDepth |返回屏幕的颜色分辨率（每象素的位数）|
|width |返回屏幕的总宽度|






