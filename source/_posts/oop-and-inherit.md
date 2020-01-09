---
title: 面向对象和继承
date: 2018-01-19 13:48:35
category: 前端
tags: [面向对象, 继承]
---

面向对象编程是目前最流行的编程方式之一。
<!-- more -->
### 面向对象
- 封装 、 继承、 多态
- 属性 property
- 方法 method
<!-- more -->

### 原型链
#### 1.工厂函数
```js
var  s = function () {
	return {
		a: 1
	}
};
```
#### 2.构造函数  constructor
```js
var s1 = function () {
	this.a = 'a';
	this.b = 'b';
};
// 对象是引用类型，直接赋值只是把地址赋值，改变对象属性的时候可能两个对象都会变
var s3 = s2

var s4 = function() {
	this.a = 'a';
	this.b = 'b';
};

s4.prototype.c = 'c';

var p  = new s4()；
var p1 = new s4();

p.__proto__ === s4.prototype  // true
p1.__proto__ === p.__proto__  // true
```

### 实例共享属性和方法
用 构造函数 + 原型链  实现封装和继承
调用new 操作符， 开辟内存空间, 返回this

### 继承
 parent class & child class
```js
var parent = function() {
	this.name = name;
	this.age = age;
};

var child = function(name, age, title) {
	this.title = title;
	// call 第一个参数手动指定this，
	parent.call(this, name, age);
	child.prototype.__proto__ = parent.prototype;

};

child.prototype.d = 'd';
new child('mhy', 11, 'student');
// child.prototype = new  parent('mhy', 10);
```

| - title : 'student'
| - name : 'mhy'
| - age : '11'
| - __proto__
	| - -d : 'd'
	| - __proto__
		| -c : 'c'
		 	| - Object...


Object.create(proto[. propertiesObject]

区别:
```js
child.prototype = Object.create(parent.prototype)
child.prototype.__proto__ = parent.prototype;
```
前者指向新的引用， 后者是在原来的引用基础上挂载新的属性

下面的例子演示了如何使用Object.create()来实现类式继承。这是一个所有版本JavaScript都支持的单继承。
```js
// Shape - superclass
function Shape() {
  this.x = 0;
  this.y = 0;
}

// superclass method
Shape.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

// Rectangle - subclass
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

console.log('Is rect an instance of Rectangle?',
  rect instanceof Rectangle); // true
console.log('Is rect an instance of Shape?',
  rect instanceof Shape); // true
rect.move(1, 1); // Outputs, 'Shape moved.'`
```

如果希望能继承到多个对象，则可以使用混入的方式。
```js
function MyClass() {
     SuperClass.call(this);
     OtherSuperClass.call(this);
}

// inherit one class
MyClass.prototype = Object.create(SuperClass.prototype);
// mixin another
Object.assign(MyClass.prototype, OtherSuperClass.prototype);
// re-assign constructor
MyClass.prototype.constructor = MyClass;

MyClass.prototype.myMethod = function() {
     // do a thing
};
```

### ES6 实现继承 super 方法、 extends 指向父类的方法
```js
class A {
	constructor(name, age) {
		this.name = naem;
		this.age = age;
	}
	eat() {
		console.log('eat');
	}
}

class B extends A {
	constructor(naem, age, title) {
		super(name, age);
		this.title = title;
	}
	work() {
		console.log('work');
	}
}

const c = new B('mhy', 12, 'student');
c.eat();
c.work();
```
`B` 的 `super()`指向`A`的构造函数。

