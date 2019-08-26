# 错误处理

正如[简介](/zh/introduction.html#错误处理)中描述的那样，服务端渲染的过程中如果发生了错误，我们有两种处理方式：回退到 `SPA` 模式或展示自定义错误页面。

## 回退 SPA 模式

这是 `Vapper` 的默认行为，当服务端渲染的过程中发生任何错误，`Vapper` 都会回退到 `SPA` 模式，即把 `SPA` 页面发送给客户端，如果该错误是一个仅在服务端才会出现的错误，或者该错误是一个非致命错误(指不影响用户继续使用我们的 `app`)，那么意味着用户可以继续使用我们 `app`。这在一些重要的场合是很有意义的，例如影响订单、支付等重转化率的场景。

## 自定义错误页面

当然，如果你希望错误发生时把错误页面展示给用户也非常简单。

### 根组件的 `this.error` 属性

`Vapper` 给根组件实例注入了 `error` 属性，它是一个错误对象，保存着错误信息。因此可以通过检测 `this.error` 是否存在来决定渲染什么内容，如下代码所示：

```js {11}
// 入口文件：src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

在根组件的 `render` 函数内，如果 `this.error` 存在则展示自定义的内容给用户，否则正常渲染应用程序。你可以渲染任何你想要的内容，例如 `Error.vue` 组件：

```js
import Error from './Error.vue'

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h(Error, { props: { error: this.error } }) : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

### 错误对象

`this.error` 只存在于根组件实例上，它是一个错误对象：

```js
{
  url: to.path, // 发生错误的 url
  code: 404,    // 错误码
  message: 'Page Not Found' // 错误信息
}
```

虽然它是一个错误对象，但其实你可以在运行时为它赋予任何值，但好的实践是：为它赋予与上面代码中展示的对象拥有相同结构的错误对象。

### 捕获路由守卫中的错误

对于复杂的应用程序，例如需要进行权限控制的应用来说，在路由守卫中编写相应的鉴权逻辑是很正常的事情，例如：

```js
router.beforeEach(() => {
  // 一些逻辑
})
```

如果路由守卫中的代码出错怎么办呢？我们可以使用 [vue-router](https://router.vuejs.org/) 原生提供的 `onError` 函数捕获错误：

```js {8-11,17}
// 入口文件 src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // Use `router.onError` to catch routing errors
  router.onError((err) => {
    // 将错误对象赋值给根组件实例的 error 属性
    router.app.error = err
  })

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

:::warning
router.onError 暂时无法捕获 `Promises rejections`，详情请查看：[](https://github.com/vuejs/vue-router/issues/2833)。
:::

### 异步错误处理

