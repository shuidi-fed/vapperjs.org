# 入口文件

## 避免状态单例

为了避免交叉请求导致的状态污染，我们需要在入口文件导出一个工厂函数。在工厂函数内部，我们为每个请求创建新的应用程序实例、路由实例等。你可以阅读官方文档以了解更多关于 [避免状态单例](https://ssr.vuejs.org/zh/guide/structure.html#%E9%81%BF%E5%85%8D%E7%8A%B6%E6%80%81%E5%8D%95%E4%BE%8B) 的信息。

最简单的入口文件应该包含如下内容：

- 1、`Vapper` 应用要求你必须使用 [vue-router](https://router.vuejs.org/)。
- 2、使用 `export default` 语句导出工厂函数，工厂函数需要返回一个对象，它应该至少包含应用实例(`app`)和路由实例(`router`)。

如下是一个例子：

```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VueRouter)

// Export factory function
export default function createApp () {
  // 1. Create a router instance
  const router = new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('./components/HelloWorld.vue'),
        meta: {
          ssr: true
        }
      }
    ]
  })

  // 2. Create a app instance
  const app = new Vue({
    router,
    // This is necessary, it is for vue-meta
    head: {},
    render: h => h(App)
  })

  // 3. return
  return { app, router }
}
```

`Vapper` 的默认入口文件是 `src/main.(j|t)s` 文件，你可以通过在 `vapper.config.js` 文件中修改此配置，查看 [config](/zh/config.html)。

## Context

工厂函数接受 `Context` 对象作为参数：

```js
// src/main.js
export default function createApp (context) {/* ... */}
```

可以通过 `context.type` 来区分是客户端渲染函数服务端渲染：

```js
export default function createApp ({ type }) {
  console.log(type) // 'client' or 'server'
}
```

完整的 `Context` 对象如下：

- 在客户端：

```js
context = {
  Vue,  // Vue 构造函数
  type: TYPE, // type 是 'server' 或者 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

- 在服务端：

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

## 独立环境的入口文件

你或许会遇到这样的场景，你有一端代码，并且只想让它运行在客户端，或只想让它运行在服务端。举一个常见的例子，我们通常需要获取 `cookie`，在客户端中，可以使用 `document.cookie` 得到 `cookie`，但是这段代码不能运行在服务端，在服务端我们要从请求对象中得到 `cookie`，因此我们可以在入口文件编写如下代码：

```js
export default function createApp ({ type, req }) {
  let cookie = type === 'server' ? req.getHeader('Cookie') : document.cookie
}
```

这么写没有什么问题，但是一旦像这样需要区分环境的代码变得越来越多，那么入口文件将会越来越臃肿，这时我们可以分别在 `src/` 目录下创建 `client.js` 以及 `server.js` 文件，顾名思义，`client.js` 文件只会在客户端运行，而 `server.js` 文件则只会在服务端运行。因此我们可以修改如上代码为：

- `src/client.js`

```js
export default function (context) {
  console.log(document.cookie)
}
```

- `src/server.js`

```js
export default function (context) {
  console.log(context.req.getHeader('Cookie'))
}
```

实际上 `@vapper/plugin-cookie` 就是以这种方式来实现的，可以通过源码来了解：[vapper-plugin-cookie/lib/cookie.js](https://github.com/shuidi-fed/vapper/blob/master/packages/vapper-plugin-cookie/lib/cookie.js)

`src/client.js` 和 `src/server.js` 是 `vapper` 默认识别的文件，当然，如果你的项目使用 `TypeScript`，那么则会识别 `src/client.ts` 和 `src/server.ts` 文件，并且它们是可以通过 `vapper.config.js` 修改的：

```js
// vapper.config.js
module.exports = {
  clientEntry: './my-client-entry.js',
  serverEntry: './my-server-entry.js'
}
```

## 插件的运行时选项

`Vapper` 的插件可以在运行时的层面增强我们的应用，有的插件会接收运行时的参数，允许用户对插件的功能进行配置。我们可以在入口文件所导出的工厂函数上添加 `pluginRuntimeOptions` 属性，所有运行时插件都会读取该属性并提取自己想要的信息，例如：

```js {8-12}
// 入口文件

// Export factory function
export default function createApp () {
  // 省略....
}

// 将插件的运行时选项添加到 pluginRuntimeOptions 对象下
createApp.pluginRuntimeOptions = {
  // @vapper/plugin-cookie
  cookie: { fromRes: true }
}
```

如上代码展示了如何给 `@vapper/plugin-cookie` 插件提供运行时选项（`@vapper/plugin-cookie` 插件会读取 `pluginRuntimeOptions.cookie` 属性作为选项）。

阅读 [使用插件](/zh/using-plugin.html#官方插件) 和 [插件开发](/zh/write-plugin.html) 以了解更多有关插件的详细信息。

