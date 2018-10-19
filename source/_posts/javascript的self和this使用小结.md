---
title: javascript的self和this使用小结
date: 2017-09-18 20:12:14
category: javascript
tags: [this, self, javascript]
---

一、self
这个非常简单。我们知道，打开任何一个网页，浏览器会首先创建一个窗口，这个窗口就是一个window对象，也是js运行所依附的全局环境对象和全局作用域对象。self 指窗口本身，它返回的对象跟window对象是一模一样的。也正因为如此，window对象的常用方法和函数都可以用self代替window。举个例子，常见的写法如“self.close();”，把它放在<a>标记中：“<a href="javascript:self.close();">关闭窗口</a>”，单击“关闭窗口”链接，当前页面关闭。

<!-- more -->

二、this关键字
在讲this之前，看下面的一段代码：

```
<body>
<script type="text/javascript">
function thisTest()
  {
      this.textValue = 'this的dom测试';
      this.element= document.createElement('span');
      this.element.innerHTML = this.textValue;
      this.element.style.color = "blue";
      this.element.style.cursor = "pointer";
      this.element.attachEvent('onclick', this.ToString);
  }

  thisTest.prototype.RenderDom = function()
  {
      document.body.appendChild(this.element);
  }

  thisTest.prototype.ToString = function()
  {
      alert("单击我："+this.textValue);
  };
  var test= new thisTest();
  test.RenderDom();
  //test.ToString();
</script>
</body>
```
本来的目的是想在body中添加一个span元素，对于这个span元素，制定了它的字体颜色，悬浮在它上面的鼠标样式和单击触发事件。问题就出现在它的单击事件上（弹出"单击我:undefined"）。也许有人会说你丫傻呀，写这么多sb代码还不就是为了实现下面这个东东吗？
```
<span style='cursor:pointer;color:blue;' onclick="alert(this.innerHTML)">this的dom测试</span>
```
你看多简单直观，而且还不容易出错？！kao，我晕。我正要讲的是您正在使用的this.innerHTML中的this呀。
1、this到底指什么？
我们熟悉的c#有this关键字，它的主要作用就是指代当前对象实例（参数传递和索引器都要用到this）。在javascript中，this通常指向的是我们正在执行的函数本身，或者是指向该函数所属的对象（运行时）。
2、常见使用方式
（1）、直接在dom元素中使用
```
<input id="btnTest" type="button" value="提交" onclick="alert(this.value))" />
```
分析：对于dom元素的一个onclick（或其他如onblur等）属性，它为所属的html元素所拥有，直接在它触发的函数里写this，this应该指向该html元素。
（2）、给dom元素注册js函数
a、不正确的方式

```
<script type="text/javascript">
  function thisTest(){
  alert(this.value); // 弹出undefined, this在这里指向??
}
</script>

<input id="btnTest" type="button" value="提交" onclick="thisTest()" />
```

 分析：onclick事件直接调用thisTest函数，程序就会弹出undefined。因为thisTest函数是在window对象中定义的，
所以thisTest的拥有者（作用域）是window，thisTest的this也是window。而window是没有value属性的，所以就报错了。
b、正确的方式
```
<input id="btnTest" type="button" value="提交" />

<script type="text/javascript">
  function thisTest(){
  alert(this.value);
}
document.getElementById("btnTest").onclick=thisTest; //给button的onclick事件注册一个函数
</script>
```
分析：在前面的示例中，thisTest函数定义在全局作用域（这里就是window对象），所以this指代的是当前的window对象。而通过document.getElementById("btnTest").onclick=thisTest;这样的形式，其实是将btnTest的onclick属性设置为thisTest函数的一个副本，在btnTest的onclick属性的函数作用域内，this归btnTest所有，this也就指向了btnTest。其实如果有多个dom元素要注册该事件，我们可以利用不同的dom元素id，用下面的方式实现：
document.getElementById("domID").onclick=thisTest; //给button的onclick事件注册一个函数。
因为多个不同的HTML元素虽然创建了不同的函数副本，但每个副本的拥有者都是相对应的HTML元素，各自的this也都指向它们的拥有者，不会造成混乱。
为了验证上述说法，我们改进一下代码，让button直接弹出它们对应的触发函数：
```
<input id="btnTest1" type="button" value="提交1" onclick="thisTest()" />
<input id="btnTest2" type="button" value="提交2" />

<script type="text/javascript">
function thisTest(){
this.value="提交中";
}
var btn=document.getElementById("btnTest1");
alert(btn.onclick); //第一个按钮函数

var btnOther=document.getElementById("btnTest2");
btnOther.onclick=thisTest;
alert(btnOther.onclick); //第二个按钮函数
</script>
```
其弹出的结果是：
```
//第一个按钮
function onclick(){
  thisTest()
}

//第二个按钮
function thisTest(){
  this.value="提交中";
}
```

