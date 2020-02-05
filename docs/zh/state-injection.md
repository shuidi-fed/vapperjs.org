# State Injection <Badge text="1.2.0+"/>

如官方文档中介绍的那样：[Final State Injection](https://ssr.vuejs.org/guide/data.html#final-state-injection)，服务端渲染的过程中会进行数据预取，这些数据会经过序列化并嵌入到 `html` 字符串之后一同发送给客户端(即：`window.__INITIAL_STATE__`)。

在使用 `vapper` 开发项目时，这一切都是 `vapper` 自动完成的，然而，有时候你或许需要序列化自定义的数据并注入到 `window.__INITIAL_STATE__` 中，`vapper` 提供了这样的能力，如下高亮的代码所示：

```js {9-11,20}
import Vue from 'vue'
import createRouter from './createRouter'
import App from './App.vue'

Vue.config.productionTip = false

// Export factory function
export default function createApp () {
  const initialState = {
    foo: 1
  }

  // 1. Create a router instance
  const router = createRouter()

  // 2. Create root component option
  const app = {
    router,
    head: {},
    initialState,
    render: h => h(App)
  }

  // 3. return
  return app
}
```

可以在根组件选项中添加 `initialState` 属性，它必须是一个对象，这个属性下的所有字段都会被序列化并发送给客户端，如上代码最终会得到：

```js
window.__INITIAL_STATE__ = {
  foo: 1
  // 其他...
}
```

通常也可以在路由守卫中设置 `initialState`：

```js {9,14-19,25}
import Vue from 'vue'
import createRouter from './createRouter'
import App from './App.vue'

Vue.config.productionTip = false

// Export factory function
export default function createApp () {
  const initialState = {}

  // 1. Create a router instance
  const router = createRouter()
  
  router.beforeEach((from, to, next) => {
    setTimeout(() => {
      initialState.foo = 1
      next()
    }, 1000)
  })

  // 2. Create root component option
  const app = {
    router,
    head: {},
    initialState,
    render: h => h(App)
  }

  // 3. return
  return app
}
```

这启发我们可以在路由守卫中发送异步请求，待数据返回后再设置 `initialState` 的值。