---
title: vuex学习笔记
category: 前端
tags:
  - javascript
  - vuex
  - vue
date: 2018-05-09 19:37:39
---
> vuex是为Vue应用开发的**状态管理模式**。
它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 devtools extension，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

这个状态自管理应用包含以下几个部分：
- state，驱动应用的数据源；
- view，以声明方式将 state 映射到视图；
- actions，响应在 view 上的用户输入导致的状态变化。
<!-- more -->
**单向数据流**
<!-- ![单向数据流](https://vuex.vuejs.org/zh-cn/images/flow.png) -->
<img src='https://vuex.vuejs.org/zh-cn/images/flow.png' style="width: 400px; display: block;">

**多个组件共享状态**
<img src="https://vuex.vuejs.org/zh-cn/images/vuex.png" style="width: 400px; display: block;">
### 安装
使用npm安装：
```bash
npm install vuex --save
```
使用yarn安装
```bash
yarn add vuex
```
在项目中使用`Vue.use()`来安装引入 Vuex
```js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)
```
### State
#### 在 Vue 组件中获得 Vuex 状态

从 store 实例中读取状态最简单的方法就是在计算属性中返回某个状态：
```js
// 创建一个 Counter 组件
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return store.state.count
    }
  }
}
```

Vuex 通过 store 选项，提供了一种机制将状态从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）：
```js
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
  components: { Counter },
  template: `
    <div class="app">
      <counter></counter>
    </div>
  `
})
```
通过在根实例中注册 store 选项，该 store 实例会注入到根组件下的所有子组件中，且子组件能通过 this.$store 访问到。让我们更新下 Counter 的实现：
```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
    }
  }
}
```

#### mapState 辅助函数
当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性，让你少按几次键：
```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
  // ...
  computed: mapState({
    // 箭头函数可使代码更简练
    count: state => state.count,

    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

#### 对象展开运算符
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。但是自从有了对象展开运算符（现处于 ECMASCript 提案 stage-3 阶段），我们可以极大地简化写法：
```js
computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })
}
```

### getter
Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

Getter 接受 state 作为其第一个参数：
```js
const store = new Vuex.Store({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 1, test: '...', done: false }
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        }
    }
})
```
Getter 会暴露为 store.getters 对象：
```js
store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]
```
我们可以很容易地在任何组件中使用它：
```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```
#### mapGetters 辅助函数
mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'

export default {
    // ...
    computed: {
        //使用对象展开符 将 getter 混入 computed 对象中
        ...mapGetters([
            'doneTodosCount',
            'anothersGetters',
            // ...
        ])
    }
}
```
如果你想将一个 getter 属性另取一个名字，使用对象形式：
```js
mapGetters([
    // 映射 `this.doneCount` 为 `store.getters.doneTodosCount`
    doneCount: 'doneTodosCount'
])
```

### Mutation
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
```js
import Vuex from 'vuex'

const store = new Vuex.Store({
    state: {
        count: 1
    },
    mutation: {
        increment(state) {
            count ++
        }
    }
})
```
当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.commit 方法：
```js
store.commit('increment')
```
可以传入额外的参数：
```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
store.commit('increment', 10)
```
多数情况下为一个对象：
```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}
store.commit('increment', {
  amount: 10
})
```
#### 对象风格的提交方式
提交 mutation 的另一种方式是直接使用包含 type 属性的对象：
```js
muations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}

store.commit({
    type: 'increment',
    amount: 10
})
```

#### Mutation 需遵守 Vue 的响应规则
Vuex 的 store 中的状态是响应式的，所以当我们变更状态时，监视状态的Vue组件也会自动更新。 意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：
* 最好提前在 store 中 初始化所有需要的属性
* 当需要在对象上添加新属性时：
  * 使用 Vue.set(obj, 'newProp', 123) 或者
  * 以新对象替换旧对象。例如，使用 stage-3 的 对象展开运算符：
```js
state.obj = { ...state.obj, newProp: 123 }
```
#### 使用常量替代 Mutation 事件类型
使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from 'mutation-types'

const store = new Vuex.store({
  state: {...},
  mutation: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```
使用常量对于多人协作的大型项目很有帮助， 但不是必需的。

#### Mutation 必须是同步函数
**mutation必须是同步函数**

#### 在组件中提交 mutation
在组件中使用 `this.$store.commit('xxx')` 提交 mutation ，或者使用 `mapMutation` 辅助函数将组件中的 methods 映射为 `store.commit` 调用（需要在根节点注入 `store`）。
```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations ([
      'increment', // 将`this.increment()` 映射为`this.$store.commit('increment')`

      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations([
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    ])
  }
}
```
mutation都是同步事物，处理异步事物需要使用action.

### action
Action 类似于 mutation，不同在于：
* Action 提交的是 mutation，而不是直接变更状态。
* Action 可以包含任意异步操作。

让我们来注册一个简单的 action：
```js
const store = new Vuex.Store({
    state: {
        count: 0
    },
    motations: {
        increment(state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }
})
```
#### 分发 Action
Action 通过 store.dispatch 方法触发：
```js
store.dispatch('increment')
```

可以在 action 内部进行异步操作：
```js
action: {
  incrementAsync({commit}){
    setTimeout(() => {
      commit('increment')
    }, 1000)
  }
}
```
Actions 支持同样的载荷方式和对象方式进行分发：
```js
store.dispatch('incrementAsync', {
  amount: 10
})

store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```
来看一个官方文档上更加实际的购物车示例，涉及到调用异步 API 和分发多重 mutation：
```js
actions: {
  checkout ({ commit, state }, products) {
    // 把当前购物车的物品备份起来
    const savedCartItems = [...state.cart.added]
    // 发出结账请求，然后乐观地清空购物车
    commit(types.CHECKOUT_REQUEST)
    // 购物 API 接受一个成功回调和一个失败回调
    shop.buyProducts(
      products,
      // 成功操作
      () => commit(types.CHECKOUT_SUCCESS),
      // 失败操作
      () => commit(types.CHECKOUT_FAILURE, savedCartItems)
    )
  }
}
```
再来一个：
```js
// action.js
import axios from 'axios'
let url = '...'

async function loadmore(state) {
  let details = state.details
  let resp = await axios.get(url)
  return resp.data
}

export default {
  async moreDetails({commit, state}) {
    commit('loadmore', await loadmore(state))
  },
  changeAddress({commit, address}) {
    commit('CHANGEADDRESS', address)
  },
  async resetAddress({commit}) {
    let addresses = []
    try{
      let resp = await axios.get(`...`)
      addresses = resp.data
    } catch(e) {
      console.log(e)
    }

    commit('CHANGEADDRESS', addresses)
  }
}
```
#### 在组件中分发 Action
在组件中分发action有两种方式：
* 使用 `this.$store.dispatch('xxx')`
* 使用 `mapActions` 辅助函数将组件的 `methods` 映射为 `store.dispatch`来调用（需要在根节点注入store）
来个官网的例子：
```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```
#### 组合使用 Action
store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise。
```js
// 假设 getData() 和 getOtherData() 返回的是 Promise
actions: {
  async actionA ({ commit }) {
    commit('gotData', await getData())
  },
  async actionB ({ dispatch, commit }) {
    await dispatch('actionA') // 等待 actionA 完成
    commit('gotOtherData', await getOtherData())
  }
}
```

### module
由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块——从上至下进行同样方式的分割：
```js
const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const store = new Vuex.Store({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

store.state.a // -> moduleA 的状态
store.state.b // -> moduleB 的状态
```

[Vuex官方API文档](https://vuex.vuejs.org/zh-cn/api.html)