从上面的结果你一定理解的更透彻了。
By the way，每新建一个函数的副本，程序就会为这个函数副本分配一定的内存。而实际应用中，大多数函数并不一定会被调用，于是这部分内存就被白白浪费了。所以我们通常都这么写：
```
<input id="btnTest1" type="button" value="提交1" onclick="thisTest(this)" />
<input id="btnTest2" type="button" value="提交2" onclick="thisTest(this)" />
<input id="btnTest3" type="button" value="提交3" onclick="thisTest(this)" />
<input id="btnTest4" type="button" value="提交4" onclick="thisTest(this)" />

<script type="text/javascript">
  function thisTest(obj){
  alert(obj.value);
}
</script>
```

这是因为我们使用了函数引用的方式，程序就只会给函数的本体分配内存，而引用只分配指针。这样写一个函数，调用的地方给它分配一个（指针）引用，这样效率就高很多。当然，如果你觉得这样注册事件不能兼容多种浏览器，可以写下面的注册事件的通用脚本：
```
//js事件 添加 EventUtil.addEvent(dom元素,事件名称,事件触发的函数名) 移除EventUtil.removeEvent(dom元素,事件名称,事件触发的函数名)
var EventUtil = new eventManager();

//js事件通用管理器 dom元素 添加或者移除事件
function eventManager() {
    //添加事件
    //oDomElement:dom元素,如按钮,文本,document等; ****** oEventType:事件名称(如:click,如果是ie浏览器,自动将click转换为onclick);****** oFunc:事件触发的函数名
    this.addEvent = function(oDomElement, oEventType, oFunc) {
        //ie
        if (oDomElement.attachEvent) {
            oDomElement.attachEvent("on" + oEventType, oFunc);
        }
        //ff,opera,safari等
        else if (oDomElement.addEventListener) {
            oDomElement.addEventListener(oEventType, oFunc, false);
        }
        //其他
        else {
            oDomElement["on" + oEventType] = oFunc;
        }
    }

    this.removeEvent = function(oDomElement, oEventType, oFunc) {
        //ie
        if (oDomElement.detachEvent) {
            oDomElement.detachEvent("on" + oEventType, oFunc);
        }
        //ff,opera,safari等
        else if (oDomElement.removeEventListener) {
            oDomElement.removeEventListener(oEventType, oFunc, false);
        }
        //其他
        else {
            oDomElement["on" + oEventType] = null;
        }
    }
}
```

 正像注释写的那样，要注册dom元素事件，用EventUtil.addEvent(dom元素,事件名称,事件触发的函数名)即可， 移除时可以这样写：EventUtil.removeEvent(dom元素,事件名称,事件触发的函数名)。这是题外话，不说了。
(3)、类定义中使用this关键字
这个其实再常见不过，看示例：
```
function thisTest()
  {
      var tmpName = 'jeff wong';
      this.userName= 'jeff wong';
  }

var test= new thisTest();
alert(test.userName==test.tmpName);//false
alert(test.userName); //jeff wong
alert(test.tmpName); //undefined
```
 分析一下结果，其实这里的this和c#里的是类似的。
（4）、为脚本对象添加原形方法
理解这里的前提是你必须了解js里的原型概念（说道这里，kao，我还真的需要面壁一下）：js中对象的prototype属性，是用来返回对象类型原型的引用的。所有js内部对象都有只读的prototype属性，可以向其原型中动态添加功能(属性和方法)，
但该对象不能被赋予不同的原型。但是对于用户定义的对象可以被赋给新的原型。看个简单的示例：
```
//js的内部对象String,向其原型中动态添加功能(属性和方法)
//去掉字符串两端的空白字符
String.prototype.Trim = function() {
    return this.replace(/(^\s+)|(\s+$)/g, "");
}

function thisTest()
  {
      var tmpName = 'jeff wong';
      this.userName= '      jeff wong  ';
  }
//给用户定义的对象添加原型方法
thisTest.prototype.ToString = function()
  {
      alert(this.userName); //jeff wong(*有空格*)
      alert(this.userName.Trim()); //jeff wong (*无空格*)
      //alert(tmpName); //脚本错误,tmpName未定义
  }

var test= new thisTest();
test.ToString(); //调用原型的ToString()

function myTest(){
  this.userName= '  test ';
}
var test1=new myTest();
//test1.ToString(); //这里暂时不支持调用ToString()方法

//用户定义的对象被赋给新的原型
myTest.prototype = new thisTest();
test1.ToString(); //调用原型的ToString()
```

