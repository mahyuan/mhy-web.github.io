---
title: 【转】jQuery 之 .extend()方法使用
date: 2017-08-22 10:36:21
category: 前端
tags:  [jquery, javascript]
stickie: true
description: "jquery extend方法使用介绍"
---

jQuery 的 API 手册中，extend 方法挂载在 jQuery 和 jQuery.fn 两个不同的对象上，但在 jQuery 内部代码实现的是相同的，只是功能各不相同。

<!-- more -->

先看看官方给出的解释：
> - jQuery.extend Merge the contents of two or more objects together into the first object. 把两个或者多个对象合并到第一个对象当中；
> - jQuery.fn.extend Merge the contents of an object onto the jQuery prototype to provide new jQuery instance methods. 把对象挂载到 jQuery 的 prototype 上以扩展一个新的 jQuery 实例方法 。

虽然官方对 jQuery.extend 的扩展方法功能只字未提，但是它也同样具有扩展 jQuery 类方法 的功能。

1. 合并对象

首先，我先来介绍一下 extend 函数在 合并对象 方面的用法。
```js
jQuery.extend(target [, object1] [, objectN])
```

合并 object1 ... objectN 到 target 对象，如果只有一个参数，则该 target 对象会被合并到 jQuery 对象中。
```js
var obj1 = {
    name: 'Tom',
    age: 21
}

var obj2 = {
    name: 'Jerry',
    sex: 'boy'
}

$.extend(obj1, obj2); // {name: "Jerry", age: 21, sex: "boy"}

obj1 // {name: "Jerry", age: 21, sex: "boy"}
obj2 // {name: "Jerry", sex: "boy"}
```
上述代码展示的是将 obj2 对象合并到 obj1 对象中，这种方法会 改变 obj1 对象的结构。如果你 不想改变 合并目标对象的结构，你可以这么做。

```js
var obj1 = {
    name: 'Tom',
    age: 21
}

var obj2 = {
    name: 'Jerry',
    sex: 'boy'
}

$.extend({}, obj1, obj2); // { name: "Jerry", age: 21, sex: "boy" }

obj1 // { name: "Tom", age: 21 }
obj2 // { name: "Jerry", sex: "boy" }
```

2. 深浅拷贝

```js
jQuery.extend([deep], target, object1 [, objectN])
```
和上面的讲述的不同的是，该方法多了一个类型为 boolean 的 [deep] 传参，当其为 true 时，将 object1 , objectN 深度复制 后合并到 target 中。

首先，我们理解一下什么叫做 深度复制 。看看其和 浅度复制 有什么区别。
```js
var obj1 = {
    name: "John",
    location: {
        city: "Boston",
        county: "USA"
    }
}

var obj2 = {
    last: "Resig",
    location: {
        state: "MA",
        county: "China"
    }
}

$.extend(false, {}, obj1, obj2); // { name: "John", last: "Resig", location: { state: "MA", county: "China" }}

$.extend(true, {}, obj1, obj2); // { name: "John", last: "Resig", location: { city: "Boston", state: "MA", county: "China" }}
```

由此可见，执行 深度复制 会递归遍历每个对象中含有复杂对象（如：数组、函数、json对象等）的属性值进行复制，而且 浅度复制 便不会这么做。

3. 方法扩展

上述的 extend 方法中的 target 参数是可以省略的。如果省略了，则该方法就只能传入一个 object 参数，该方法功能是将该 object 合并到调用 extend 方法的对象中。

我们通常会使用这种方式来对 jQuer进行一些方法上的扩展。

jQurey 提供了两种方法扩张方式，分别为jQuery.fn.extend(object)和jQuery.extend(object).

想要搞清楚两种扩展方式之间的区别的话，先要了解什么是jQuery.fn.

本猿参考了 jQuery 的源码，发现其中玄机：
```js
jQuery.fn = jQuery.prototype = {　　　
    init: function(selector, context) {
        // ...
    };
}
```
jQuery.fn = jQuery.prototype这句代码明确指出jQuery.fn指代的就是 jQuery 的原型。

其次，我们要引入两个概念 类方法 和 实例方法 。
 - 类方法 是直接可以使用类引用，不需要实例化就可以使用的方法。一般在项目中 类方法 都是被设置为工具类使用；
 - 实例方法 必须先创建实例，然后才能通过实例调用该 实例方法 。
    jQuery可以看做是这个封装得非常好的类，而我们可以使用jQuery选择器来创建 jQuery 的实例。比如：使 id 选择器$('#btn')来创建一个实例。

4. 区别

jQuery.extend(object)相当于对 类方法 的扩展。
```js
jQuery.extend({
    /* 返回两个元素中较小的值 */
    min: function(a, b) {
        return a < b ? a : b;
    },
    /* 返回两个元素中较大的值 */
    max: function(a, b) {
        return a > b ? a : b;
    }
});

jQuery.min(2, 3); // 2
jQuery.max(4, 5); // 5
```

jQuery.fn.extend(object)是对jQuery.prototype上的扩展。
```js
jQuery.fn.extend = jQuery.prototype.extend
```
这种方式相当对 实例方法 的扩展。

#### 举个栗子：

开发一个简单的小功能，使用该方法可以使选定元素内的文字变红。
```js
$.fn.extend({
    setRed: function() {
        $(this).css("color", "red");
    }
});

$('.tip').setRed();
```
`$(".tip")`创建了一个jQuery实例，通过它可以调用成员方法setRed.

上述代码可以实现预想的扩展，但最好返回this 以满足 jQuery 链式操作 的需要。

改良之后，代码如下：
```js
$.fn.extend({
    red: function() {
        return $(this).css("color", "red");
    }
});
```

本文摘自：https://segmentfault.com/a/1190000004082170



