---
title: CSS3动画--转不停的骰子
date: 2017-11-16 20:26:37
category: 前端
tags:
  - css
  - 动画
  - transform
description: "css旋转动画，转不停的骰子"
---
- [最终效果](http://mhynet.cn/HomeWorks/projects/3D_transform/index.html)
- [参考代码](https://github.com/mhy-web/HomeWorks/blob/master/projects/3D_transform/index.html)
按照以下步骤就可以实现。

### 1.建立容器和6个面:

最外面的 `<div class="wrap"></div>` 用于整个结构在页面中的布局，以及设置观察者与z=0平面的距离，使具有三维位置变换的元素产生透视效果。z>0的三维元素比正常大，而z<0时则比正常小，大小程度由该属性的值决定。
  `<div class="content"></div>`是6个面的父容器，限制6个面的大小和位置。同时，旋转动画也设置在该容器上。

<!-- more -->
```html
<div class="wrap">
  <div class="content">
    <div class="box front"></div>
    <div class="box left"></div>
    <div class="box right"></div>
    <div class="box back"></div>
    <div class="box top"></div>
    <div class="box bottom"></div>
  </div>
</div>
```
设置样式
```css
.wrap{
    width: 200px;
    height: 200px;
    position: relative;
    margin: 100px auto;
    perspective: 1200px;
}
.content{
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    transform: translateZ(100px) rotateY(45deg) rotateZ(45deg) rotateX(90deg);
}
.box{
    display: block;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius:50px;
    transform-style: preserve-3d;
}
.front{
    transform: translateZ(100px);
    background: #7FFF00;
}
.back{
    transform: rotateY(180deg) translateZ(100px);
    background: #00FFFF;
}
.left{
    transform: rotateY(-90deg) translateZ(100px);
    background: #DC143C;
}
.right{
    transform: rotateY(90deg) translateZ(100px);
    background: #808000;
}
.top{
    transform: rotateX(90deg) translateZ(100px);
    background: #EE82EE;
}
.bottom{
    transform: rotateX(-90deg) translateZ(100px);
    background: #FFFF00;
}

```
### 2.容器设置旋转动画：
```css
.content{
    /* ... */
    animation: rotating 4s linear infinite;
}
@keyframes rotating{
    0%{
    transform:translateZ(100px) rotateY(0deg) rotateZ(0deg) rotateX(0deg);
    }
    100%{
    transform:translateZ(100px) rotateY(360deg) rotateZ(360deg) rotateX(360deg);
    }
}
```
### 3.各个面设置点数
按1~6的顺序给对应的面的div加入点数。完成后的html应该是这样的：
```html
<div class="wrap">
  <div class="content">
    <div class="box front">
        <div class="item-ct">
            <div class="item"></div>
        </div>
    </div>
    <div class="box left">
        <div class="item-ct">
            <div class="item"></div>
            <div class="item"></div>
        </div>
    </div>
    <div class="box right">
        <div class="item-ct">
            <div class="item"></div>
            <div class="item"></div>
            <div class="item"></div>
        </div>
    </div>
    <div class="box back">
        <div class="item-ct">
            <div class="column">
              <div class="item"></div>
              <div class="item"></div>
           </div>
           <div class="column">
              <div class="item"></div>
              <div class="item"></div>
            </div>
        </div>
    </div>
    <div class="box top">
        <div class="item-ct">
            <div class="column">
              <div class="item"></div>
              <div class="item"></div>
           </div>
           <div class="column">
              <div class="item"></div>
           </div>
           <div class="column">
              <div class="item"></div>
              <div class="item"></div>
            </div>
        </div>
    </div>
    <div class="box bottom">
        <div class="item-ct">
            <div class="column">
              <div class="item"></div>
              <div class="item"></div>
              <div class="item"></div>
           </div>
           <div class="column">
              <div class="item"></div>
              <div class="item"></div>
              <div class="item"></div>
            </div>
        </div>
    </div>
  </div>
</div>
```
对应的样式如下：
```css
.item{
    width:50px;
    height:50px;
    border-radius: 50%;
}
.item-ct{
    position:absolute;
    left:20px;
    top:20px;
    right:20px;
    bottom:20px;
    display:flex;
    transform-style:preserve-3d;
}
.front .item-ct{
    justify-content:center;
    align-items:center;
}
.left .item-ct{
    justify-content:space-between;
    align-items:flex-start;
}
.left .item:nth-child(2){
    align-self:flex-end;
}
.right .item-ct{
    justify-content:space-between;
}
.right .item:nth-child(2){
    align-self:center;
}
.right .item:nth-child(3){
    align-self:flex-end;
}
.back .item-ct{
    flex-wrap:wrap;
    align-content:space-between;
}
.column{
    display: flex;
    flex-basis: 100%;
}
.back .column:nth-child(1){
    align-items:flex-start;
    justify-content:space-between;
}
.back .column:nth-child(2){
    justify-content:space-between;
    align-items:flex-end;
}
.top .item-ct{
    flex-wrap:wrap;
    align-content:space-between;
}
.top .column:nth-child(1){
    justify-content:space-between;
    align-items:flex-start;
}
.top .column:nth-child(2){
    justify-content:center;
    align-items:center;
    height:20px;
}
.top .column:nth-child(3){
    justify-content:space-between;
    align-items:flex-end;
}
.bottom .item-ct{
    flex-wrap:wrap;
    align-content:space-between;
}
.bottom .column:nth-child(1){
    justify-content:space-between;
    align-items:flex-start;
}
.bottom .column:nth-child(2){
    justify-content:space-between;
    align-items:flex-end;
}
```
设置点数部分的css布局使用的是flex，如果使用grid布局，html结构可能会更简洁一些，你可以试一下。

### 4.给每个点数设置颜色渐变动画

这部分代码只有css：
```css
.item{
    /* ... */
    animation: shineChange 4s linear infinite;
}
@keyframes shineChange {
    from {
        background-color: #4169E1 ;
        box-shadow:inset 0 0 25px #416981;
    }
    50% {
        background-color:  #FFA500;
        box-shadow: inset 0 0 70px #ddA590;
    }
    to {
        background-color: #4169E1 ;
        box-shadow:inset 0 0 25px #416981;
    }
}
```
以上就是使用CSS3实现旋的介绍，文中的方案使用的是固定尺寸、flex布局，还有优化的空间。
