---
title: vue+element后台管理搜索表单缓存
category: 前端
tags:
  - javascript
  - vue
  - element
date: 2019-06-22 10:41:53
---
在后台管理系统中经常会有这样的需求，从列表页跳转到详情页再返回列表后希望保持之前的查询条件，此类需求一般有以下几种处理方式可以参考。

<!-- more -->
## 新页面打开详情页

偷懒的做法是打开详情页时在新窗口打开，这样就可以保持列表页的搜索参数了，但是这样往往会打开很多的新页面，用户需要在多个页面直接来回切换操作繁琐，而且有个关键的问题是切换到列表页标签后数据并不是最新的，因为刚才在详情页已经编辑过数据了。我负责开发维护的后台管理系统在新建和编辑时是在不同的路由下调用同一个详情页组件来实现的，所以在编辑和新建请求完成之后详情页是否直接关闭还是让用户手动关闭是一个问题，新建页如果留给用户处理会连续创建多条相同数据的情况发生。而且连续打开多个页面标签页违背了单页面应用的初衷， 基于这些问题，我放弃了这种方式。
基于vue技术栈，在新标签页打开详情页主要有两种实现方式，一种是 `router-link`标签加`target="_blank"`属性，其原理是`a`标签的`target`属性。
```html
<router-link :to="{name: 'detail'}" target="_blank"></router-link>
```
另一种方式是js控制，其绑定的DOM元素渲染之后不再是`a`标签，而是一个`button`，页面跳转主要是基于`window`对象的功能实现的。
```html
<template>
  <el-button @click="handleToDetail(params)">detail</el-button>
</template>
<script>
export default{
  methods: {
    // 参数可以自定义,一般包含主键id等性质的参数
    handleToDetail(params) {
      const routerData = this.$router.resolve({name: 'detail', query: {params: params}})
      window.open(routerData.href, "_blank")
    }
  }
}
</script>
```
其中的`vue-router`特性不多说，具体可以查阅[官方文档](https://router.vuejs.org/zh/)。

## query携带查询参数

另一种实现方式是在路由跳转时在路由的`query`中把参数携带过去，返回时再带回来，列表页在`mounted`生命周期内对`query`进行处理，如果`query`中携带了查询参数则使用该查询参对数据进行赋值然后查询即可。
```html
<template>
  <div>
    <el-form :model="params" inline>
      <el-from-item prop="title">
        <el-input v-model="params.title"></el-input>
      </el-from-item>
      <el-from-item prop="title">
        <el-input v-model="params.title"></el-input>
      </el-from-item>
      <el-from-item prop="title">
        <el-input v-model="params.title"></el-input>
      </el-from-item>
      <el-form-item>
        <el-button @click="handleToDetail">detail</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      params: {
        id: '',
        title: '',
        desc: '',
        imgUrl: ''
      }
    }
  },
  mounted() {
    this.getSearchQueryIfExists()
    this.handleSearch()
  },
  methods: {
    // 路由跳转时把搜索表单参数转换成字符串赋值给searchQuyery携带过去 ，跳转回来时直接带回来
    handleToDetail() {
      const params = JSON.stringify(this.params)
      this.$router.push({name: 'detail', query: { id: this.params.id, searchQuyery: params }})
    },
    // 进入列表时，如果query中含有searchQuyery字段，则转换成对象赋值给查询对象参数即可
    getSearchQueryIfExists() {
      const { query = {} } = this.$router.query
      if(query.hasOwnProperty('searchQuyery')) {
        const stashQuery = JSON.parse(query.searchQuyery)
        this.params = stashQuery
      }
    }
  },
  // 发送查询http请求
  handleSearch() {
    // 。。。。
  }
}
</script>
```
这种实现方式可以基本满足要求，在页面较少或者项目中没有引入vuex时可以使用。缺点是需要缓存的页面较多时，需要重复进行处理，比较繁琐。

## 使用vuex缓存查询参数

如果需要缓存的页面较多，且系统中已经引入了`vuex`，则可以使用`vuex`缓存的方式来实现查询参数缓存。
首先需要把查询参数写入`vuex`中, 在`store`目录下创建一个用于缓存路由查询参数的文件，例如`routerCache.js`
```js
// routerCache.js
const routeCache = {
  state: {
    cachedRoutes: {}
  },
  mutations: {
    SET_CACHED_ROUTES: (state, route) => {
      const { name, query } = route
      state.cachedRoutes[name] = query
    }
  },
  actions: {
    setCachedRoutes({ commit }, route) {
      commit('SET_CACHED_ROUTES', route)
    }
  }
}
export default routeCache
```

在`getter`中引入。
```js
// getter.js
const getters = {
  cachedRoutes: state => state.routeCache.cachedRoutes,
}
export default getters
```
其中，`name`是路由的`name`属性值，查询参数`query`保存在`name`中，当然也可以使用路由的`path`做为键，区别在于是否区分动态路由。`query`可以是对象，也可以是JSON化的字符串，建议使用JSON字符串进行保存。
接下来是在查询时调用`actions`中的`setCachedRoutes()`方法保存页面查询参数和进入页面后获取`getter`中缓存的值。这部分涉及`vuex`的使用方式，不太清楚可以查阅[官方文档](https://vuex.vuejs.org/zh/guide/)。这部分我们可以使用`mixin`进行封装，暴露出两个方法来保存和获取缓存即可。如下所示：
```js
// mixins/queryCache.js
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      searchKey: '' // 每个页面查询表单`model`绑定的值可能不一样，使用此变量来接收查询对象的 key 值
    }
  },
  computed: {
    ...mapGetters(['cachedRoutes'])
  },
  methods: {
    ...mapActions(['setCachedRoutes']),
    /**
     * 设置路由缓存相关配置
     * @param: queryKey 页面搜索表单对象的key
     */
    setSearchQuery(queryKey) {
      const name = this.$route.name
      if (typeof this.setCachedRoutes === 'function') {
        this.setCachedRoutes({ name: name, query: JSON.stringify(this[queryKey]) })
      }
    },
    /**
     * 获取路由缓存相关配置
     * @param: queryKey 页面搜索表单对象的key
     */
    getSearchQuery(queryKey) {
      // 如果使用 路由 的 name属性缓存的话，这里就取当前页面路由的 name值，如果使用了 path 缓存替换即可
      const name = this.$route.name
      const cachedRoutes = this.cachedRoutes || {}
      if (cachedRoutes.hasOwnProperty(name)) {
        const target = JSON.parse(cachedRoutes[name])
        this[queryKey] = Object.assign({}, target）
      }
    }
  }
}
```
如果需要缓存查询参数对象之外的方法，则需要在`getSearchQuery`和`setSearchQuery`中添加特殊情况下的判断逻辑即可。其中`setSearchQuery`可以在点击搜索按钮或发送查询请求时进行调用，区别在是否需要缓存分页查询相关参数。`getSearchQuery`必须在`created`或`mounted`生命周期中掉用，将缓存的数据赋值给查询对象之后调用页面的查询请求，这样就实现了路由跳转的查询数据缓存。
页面中调用方法代码如下：
```js
import CacheQuery from '../mixins/queryCache' // 具体路径按项目实际路径

export default {
  data() {
    reutrn {
      // 查询表单数据对象
      params: {

      }
    }
  }，
  mounted() {
    // 获取vuex中的缓存，赋值
    this.getSearchQuery('params')
    // 然后按缓存的参数查询
    this.getList()
  },
  methods: {
    // 搜索点击事件监听
    handleSearch() {
      // 缓存搜索参数
      this.setSearchQuery('params')
      // 查询数据
      this.getList()
    },
    async getList() {
      // 获取数据发送请求
      let resp = await axios.get('/api/get/list')
    }
  }
}
```

需要注意的是，如果要缓存分页参数，可能会发现一个问题。示例如下：
```js
// 查询参数对象:
searchParams: {
  id: '',
  title: '',
  status: '',
  current_page: 1, // 当前页
  page_size: 10， // 每页多少数据
}
```
分页组件：
```html
<el-pagination
  :total="page.total"
  :current-page="searchParams.page_index"
  @current-change="handleCurrentChange"/>
```
如果查询参数中包含了分页组件中的两个参数，在调用了`getSearchQuery`方法对其进行赋值之后，即便发送请求时的`current_page`是2，`el-pagination`组件中显示的仍然是在页面的`data`中初始化时的默认值，研究了element分页组件的源码，发现其改变`current-page`只能通过监听`current-change`来实现，而在上文中缓存了数据之后直接赋值是无法实现响应的, 如下图:

<img style="height: 200px; text-align: left"  src="https://camo.githubusercontent.com/4374fd8950b1b788fe9642b70b36e9e9ef2b7627/68747470733a2f2f75706c6f61642d696d616765732e6a69616e7368752e696f2f75706c6f61645f696d616765732f363731393838352d373435666433626362366637306337302e706e673f696d6167654d6f6772322f6175746f2d6f7269656e742f7374726970253743696d61676556696577322f322f772f31323430">

分享告一段落啦，如果您有其他的实现方式可以留言交流啊，感谢！

