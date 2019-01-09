---
title: window对象之屏幕尺寸相关的属性
date: 2018-03-15 13:12:19
category: javascript
tags: [window, javascript]
---


## `window`对象中屏幕尺寸相关的属性
### `window.screenX` 和 `window.screentY`
返回浏览器窗口左上角相对于屏幕左上角的（0,0)的水平距离和垂直距离， 单位为像素。
<!-- more -->
### `window.innerWidth` 和 `window.innerHeight`
返回当前浏览器窗口可视部分的宽度和高度, 即“视口”（viewport）, 单位像素。
这两个属性包含滚动条的尺寸。
当用户放大网页尺寸的时候，这两个属性的值会变小，因为这时网页的像素大小不变，只是每个像素占据的屏幕空间变大了，因为可见部分（视口）就变小了。

### `window.outerWidth` 和 `window.outerHeight`
返回浏览器窗口的高度和宽度，包括浏览器菜单栏和边框，单位为像素。

### `window.pageXOffset` 和 `window.pageYOffset`
返回页面的水平和垂直滚动距离， 单位为像素。

## `window`对象中屏幕滚动相关的方法

`window`对象中屏幕滚动相关的方法最常用的有`window.scrollTo(x, y)` 和`window.scrollBy(x, y)`， 单位都是像素。

### `window.scrollTo()`
该方法用于将网页的指定位置（参数坐标位置），滚动到浏览器的左上角。参数是相对于整张网页的坐标。
```js
window.scrollTo(0, 1000);
```

### `window.scrollBy()`
该方法用于将网页滚动指定距离。两个参数分别为向右滚动的距离和项下滚动的距离，如果为负值，则向相反的方向滚动。
```js
window.scrollBy(0, window.innerHeight);
```


