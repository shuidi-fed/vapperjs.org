# 错误处理

正如[简介](/zh/introduction.html#错误处理)中描述的那样，服务端渲染的过程中如果发生了错误，我们有两种处理方式：回退到 `SPA` 模式或展示自定义错误页面。

## 回退 SPA 模式

### 自动回退 SPA 模式

这是 `Vapper` 的默认行为，当服务端渲染的过程中发生任何错误，`Vapper` 都会回退到 `SPA` 模式，即把 `SPA` 页面发送给客户端，如果该错误是一个仅在服务端才会出现的错误，或者该错误是一个非致命错误(指不影响用户继续使用我们的 `app`)，那么意味着用户可以继续使用我们 `app`。这在一些重要的场合是很有意义的，例如影响订单、支付等重转化率的场景。

### 手动处理路由守卫中的错误

通常情况下，一旦有错误发成，`vapper` 会自动回退 `SPA` 模式，前提是 `vapper` 能够捕获到错误才行。然而当一个异步链条断开时，这些错误是 `vapper` 捕获不到的，例如路由守卫中的错误：

```js
router.beforeEach((to, from, next) => {
  if (to.path === '/bar') {
    throw Error('error in the routing guard')
  }
})
```

为了让 `vapper` 能够捕获到路由守卫中的错误，我们需要手动 `try...catch` 路由守卫内部的代码，并调用 `next(err)`，如下代码所示：

```js {8}
router.beforeEach((to, from, next) => {
  try {
    if (to.path === '/bar') {
      throw Error('error in the routing guard')
    }
    next()
  } catch (e) {
    next(e)
  }
})
```

### 手动回退到 SPA 模式

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

### 自定义 fallback 逻辑

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

### enableCustomErrorPage 选项

`vapper` 的核心目标是只要有错误发生就会回退 `SPA` 模式，如果你需要自定义错误页面，则需要在 `vapper.config.js` 配置文件中开启 `enableCustomErrorPage` 选项：

```js
// vapper.config.js

module.exports = {
  enableCustomErrorPage: true
}
```

### ErrorComponent 组件

开启 `enableCustomErrorPage` 之后，还需要提供 `ErrorComponent` 组件，顾名思义，当错误发生时会渲染该组件的内容作为错误页面展示给用户：

```js {1,10}
// Importing the `ErrorComponent` component
import ErrorComponent from 'ErrorComponent.vue'

// Export factory function
export default function createApp () {
  // 1. Create a router instance
  // ...

  // 2. Create a root component
  const app = {
    ErrorComponent,
    router,
    // This is necessary, it is for vue-meta
    head: {},
    render: h => h(App)
  }

  // 3. return the root component
  return app
}
```

`ErrorComponent` 有一个名为 `error` 的 `props`：

```js
// ErrorComponent
export default {
  name: 'ErrorComponent',
  props: ['error'],
  render(h) {
    return h('h1', this.error.code + ',' + this.error.message)
  }
}
```

### 错误对象

`error` 对象是一个 [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 实例，在任何情况下你都可以抛出一个错误对象，这个错误对象将会作为 `ErrorComponent` 组件的 `props`，并在该错误对象上添加相应的 `code` 和 `message`，以便在 `ErrorComponent` 组件内使用。

需要注意的是，`error.code` 会被用于服务器响应的 `statusCode`，而 `error.message` 会用于服务器响应的 `statusMessage`，下面是一个例子：

- 在路由守卫中抛出错误：

```js {8-9}
router.beforeEach((to, from, next) => {
  try {
    if (to.path === '/bar') {
      const error = Error('error in the routing guard')
      throw error
    }
  } catch (e) {
    e.code = 500
    e.message = 'Internal Server Error'
    next(e)
  }
  next()
})
```

### 404 页面

当用户访问不存在的路由时，错误对象 `error` 的内容如下：

```js
error = {
  url: '/foo',
  code: 404,
  message: 'Page Not Found'
}
```

可直接在 `ErrorComponent` 中使用。

## 错误处理的规则

- 如果 `enableCustomErrorPage: false`，则回退 `SPA`。

- 如果 `enableCustomErrorPage: true`，但是没有提供 `ErrorComponent` 组件，则回退 `SPA`。

- 如果 `enableCustomErrorPage: true`，并且提供了 `ErrorComponent` 组件，但 `ErrorComponent` 组件内部出错，则回退 `SPA`。

**换句话说，可以有选择的在 `ErrorComponent` 组件内抛出错误，来实现在自定义错误页面和回退 `SPA` 这两个模式间自由切换。**