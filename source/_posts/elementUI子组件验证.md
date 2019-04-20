---
title: elementUI表单使用自定义组件并获取子组件验证
category: javascript
tags:
  - javascript
date: 2019-04-20 11:04:54
---

最近工作中很多次遇到一种情况，表单元素中某个字段是对象组成的数组，需要使用自定义组件来遍历数组，每个数组元素对象中的许多字段需要单独封装成自定义组件，在父组件中使用`v-model`方式来实现响应式的调用。这样做的好处是可以利于组件独立运行环境的特性，有效的区分了父组件表单中数组字段下各个对象的独立。
<!-- more -->

假如父组件中的表单数据是这种格式的：
```js
data() {
  return {
    info: {
      id: '',
      start_time: '',
      end_time: '',
      items: [{
        title: '',
        desc: '',
        type: '',
        img_url: ''
      }, {
        title: '',
        desc: '',
        type: '',
        img_url: ''
      }]
    }
  }
}
```
要使用elementUI的 `form`组件来实现表单的数据渲染，其中items部分最合理的方式是抽离出单独的组件，在父组件中遍历该数组字段，每一项单独渲染该子组件。

## 子组件定义
假设子组件这样定义：
```js
<template>
  <div>
    <el-form ref="item" :model="content" :rules="rules">
      <el-form-item prop="title" label="title">
        <el-input v-model="content.title" />
      </el-form-item>
      <el-form-item prop="desc" label="desc">
        <el-input v-model="content.desc" />
      </el-form-item>
      <el-form-item prop="type" label="type">
        <el-input v-model="content.type" />
      </el-form-item>
      <el-form-item prop="img_url" label="img">
        <el-input v-model="content.img_url" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'Child',
  props: {
    value: {
      type: Object,
      default() {
        return {
            title: '',
            desc: '',
            type: '',
            img_url: ''
        }
      }
    },
    index: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      content: { ...this.value },
      rules: {
        title: [{required: true, trigger: 'blur'}],
        desc: [{required: true, trigger: 'blur'}],
        type: [{required: true, trigger: 'blur'}],
        img_url: [{required: true, trigger: 'blur'}],
      }
    }
  },
  computed: {
    // 定义该变量是为了便于监听对象的变化，特别是多层嵌套的对象非常有效
    contentStr() {
      return JSON.stringify(this.content)
    }
  },
  watch: {
    // 监听对象每个字段的改变，另一种方法是使用deep属性，具体可以查阅vue文档
    contentStr(value) {
      this.update()
    }
  },
  methods: {
    update() {
      // input 事件父组件可以监听到，具体下文会介绍，这里是把子组件的变更通过事件告诉父组件，实现子组件向父组件的数据传递
      this.$emit('input', this.content)
    },
    formValidate() {
      let flag = false
      this.$refs['item'].validate(valid => {
        flag = valid
        // 如果需要进行信息提示
        if (!valid) {
          this.$message(`第${index}条数据未填写完!`)
        }
      })
      return flag
    }
  }
}
</script>
```
自定义组件中props中的value属性是vue默认的，可以接收调用时绑定在`v-model`上的属性，子组件中给`value`设置默认值可以避免一些初始化时缺少字段的报错。
为了让`v-model`正常工作，这个组件内必须：
- 将其`value`特性绑定到一个名为`value`的prop上
- 将其`input`事件触发时，将新的值通过自定义的`input`事件抛出
```html
<input v-model="title">
<!-- 等价于 -->
<input v-bind:value="title" v-on:input="title = $event.target.value"/>
```

子组件需要实时的把数据的变化告诉父组件，所以需要wath数据的变化，如果传给子组件的数据只是简单的对象类型，即对象的字段都是简单类型，可以直接使用vue中watch的高级用法，
定义handler方法，使用immediaate和deep属性，具体可以参考[Vue.js中 watch 的高级用法](https://juejin.im/post/5ae91fa76fb9a07aa7677543),更标准的使用方式可以查阅官方文档。在本文例子中可以这样使用：
```js
watch: {
  content:{
    handler(newVal, oldVal) {
      this.$emit('input', this.content)
    },
    deep: true // deep属性默认为false, 表示十分深度监听
  }
}
```
介绍完了子组件中数据的处理，接下来说一下父组件中如何使用。

## 父组件调用自定义组件
前面已经定义了自定义组件，可以支持数据的双向绑定，父组件调用自定义子组件时可以像elementUI中的表单组件一样使用，示例如下：
```js
<template>
  <el-form :model="info" ref="form">
    <!-- 为简化类型，这里无关的字段都使用el-input -->
    <el-form-item prop="start_time" lable="start time">
      <el-input v-model="info.start_time" />
    </el-form-item>
    <el-form-item prop="end_time" lable="end time">
      <el-input v-model="info.end_time" />
    </el-form-item>
    <!-- 遍历数组，循环调用自定义子组件 -->
    <div v-for="(content, index) in info.items" v-show="(currentIndex - 1) === index" :key="index">
      <el-form-item prop="item" lable="item">
        <st-item v-model="info.items[index]" :index="index" :ref="index + '_item'"/>
      </el-form-item>
    </div>
  </el-form>
</template>
<script>
import Item from './item.vue'

export default {
  name: 'Parents',
  components: {
    'st-item': Item
  },
  data() {
    return {
      currentIndex: 0, // 控制显示当前的是哪个item
      info: {
        id: '',
        start_time: '',
        end_time: '',
        items: [{
          title: '',
          desc: '',
          type: '',
          img_url: ''
        }, {
          title: '',
          desc: '',
          type: '',
          img_url: ''
        }]
      }
    }
  },
  methods: {

  }
}
</script>
```

### 子组件表单验证
接下来说如何在父组件提交数据时验证子组件的是否已通过验证。
刚才子组件中定义了一个方法 `formValidate`, 该方法会将子组件的验证结果返回，在父组件中调用该方法即可获得子组件的验证结果。
```js
methods: {
  submit() {
      // 调用子组件验证，验证结果赋值给isValid变量
    let isValid = Object.keys(this.info.item).every(key => this.$refs[key + '_item'].formValidate())
    if (!isValid) {
      return false
    }
    // ..
  }
}
```

参考文献： https://blog.csdn.net/ligang2585116/article/details/79475652