测试结果显示，这里的this指代的是被添加原形（方法或属性）的类的实例，和（3）中的定义基本相似。
（5）、在函数的内部函数中使用this关键字
这个你要是理解作用域和闭包，问题就迎刃而解。看最典型的示例：
```
function thisTest()
  {
      this.userName= 'outer userName';
      function innerThisTest(){
        var userName="inner userName";
        alert(userName); //inner userName
        alert(this.userName); //outer userName
      }
     return innerThisTest;
  }

thisTest()();
```

分析：thisTest()调用内部的innerThisTest函数，形成一个闭包。innerThisTest执行时，第一次弹出innerUserName，是因为innerThisTest函数作用域内有一个变量叫userName，所以直接弹出当前作用域下变量的指定值；第二次弹出outer  userName是因为innerThisTest作用域内没有userName属性（示例中的this.userName）,所以它向上一级作用域中找userName属性，这次在thisTest中找到（示例中的this.userName= 'outer userName';），所以弹出对应值。
（6）通过Function的call和apply函数指定特定的this
这个指定来指定去，this就有可能造成“你中有我，我中有你”的局面，不想把自己弄晕了的话，了解一下就可以了。改变this指定对象对于代码维护也是一件很不好的事情。贴出旧文中的示例代码结束吧：
```
function myFuncOne() {
    this.p = "myFuncOne-";
    this.A = function(arg) {
        alert(this.p + arg);
    }
}

function myFuncTwo() {
    this.p = "myFuncTwo-";
    this.B = function(arg) {
        alert(this.p + arg);
    }
}
function test() {
    var obj1 = new myFuncOne();
    var obj2 = new myFuncTwo();
    obj1.A("testA");                       //显示myFuncOne-testA
    obj2.B("testB");                        //显示myFuncTwo-testB
    obj1.A.apply(obj2, ["testA"]);          //显示myFuncTwo-testA,其中[ testA”]是仅有一个元素的数组
    obj2.B.apply(obj1, ["testB"]);          //显示myFuncOne-testB,其中[ testB”]是仅有一个元素的数组
    obj1.A.call(obj2, "testA");             //显示myFuncTwo-testA
    obj2.B.call(obj1, "testB");             //显示myFuncOne-testB
}
```

总结：到这里，对于开篇中的span弹出undefined的问题你是不是已经豁然开朗？如果你还在懵懂中，给个可有可无的提示：当前的这个span元素有没有textValue属性啊！？
三、void
1、定义
javascript中void是一个操作符，该操作符指定要计算一个表达式但是不返回值。
2、语法
void 操作符用法格式如下：
    （1）. javascript:void (expression)
    （2）. javascript:void expression
注意：expression是一个要计算的js标准的表达式。表达式外侧的圆括号是可选的，但是写上去你可以一眼就知道括弧内的是一个表达式（这和typeof后面的表达式语法是一样的）。
3、实例代码
```
        function voidTest() {

            void (alert("it is a void test")); //执行函数

            var oTestNum = 1;
            void (oTestNum++); //整数自加
            alert(oTestNum);

            oTestNum = 1;
            void (oTestNum += " void test"); //整数加字符串
            alert(oTestNum);
        }
        voidTest();
```
4、在a元素下使用void(0)
（1）适用情况
在网页中，我们经常看到html里的a标签不需要它导航到某一个页面时，href属性设置的写法：
```
    <a href="#">link1</a>
    <a href="javascript:void(0);">link2</a>
```
注意：第一种“#”的写法（其实#可以是多个，通常都是1个），当a元素所在的链接在浏览器一屏以下时，会导致页面回滚到顶部；所以当我们需要a标签不导航到其他页面，不需要网页位置的回滚，都会采取void(0)那种写法。
（2）ie6下void(0)造成的诡异问题
这个问题网上有很多讨论，个人认为[“落叶满长沙”](http://www.cnblogs.com/litao229/archive/2009/06/23/1509379.html)总结的很有代表性，这里就不再赘述了。


本文摘自 [http://www.cnblogs.com](http://www.cnblogs.com/reommmm/archive/2010/01/20/1652469.html)
