---
title: 数组的方法汇总
date: 2017-12-03 14:01:08
category: 前端
tags: [数组]
---
数组是对象，数组有很多方法，主要包括查询(不改变自身)，修改(改变自身)和遍历三大类。
<!-- more -->
## 1.不会改变自身的方法
下面的这些方法不会改变调用它们的对象的值，只会返回一个新的数组或者返回一个其它的期望值。
### Array.prototype.concat()
返回一个由当前数组和其它若干个数组或者若干个非数组值组合而成的新数组。
对象是引用类型，要实现对象的拷贝，不能采用直接赋值的方法，因为两者实际上指向同一个对象。可以使用`concat`方法或者拓展符`...`。
```js
let arr = [1,2,3,4];
let arr2 = [].concat(['11','21','12'], arr,['s','d']);
console.log(arr); // [1,2,3,4]
console.log(arr2); ['11','21','12',1,2,3,4,'s','d']
// 或者
let arr3 = arr.concat('d', ['beijing','shanghai']); // [1,2,3,4,'d', 'beijing', 'shanghai']
let arr4 = [...arr].concat('tianjing')
```
### Array.prototype.includes()
判断当前数组是否包含某指定的值，如果是返回 true，否则返回 false。
```js
let arr = [1,2,3,4];
arr.includes(4); //true
arr.includes('s'); // false
```
### Array.prototype.join()
连接所有数组元素组成一个字符串。
```js
let arr = [1,2,3,4];
let str = arr.join(''); // "1234"
```
### Array.prototype.slice(start, end)
抽取当前数组中的一段元素组合成一个新数组。两个参数，第一个参数为开始的下标，第二个为结束的下标；只传一个参数则从该参数下标开始截取，不传参数则截取整个数组。
注意，截取的数组包含的一个参数下标对应的元素，但不包括第二个参宿所指下标对应的元素, 即截取的区间为[start, end)
当仅参数为负数时，从数组末尾开始截取。
```js
let arr = [1,2,3,4];
let arr1 = arr.slice(); // [1,2,3,4]
let arr2 = arr.slice(3); // [4]
let arr3 = arr.slice(1,2); // [2]， 不包括【3】
```
**该方法不改变原数组，返回新数组**
### Array.prototype.toSource()
返回一个表示当前数组字面量的字符串。遮蔽了原型链上的 Object.prototype.toSource() 方法。
注意：该特性是非标准的，请尽量不要在生产环境中使用它！
目前大部分浏览器都不支持该方法， 仅firefox支持。
```js
var alpha = new Array("a", "b", "c");
alpha.toSource();   //返回["a", "b", "c"]
```
### Array.prototype.toString()
返回一个由所有数组元素组合而成的字符串。遮蔽了原型链上的 Object.prototype.toString() 方法。
```js
let arr = [1,2,3,4];
arr.toString(); // "1,2,3,4"
```
### Array.prototype.toLocaleString()
返回一个由所有数组元素组合而成的本地化后的字符串。遮蔽了原型链上的 Object.prototype.toLocaleString() 方法。
### Array.prototype.indexOf()
返回数组中第一个与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。
```js
let arr = [1,2,3,4,4,5];
arr.indexOf(4); // 3
arr.indexOf('2'); // -1

```
### Array.prototype.lastIndexOf()
返回数组中最后一个（从右边数第一个）与指定值相等的元素的索引，如果找不到这样的元素，则返回 -1。

## 2.会改变自身的方法
下面的这些方法会改变调用它们的对象自身的值：
### Array.prototype.copyWithin()
在数组内部，将一段元素序列拷贝到另一段元素序列上，覆盖原有的值。
```js
["alpha", "beta", "copy", "delta"].copyWithin(1, 2, 3);
//["alpha", "copy", "copy", "delta"]

['alpha', 'bravo', 'charlie', 'delta'].copyWithin(2, 0);
// results in ["alpha", "bravo", "alpha", "bravo"]

```
**语法：**
```js
arr.copyWithin(target)
arr.copyWithin(target, start)
arr.copyWithin(target, start, end)
arr.copyWithin(目标索引, [源开始索引], [结束源索引])
```
**target**

0 为基底的索引，复制序列到该位置。如果是负数，target 将从末尾开始计算。
如果 target 大于等于 arr.length，将会不发生拷贝。如果 target 在 start 之后，复制的序列将被修改以符合 arr.length。

**start**

0 为基底的索引，开始复制元素的起始位置。如果是负数，start 将从末尾开始计算。
如果 start 被忽略，copyWithin 将会从0开始复制。

**end**

0 为基底的索引，开始复制元素的结束位置。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。如果是负数， end 将从末尾开始计算。
如果 end 被忽略，copyWithin 将会复制到 arr.length。

### Array.prototype.fill()
将数组中指定区间的所有元素的值，都替换成某个固定的值。
```js
let arr = [];
arr.fill('s'); // [], 由于length = 0, 所有返回[]

let arr2 = [];
arr2.length = 3;
arr2.fill('x'); // ['x','x','x']

let arr3 = [1,2,3];
arr3.fill(0); // [0, 0, 0]
```
**语法：**
```js
arr.fill(value)
arr.fill(value, start)
arr.fill(value, start, end)
```
具体要填充的元素区间是 [start, end) , 一个半开半闭区间.

