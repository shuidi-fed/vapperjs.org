# 错误处理

正如[简介](/zh/introduction.html#错误处理)中描述的那样，服务端渲染的过程中如果发生了错误，我们有两种处理方式：回退到 `SPA` 模式或展示自定义错误页面。

## 回退 SPA 模式

### 自动回退 SPA 模式

这是 `Vapper` 的默认行为，当服务端渲染的过程中发生任何错误，`Vapper` 都会回退到 `SPA` 模式，即把 `SPA` 页面发送给客户端，如果该错误是一个仅在服务端才会出现的错误，或者该错误是一个非致命错误(指不影响用户继续使用我们的 `app`)，那么意味着用户可以继续使用我们 `app`。这在一些重要的场合是很有意义的，例如影响订单、支付等重转化率的场景。

### 对路由守卫中的错误特殊处理

`vapper` 的目标是：只要发生错误，就会自动回退 `SPA` 模式。但有一个例外，如果*异步的*路由守卫中发生错误，`vapper` 无法回退 `SPA` 模式，这是因为 `router.onError` 无法捕获 `Promises rejections`。因此我们需要手动 `try...catch` 路由守卫内的代码，请阅读：[捕获路由守卫中的错误](/zh/error-handling.html#捕获路由守卫中的错误)。

### 手动回退到 SPA 模式 <Badge text="Core 0.8.0+"/>

如果你选择 [自定义 Server](/zh/custom-server.html) 的话，你可能会编写自己的业务中间件，当用户编写的业务中间件出错时，`Vapper` 是捕获不到的，因此 `Vapper` 暴露了 `vapper.fallbackSPA(req, res)` 函数用于手动地回退到 `SPA` 模式，这样用户可以在自己编写的错误处理中间件中调用该方法以便手动地回退到 `SPA` 模式：

`vapper.fallbackSPA()` 函数接收两个参数，分别是 `Nodejs` 原生的请求对象 `req` 以及响应对象 `res`，如下是以 `Koa` 为例，展示如何在发生错误时手动地回退到 `SPA` 模式：

```js {17-30}
const Koa = require('koa')
const app = new Koa()
const Vapper = require('@vapper/core')

async function starter () {
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  const {
    options: {
      port,
      host
    }
  } = vapper

  await vapper.setup()

  // 错误处理中间件
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // 手动调用 vapper.fallbackSPA() 函数
      ctx.status = 200
      ctx.respond = false
      vapper.fallbackSPA(ctx.req, ctx.res)
    }
  })

  // 业务中间件写在这里
  // app.use(...)

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false
    vapper.handler(ctx.req, ctx.res)
  })

  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

关于如何自定义 `Server` 请阅读：[自定义 Server](/zh/custom-server.html)

### 自定义 fallback 逻辑 <Badge text="Core 0.13.0+"/>

默认情况下 `vapper` 内部使用 [serve-static](https://www.npmjs.com/package/serve-static) 提供静态资源服务，当用户请求到来时，`vapper` 会把 `dist/` 下的文件作为静态资源提供给用户，可以通过 [configuration#static](/zh/config.html#static) 选项配置 [serve-static#options](https://github.com/expressjs/serve-static#options)。

一般情况下这么做是没有问题的，但是我们通常会有独立的静态资源服务器或 `CDN`，这时我们的 `nodejs` 服务就变成了只服务 `dist/index.html` 这一个文件，由于 `dist/index.html` 文件的体积很小，因此我们可以在服务启动时将该文件读进内存，当有请求到来时将不会再产生文件 `IO`。为了实现这个目的，`vapper` 提供了 [configuration#fallbackSpaHandler](/zh/config.html#fallbackspahandler) 选项，允许你自定义回退 `SPA` 的逻辑，一个例子：

```js
// 1、在服务启动时，将构建所产生的 dist/index.html 文件读进内存
const spaHTMLContent = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')

// vapper.config.js
module.exports = {
  // 其他配置......

  // 自定义回退 SPA 的逻辑
  fallbackSpaHandler (req, res) {
    // 2、将内存中的字符串直接发送给客户端
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.end(spaHTMLContent)
  }
}
```

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

如果路由守卫中的代码出错怎么办呢？我们需要手动 `try...catch` 路由守卫内的代码，并在捕获到错误时将错误对象添加到 `router` 实例上，例如：

```js {6-14,21-22}
// 入口文件 src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()
  router.beforeEach((to, from, next) => {
    try {
      // 一些逻辑
    } catch (e) {
      // 当错误发生时，将错误对象赋值给 router.err 属性（router.err 属性是完全自定义的，你也可以命名为 router.error）。
      router.err = e
    }
    next()
  })


  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      // 当 router.err 或 this.error 存在时，就展示自定义页面
      return router.err || this.error ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

之所以我们没有使用 `router.onError` 是因为 `router.onError` 暂时无法捕获 `Promises rejections`，详情请查看：[https://github.com/vuejs/vue-router/issues/2833](https://github.com/vuejs/vue-router/issues/2833)。

## 最佳实践

由于只有异步的路由守卫中的错误才会打破 `vapper` 回退 SPA 的逻辑，因此我们的最佳实践是，只有路由守卫中发生错误时才展示自定义错误页面，其他情况下采用 `vapper` 自动的回退行为，即：

```js {20-21}
// 入口文件 src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()
  router.beforeEach((to, from, next) => {
    try {
      // 一些逻辑
    } catch (e) {
      // 当错误发生时，将错误对象赋值给 router.err 属性（router.err 属性是完全自定义的，你也可以命名为 router.error）。
      router.err = e
    }
    next()
  })

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      // 只有当 router.err 存在时，才展示自定义错误页面。我们并不关心 this.error
      return router.err ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

如上高亮代码所示，只有当 `router.err` 存在时，才展示自定义错误页面。我们并不关心 `this.error`，除非你明确地希望无论如何都要展示自定义错误页面。