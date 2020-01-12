---
title: 深浅拷贝方法总结
date: 2018-02-21 16:45:52
category: 前端
tags: [深拷贝]
description: 'javascript对象深浅拷贝方法总结。'
---

## 一.Javascript中的深浅拷贝由来：
javascript中数据格式分为基本类型和引用类型，5种基本数据类型Undefined、Null、Boolean、Number 和 String，变量是直接按值存放的，存放在栈内存中的简单数据段，可以直接访问。
<!-- more -->
存放在堆内存中的对象，变量保存的是一个指针，这个指针指向另一个位置。当需要访问引用类型（如对象，数组等）的值时，首先从栈中获得该对象的地址指针，然后再从堆内存中取得所需的数据。

JavaScript存储对象都是存地址的，所以浅拷贝会导致 obj1 和obj2 指向同一块内存地址。改变了其中一方的内容，都是在原来的内存上做修改会导致拷贝对象和源对象都发生改变，而深拷贝是开辟一块新的内存地址，将原对象的各个属性逐个复制进去。对拷贝对象和源对象各自的操作互不影响。

## 二.浅拷贝

### 1.引用复制
### 2.遍历赋值拷贝：
```js
function shallowClone(obj) {
    var o = {};
    for(var key in obj) {
        o[key] = obj[key];
    }
    return o;
}
```
### 3.Object.assign()
Object.assign() 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。
```js
var obj = {
    a: 1,
    b: 2,
    c: {d: 'ai', e: 'BB'}};
var o = Object.assign({}, obj);
console.log(objc.d === o.c.d); // true
```
### 4.`Array.concat()` 和 `Array.slice()`方法
`concat()`和`sluce()`返回不同的数组实例，但是对于数组的对象元素，只是拷贝了指针。

## 三.深拷贝
### 1.`JSON`对象的`parse()`和`stringify()`
`JSON`对象的`parse()`和`stringify()`方法连用可以实现深拷贝。
**可以实现深拷贝的情况：**
```js
var obj = {
    name: 'mhy',
    age: 22,
    other: {
        sex: 'male',
        city: 'beijing'
    }
}

var p = JSON.parse(JSON.stringify(obj))
p.other.city = 'shanghai';
console.log(obj.other.city); // 'beijing'
```
对于一般的情况而言，该方法可以实现深拷贝。
**不能实现的情况：**
```js
var obj = {
    name: 'xxx',
    fn: function(){console.log('this is a function')}
};
var o = JSON.parse(JSON.stringify(obj));
console.log(o.fn); // undefined
```
对于**正则表达式类型**、**函数类型**等无法进行深拷贝(而且会直接丢失相应的值)。还有一点不好的地方是它会抛弃对象的constructor。也就是深拷贝之后，不管这个对象原来的构造函数是什么，在深拷贝之后都会变成Object。同时如果对象中存在循环引用的情况也无法正确处理。
### 2.jQuery.extend()
```js
var obj = {
    name: 'mhy',
    age: 22,
    other: {
        sex: 'male',
        city: 'beijing'
    }
};
var o = $.extend(true, {}, obj)
// jQuery 的 extend() 方法可以实现深浅拷贝， 第一个参数为true时为深拷贝，否则为浅拷贝。
```
### 3.递归
```js
var cloneObj = function(obj){
    var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    } else if(window.JSON){
        str = JSON.stringify(obj), //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for(var i in obj){
            newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
};
```
[其他库的deepClone方法](http://jerryzou.com/posts/dive-into-deep-clone-in-javascript/)