### Array.prototype.pop()
删除数组的最后一个元素，并返回这个元素。
### Array.prototype.push()
在数组的末尾增加一个或多个元素，并返回数组的新长度。
### Array.prototype.shift()
删除数组的第一个元素，并返回这个元素。
### Array.prototype.unshift()
在数组的开头增加一个或多个元素，并返回数组的新长度。
**pop 和 push 均作用于数组末尾；shift 和 unshift 做用于数组开头， 删除返回该元素， 添加返回length， 均改变原数组**

### Array.prototype.reverse()
颠倒数组中元素的排列顺序，即原先的第一个变为最后一个，原先的最后一个变为第一个。
### Array.prototype.sort()
对数组元素进行排序，并返回当前数组。
### Array.prototype.splice()
在任意的位置给数组添加或删除任意个元素。
**语法:**
```js
array.splice(start)

array.splice(start, deleteCount)

array.splice(start, deleteCount, item1, item2, ...)

```
**返回值**： 由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。
**该方法改变原数组。**

## 3.遍历方法
在下面的众多遍历方法中，有很多方法都需要指定一个回调函数作为参数。在每一个数组元素都分别执行完回调函数之前，数组的`length`属性会被缓存在某个地方，所以，如果你在回调函数中为当前数组添加了新的元素，那么那些新添加的元素是不会被遍历到的。此外，如果在回调函数中对当前数组进行了其它修改，比如改变某个元素的值或者删掉某个元素，那么随后的遍历操作可能会受到未预期的影响。总之，不要尝试在遍历过程中对原数组进行任何修改，虽然规范对这样的操作进行了详细的定义，但为了可读性和可维护性，请不要这样做。

### Array.prototype.forEach()
为数组中的每个元素执行一次回调函数。
没有返回值。
**语法：**
```js
array.forEach(callback(currentValue, index, array){
    //do something
}, this)

array.forEach(callback[, thisArg])
```
### Array.prototype.entries()
返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对。
```js
var arr = ["a", "b", "c"];
var iterator = arr.entries();
// undefined

console.log(iterator);
// Array Iterator {}

console.log(iterator.next().value);
// [0, "a"]
console.log(iterator.next().value);
// [1, "b"]
console.log(iterator.next().value);
// [2, "c"]


var arr = ["a", "b", "c"];
var iterator = arr.entries();
// undefined
for (let e of iterator) {
    console.log(e);
}
// [0, "a"]
// [1, "b"]
// [2, "c"]
```
### Array.prototype.every()
如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false。
### Array.prototype.some()
如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false。
### Array.prototype.filter()
将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。
### Array.prototype.find()
找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined。
### Array.prototype.findIndex()
找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1。
### Array.prototype.keys()
返回一个数组迭代器对象，该迭代器会包含所有数组元素的键。
```js
let arr = ["a", "b", "c"];

let iterator = arr.keys();
// undefined

console.log(iterator);
// Array Iterator {}

console.log(iterator.next());
// Object {value: 0, done: false}

console.log(iterator.next());
// Object {value: 1, done: false}

console.log(iterator.next());
// Object {value: 2, done: false}

console.log(iterator.next());
// Object {value: undefined, done: true}

```
### Array.prototype.map()
返回一个由回调函数的返回值组成的新数组。
### Array.prototype.reduce()
从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
```js
var total = [0, 1, 2, 3].reduce(function(sum, value) {
  return sum + value;
}, 0);
// total is 6

var flattened = [[0, 1], [2, 3], [4, 5]].reduce(function(a, b) {
  return a.concat(b);
}, []);
// flattened is [0, 1, 2, 3, 4, 5]

```
将二维数组转化为一维
```js
ar flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },
  []
);
// flattened is [0, 1, 2, 3, 4, 5]

// 你也可以写成箭头函数的形式：
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
 ( acc, cur ) => acc.concat(cur),
 []
);
```
数组去重
```js
et arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current)=>{
    if(init.length===0 || init[init.length-1]!==current){
        init.push(current);
    }
    return init;
}, []);
console.log(result); //[1,2,3,4,5]
```
### Array.prototype.reduceRight()
从右到左为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。
### Array.prototype.values()
返回一个数组迭代器对象，该迭代器会包含所有数组元素的值。
### Array.prototype[@@iterator]()
和上面的 values() 方法是同一个函数。

## 4.通用方法

在 JavaScript 中，很多的数组方法被故意设计成是通用的。也就是说，那些看起来像是数组的对象（类数组对象），即拥有一个 `length` 属性，以及对应的索引属性（也就是数字类型的属性，比如 `obj[5]` )的非数组对象也是可以调用那些数组方法的。

其中一些数组方法，比如说 `join` 方法，它们只会单纯的读取当前对象的 `length` 属性和索性属性的值，并不会尝试去改变这些属性的值。

而另外一些数组方法，比如说 `reverse` 方法，它们会尝试修改那些属性的值，因此，如果当前对象是个 `String` 对象，那么这些方法在执行时就会报错，因为字符串对象的 `length` 属性和索引属性都是只读的。
