---
title: this、原型、继承总结
date: 2017-10-29 13:16:13
category: 前端
tags: [javascript, 原型, this, 继承]
---

## this 相关问题
### 问题1： apply、call 、bind有什么作用，什么区别

<!-- more -->
* Function.prototype.bind:

 bind，返回一个新函数，并且使函数内部的this为传入的第一个参数
```
var fn3 = obj1.fn.bind(obj1);
fn3();
```
* 使用call和apply设置this

 call apply，调用一个函数，传入函数执行上下文及参数
```
fn.call(context, param1, param2...)
fn.apply(context, paramArray)
```

 语法很简单，第一个参数都是希望设置的this对象，不同之处在于call方法接收参数列表，而apply接收参数数组
```
fn2.call(obj1);
fn2.apply(obj1);
```
* 它们的不同之处：

 * apply：

     最多只能有两个参数——新this对象和一个数组 argArray。如果给该方法传递多个参数，则把参数都写进这个数组里面，当然，即使只有一个参数，也要写进数组里面。如果 argArray 不是一个有效的数组或者不是 arguments 对象，那么将导致一个 TypeError。如果没有提供 argArray 和 thisObj 任何一个参数，那么 Global 对象将被用作 thisObj，并且无法被传递任何参数。
 * call：

     则是直接的参数列表，主要用在js对象各方法互相调用的时候，使当前this实例指针保持一致,或在特殊情况下需要改变this指针。如果没有提供 thisObj 参数，那么 Global 对象被用作 thisObj。

 更简单地说，apply和call功能一样，只是传入的参数列表形式不同：如 func.call(func1,var1,var2,var3) 对应的apply写法为：func.apply(func1,[var1,var2,var3])
也就是说：call调用的为单个，apply调用的参数为数组
```
function sum(a,b){
  console.log(this === window);//true
  console.log(a + b);
}
sum(1,2);
sum.call(null,1,2);
sum.apply(null,[1,2]);
```
作用　　

    * 调用函数
```
var info = 'tom';
function foo(){
  //this指向window
  var info = 'jerry';
  console.log(this.info);   //tom
  console.log(this===window)  //true
}
foo();
foo.call();
foo.apply();
call和apply可以改变函数中this的指向　　
var obj = {
      info:'spike'
}
foo.call(obj);    //这里foo函数里面的this就指向了obj
foo.apply(obj);
```
    * 借用别的对象的方法

    eg:求数组中的最大值
```
var arr = [123,34,5,23,3434,23];
//方法一
var arr1 = arr.sort(function(a,b){
  return b-a;
});
console.log(arr1[0]);
//方法二
var max = Math.max.apply(null,arr)   //借用别的对象的方法
console.log(max);
fn.call(context, param1, param2...)
fn.apply(context, paramArray)
```

### 问题2： 以下代码输出什么?

```
    var john = {
        firstName: "John"
    }
    function func() {
        alert(this.firstName + ": hi!")
    }
    john.sayHi = func
    john.sayHi()
    //输出结果：join：hi！
    //此时，this是join对象；
```

### 问题3： 下面代码输出什么，为什么
```
    func()
    function func() {
       alert(this)
    }
    //输出： Window
    //原因：func()等价于func.call(undefined);
    //而undefined会被浏览器默认为全局对象window;
```

#### 问题4：下面代码输出什么
```
    document.addEventListener('click', function(e){
        console.log(this);
        setTimeout(function(){
            console.log(this);
        }, 200);
    }, false);
    //输出为：#document;  window;
    //在事件处理程序中this代表事件源DOM对象
    //(setTimeout、setInterval这两个方法执行的函数this也是全局对象)

```

#### 问题5：下面代码输出什么，why
```
    var john = {
        firstName: "John"
    }
    function func() {
        alert( this.firstName )
    }
    func.call(john)
    //输出： john
    //解释：call（）中第一个参数表示定义的this值，即func（）中的this代表join。
```

