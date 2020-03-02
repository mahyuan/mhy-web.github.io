---
title: web worker使用教程以及在vue中的使用
category: javascript
tags:
  - javascript
  - web worker
  - vue
  - vue-worker
description: 'web worker使用教程以及在vue中的使用方式。'
date: 2020-03-02 18:26:09
---

由于javascript语言单线程的属性，对于需要大量计算的web应用，往往会有性能瓶颈。而web worker为javascript提供了多线程环境，允许主线程创建worker线程，将一些任务分配给后者运行，分担了主线程的压力。

## 概述
worker线程一但建立成功，就会始终运行，为了提高性能，应该在使用完毕后关闭。主线程与worker线程之间的交互使用的是postMessage，web worker使用时有几点限制，应该注意一下。

> - 同源策略
> 分配给worker线程运行的脚本，必须与主线程的脚本文件同源。
> - DOM限制
> worker线程中无法获取到网页的DOM对象，也无法使用`documet`、`window`等全局对象，但是可以使用`navigator`和`location`对象。
> - 通信方式限制
> 由于worker线程和主线程不在同一个上下文环境，彼此不能直接通信，必须通过postMessage。
> - 脚本限制
> worker线程不能执行`alert`和`confirm`方法，但是可以使用`XMLHttpRequest`对象发出`ajax`请求。
> - 文件限制
> worker线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本必须来自网络。

## web worker使用方法

worker线程通过`Worker`构造函数创建，传入一个javascript文件的地址，该文件包含了在worker中运行的代码。worker线程中没有window对象，专用worker线程中的全局作用域对象是`DedicatedWorkerGlobalScope`，共享worker可以被多个脚本使用，其全局对象是`SharedWorkerGlobalScope`（共享worker的构造函数是`SharedWorker`，本文不详细说明）。本文介绍的work使用方式仅限于专用worker。

### 主线程
通过`Worker`构造函数创建worker实例。
```js
// main.js
if(window.Worker) {
  const worker = new Worker('worker.js')
}
```

在主线程中通过`postMessage`和`onmessage`事件处理函数与worker通信。
```js
// main.js
document.querySelect('#btn1').onclick = function() {
  const query = {
    type: 1,
    args: [1,2,3,4,5,6,7]
  }
  worker.postMessage(query)
}

document.querySelect('#btn2').onclick = function() {
  const query = {
    type: 2,
    args: 'hello, web worker!'
  }
  worker.postMessage(query)
}
```

worker线程处理后返回来的数据通过`onmessage`事件来监听。事件对象的`data`属性可以获取worker发来的数据。
```js
// main.js
worker.onmessage = function(event) {
  console.log(event.data)
}
```

worker线程完成任务后，需要手动关闭它，不然它会始终运行。
```js
// main.js
worker.terminate()
```

### worker线程
worker线程处理主线程传递来的数据，需要写一个监听函数监听`message`事件。
```js
// worker.js
addEventListener('message', function(evnet) {
  const data = event.data
  if(data.type === 1) {
    const info = data.args.join('^')
    postMessage(info)
  } else {
    const info = data.args.split('')
    postMessage(info)
  }
}, false)

// 也可以直接使用onmessage处理函数，因为onmessage是全局对象下的方法
onmessage = function(event) {
  //
}
```

在worker线程中，也可以调用自己的`close`方法关闭worker线程。
```js
close()
```

当worker线程中出现运行错误时，会触发`onerror`事件，可以监听该事件进行异常处理。

worker线程中可以引入脚本，使用`importScripts()`方法。
```js
// worker.js
importScripts('utils.js')

// 加载多个脚本
importScripts('request.js', 'utils.js')
```

## vue中使用web worker
在vue项目中不能直接使用web worker，需要使用`vue-worker`这个库。它提供了`run`、`create`等API方便我们使用。
在项目中安装完vue-worker后，需要先注册，注册完之后可以通过`this.$worker`来使用。
```js
import Vue from 'vue'
import VueWorker from 'vue-worker'
import App from 'App.vue'

Vue.use(VueWorker)

new Vue({
  el: '#app',
  render: h => h(App)
})
```

在组件中调用worker, 有run和create两个API，run方法直接新建worker, worker执行完任务后自动关闭worker线程。而通过create方法创建的worker会持久化运行。
```js
export default {
  name: 'Index',
  data() {
    return {
      values: [],
      num: 100,
      worker: null
    }
  },
  methods: {
    btnClickHandle() {
      this.num = this.num + 1
      this.worker = this.$worker.run(this.getFactorial, [this.num])
        .then(res => {
          this.values.push({num: this.num, value: res})
        }).catch(e => {
          console.error('catch', e);
        })
    }
  },
  // 传递给worker的方法
  getFactorial(n) {
    const factorial = (num) => {
      if(typeof num !== 'number') {
        throw TypeError(num)
      }
      if(num <= 1) {
        return 1
      }
      if(num > 1) {
        return num * factorial(num - 1)
      }
    }
    return factorial(n)
  }
}
```
上面的代码实现了一个点击按钮计算阶乘的功能，其中计算数据的逻辑在worker线程中执行，执行完之后自动关闭worker线程。

下面举一个使用create方法创建worker的例子。
```js
export default {
  name: 'Index',
  data() {
    return {
      message: '',
      values: [],
      num: 100,
      defaultNum: 1,
      worker: null
    }
  },
  created() {
    this.createWorker()
  },
  destroyed() {
    this.worker = null
  },
  methods: {
    handleClick() {
      let randomNum = () => Math.floor(Math.random() * 100)
      const data = Array.from(new Array(10), () => randomNum())
      this.worker.postMessage('pull-data', [data])
      .then(res => {
        this.message = res
      }).catch(e => {
        console.error(e);
      })
    },
    createWorker() {
      this.num = this.defaultNum
      this.worker = this.$worker.create([
        {
          message: 'pull-data',
          func: (data) => {
            if(Array.isArray(data)) {
              return data.join('-')
            }
            return data
          }
        },
        {
          message: 'run-task',
          func: (id) => {
            console.log('run-task', id)
          }
        }
      ])
    }
  }
}
```
上面的代码中先是在created生命周期中创建了worker实例，然后可以通过调用handleClick方法调用worker，计算阶乘。
在worker实例化之后， 通过调用其实例对象原型上的postMessage方法向worker线程发送消息，该方法是异步的，所以可以通过then接收返回来的数据，也可以catch到异常。
create方法创建的worker实例还有很多用法，如调用postAll发送多条消息等，这里不再赘述，具体内容可以查看官方文档。

前面说过，通过create方法创建的worker实例是持续运行的，要关闭worker线程的话，可以改变this.worker对象的指针来实现。前面的例子中通过在destroyed生命周期中关闭worker线程。
```js
const actions = [{
  message: 'func1',
  func: () => 'working on func1'
}]
const worker = this.$worker.create(actions)

// user worker

worker = null
```


## 参考文献

[Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)
[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers)
[vue-worker：在vue中方便使用web worker](https://www.tangshuang.net/3657.html)
[npm vue-worker](https://www.npmjs.com/package/vue-worker)
