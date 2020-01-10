# 从 v0.x 迁移到 v1.0

[[toc]]

## 入口文件中 `createApp` 函数的返回值

- 在 `v0.x` 中：

`createApp` 函数的返回值是一个对象，其中包含应用实例(`new Vue()`)、路由实例等：

```js
export default function createApp() {
  const router = new VueRouter({/* ... */})
  const app = new Vue({/* ... */})

  return { app, router }
}
```

- 在 `v1.0` 中：

`createApp` 函数要求返回根组件选项(`rootOptions`)：

```js
export default function createApp() {
  const router = new VueRouter({/* ... */})

  // rootOptions
  const app = {
    router,
    render: h => h('div')
    // ...
  }

  return app
}
```

## 移除 `ctx.replaceState()`

- 在 `v0.x` 中：

创建 `store` 实例后，需要立即调用 `ctx.replaceState()`：

```js
// The Entry file

export default function createApp () {
  // ...

  // Create store instance
  const store = createStore()
  ctx.replaceState(store) // This is necessary, vapper will use it to mix data(from server to client).

  // ...

  // return
  return { app, router, store }
}
```

- 在 `v1.0` 中：

不再需要调用 `ctx.replaceState()`：

```js
// The Entry file

export default function createApp () {
  // ...

  // Create store instance
  const store = createStore()

  const app = {
    // ...
    store
  }

  // return
  return app
}
```

## `@vapper/plugin-cookie`

- 在 `v0.x` 中：

为了在组件内访问到 `$cookie`，我们需要手动编写 `mixin`：

```js
// Entry file

Vue.mixin({
  created () {
    this.$cookie = this.$root.$options.$cookie
  }
})

export default function createApp (ctx) {
  new Vue({
    $cookie: ctx.$cookie
    // other options...
  })
}
```

- 在 `v1.0` 中：

不再需要手动编写 `mixin` 即可直接在组件中使用。

## context 对象的变更

### 客户端 context

- 在 `v0.x` 中：

客户端的 `context` 对象如下：

```js
context = {
  Vue,  // the Vue constructor
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

- 在 `v1.0` 中：

去掉了 `Vue`：

```js
context = {
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

### 服务端 context

- 在 `v0.x` 中：

服务端的 `context` 对象如下：

```js
context = {
  Vue,  // Vue 构造函数
  type: TYPE, // type 是 'server' 或者 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions,  // createApp.pluginRuntimeOptions
  req: context.req, // 请求对象
  res: context.res, // 响应对象
  isFake  // 布尔值，标识着是否进行真正的渲染
}
```

- 在 `v1.0` 中：

去掉了 `Vue`，并添加了 `context.url`：

```js
context = {
  type: TYPE, // type 是 'server' 或者 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions,  // createApp.pluginRuntimeOptions
  req: context.req, // 请求对象
  res: context.res, // 响应对象
  isFake,  // 布尔值，标识着是否进行真正的渲染
  url: req.url  // 请求的 url
}
```

## 错误处理 - 自定义错误页面

在 `v1.0` 中我们对错误处理进行了重构，核心规则如下：

- 如果 `enableCustomErrorPage: false`，则回退 `SPA`。

- 如果 `enableCustomErrorPage: true`，但是没有提供 `ErrorComponent` 组件，则回退 `SPA`。

- 如果 `enableCustomErrorPage: true`，并且提供了 `ErrorComponent` 组件，但 `ErrorComponent` 组件内部出错，则回退 `SPA`。

**换句话说，可以有选择的在 `ErrorComponent` 组件内抛出错误，来实现在自定义错误页面和回退 `SPA` 这两个模式间自由切换。**

详情请阅读：[错误处理 - 自定义错误页面](/zh/error-handling.html#自定义错误页面)