#### 问题6： 以下代码有什么问题，如何修改

```
    var module= {
        bind: function(){
            $btn.on('click', function(){
                console.log(this) //this指？
                this.showMsg();
            })
        },
        showMsg: function(){
            console.log('饥人谷');
        }
    }
    //this指什么$btn
```
修改后
```
    var module= {
        bind: function(){
            var _this = this;
            $btn.on('click', function(){
                console.log(_this) //_this指的是module；
                _this.showMsg();//饥人谷
            })
        },
        showMsg: function(){
            console.log('饥人谷');
        }
    }
```

## 原型链相关问题

#### 问题7：有如下代码，解释Person、 prototype、__proto__、p、constructor之间的关联。
```
    function Person(name){
        this.name = name;
    }
    Person.prototype.sayName = function(){
        console.log('My name is :' + this.name);
    }
    var p = new Person("若愚")
    p.sayName();
```
![](https://github.com/mhy-web/HomeWorks/tree/master/%E9%AB%98%E7%BA%A7/task2/images/prototype-0.png)

* 我们通过函数定义了类`Person`，类（函数）自动获得属性prototype;
* 每个类的实例都会有一个内部属性 `__proto__`，指向类的prototype属性

* `p`是构造函数`Person`的一个实例，`p`的  `__proto__` 指向了Person的prototype属性，
* `prototype`是构造函数内部的原型对象，所以拥有`contructor`和`__proto__`属性，其中`contructor`属性指向构造函数`Person`，`__proto__`指向该对象的原型.

#### 问题8： 上例中，对对象 p可以这样调用 p.toString()。toString是哪里来的? 画出原型图?并解释什么是原型链。

* p.toString()方法是继承构造函数Object的原型对象里定义的toString方法，首先p会找自己的toString方法，如果没有找到，
会沿着` __proto__` 属性继续到构造函数Person的prototype里找toString方法，
如果还未找到，再继续往Person.prototype的`__proto__`即Object.prototype找toString方法，最后找到toString()方法。

* 原型链：由于原型对象本身也是对象，而每个javascript对象都有一个原型对象，每个对象都有一个隐藏的__proto__属性，
原型对象也有自己的原型，而它自己的原型对象又可以有自己的原型，这样就组成了一条链，这个就是原型链。
在访问对象的属性时，如果在对象本身中没有找到，则会去原型链中查找，如果找到，直接返回值，如果整个链都遍历且没有找到
属性，则返回undefined。原型链一般实现为一个链表，这样就可以按照一定的顺序来查找。

![](https://github.com/mhy-web/HomeWorks/tree/master/%E9%AB%98%E7%BA%A7/task2/images/prototype.png)

#### 问题9：对String做扩展，实现如下方式获取字符串中频率最高的字符
```
    var str = 'ahbbccdeddddfg';
    var ch = str.getMostOften();
    console.log(ch); //d , 因为d 出现了5次
```
```
    //方法一：
    String.prototype.getMostOften = function(){
        var obj = {};
        for(var i=0,k;i<this.length;i++){
            k = this[i];
            if(obj[k]){
                obj[k]++
            }else{
                obj[k] = 1
            }
        }
        var max = 0,key;
        for(var k in obj){
            if(obj[k]>max){
                max = obj[k];
                key = k;
            }
        }
        return key;
    }
    //方法二：
    String.prototype.getMostOften = function(){
        var arr = this.split("");
        var result = arr.reduce(function(allLetters,letter){
            if(allLetters[letter]){
                allLetters[letter]++
            }else{
                allLetters[letter] = 1
            }
            return allLetters;
        },{});
        var max = 0,k;
        for(var key in result){
            if (result[key]>max){
                max = result[key];
                k = key
            }
        }
        return k;
    }
    var str = 'ahbbccdeddddfg';
    var ch = str.getMostOften();
    console.log(ch); //d
```
#### 问题10： instanceOf有什么作用？内部逻辑是如何实现的？
* instanceOf：判断一个对象是否为另一个对象的实例

```
    function isInstanceOf(obj,fn){
        var oldProto = obj.__proto__;
        do{
            if(oldProto === fn.prototype){ //prototype是小写的！
                return true;
            }else{
                oldProto = oldProto.__proto__;
            }
        }while(oldProto){
            return false;
        }
    }
```

## 继承相关问题

#### 问题11：继承有什么作用?

 **继承是指一个对象直接使用另一对象的属性和方法。**
JavaScript 对象有一个指向一个原型对象的链。当试图访问一个对象的属性时，它不仅仅在该对象上搜寻，还会搜寻该对象的原型，
以及该对象的原型的原型，依此层层向上搜索，直到找到一个名字匹配的属性或到达原型链的末尾。这就意味着，JS对象可以使用所有
其原型的所有方法，如果我们在原型上添加新的方法，那么实例也会拥有该方法，能够大大减少冗余代码。

#### 问题12： 下面两种写法有什么区别?
```
    //方法1
    function People(name, sex){
        this.name = name;
        this.sex = sex;
        this.printName = function(){
            console.log(this.name);
        }
    }
    var p1 = new People('饥人谷', 2)

    //方法2
    function Person(name, sex){
        this.name = name;
        this.sex = sex;
    }

    Person.prototype.printName = function(){
        console.log(this.name);
    }
    var p1 = new Person('若愚', 27);
```

区别:

方法一是将printName作为构造函数的方法，实例在进行调用的时候是调用的自身的方法，较为消耗内存。
方法二是将printName作为构造函数原型的方法，所有实例共享这个方法。

#### 问题13： Object.create 有什么作用？兼容性如何？

```
    function Person(name, age){
        this.name = name;
        this.age = age;
    }
    Person.prototype.sayName = function(){
        console.log(this.name);
    }
    function Male(name, age, sex){
        Person.call(this, name, age);
        this.sex = sex;
    }
    Male.prototype = new Person();
    //该方法同下，代替不兼容Object.create()的使用场景

    Male.prototype = Object.create(Person.prototype);
    Male.prototype.constructor = Male;
    Male.prototype.sayAge = function(){
        console.log(this.age);
    };
    var p1 = new Male('hunger', 20, 'nan');
    p1.sayName();//hunger
    p1.sayAge();//20
```
兼容性：

![](https://github.com/mhy-web/HomeWorks/tree/master/%E9%AB%98%E7%BA%A7/task2/images/兼容性.jpg)

#### 问题14： hasOwnProperty有什么作用？ 如何使用？

hasOwnPerperty是Object.prototype的一个方法，可以判断一个对象是否包含自定义属性而不是原型链上的属性，
hasOwnProperty是JavaScript中唯一一个处理属性但是不查找原型链的函数
```
    m.hasOwnProperty('name'); // true
    m.hasOwnProperty('printName'); // false
    Male.prototype.hasOwnProperty('printAge'); // true
```

#### 问题15：如下代码中call的作用是什么?
```
    function Person(name, sex){
        this.name = name;
        this.sex = sex;
    }
    function Male(name, sex, age){
        Person.call(this, name, sex);    //这里的 call 有什么作用
        this.age = age;
    }
```
#### 问题16： 补全代码，实现继承
```
    function Person(name, sex){
        // todo ...
        this.name = name;
        this.sex = sex;
    }

    Person.prototype.getName = function(){
        // todo ...
        console.log(this.name);
    };

    function Male(name, sex, age){
        //todo ...
        Person.call(this,name, sex);
        this.age = age;
    }

    //todo ...
    Male.prototype = Object.create(Person.prototype);
    Male.prototype.constructor = Male;
    Male.prototype.getAge = function(){
        //todo ...
        console.log(this.age);
    };

    var ruoyu = new Male('若愚', '男', 27);
    ruoyu.printName();//若愚
```
