# 插件开发

## 基础

一个插件就是一个函数：

```js
// myVapperPlugin.js
module.exports = (api) => {
  // ...
}
```

该函数接收 `PluginApi` 实例作为参数，它提供了诸多方法，让你介入 `Vapper` 的核心，同时也提供了很多工具函数。

## 调试插件

在[使用插件](/zh/using-plugin.html#基本使用)一节中我们了解到，插件可以是一个函数：

```js
// vapper.config.js
const myVapperPlugin = require('./myVapperPlugin.js')

module.exports = {
  plugins: [myVapperPlugin]
}
```

因此你可以简单的引入本地插件并调试。

## 注册服务器中间件

使用 `api.use()` 函数注册服务器中间件：

```js
// myVapperPlugin.js
module.exports = (api) => {
  api.use('before:render', (req, res, next) => {
    console.log('Before rendering')
    next()
  })

  api.use('after:render', (err, req, res, next) => {
    if (err) {
      console.log('Do something')
      next(err)
    }
    console.log('After rendering')
    next()
  })
}
```

中间件的编写需要遵守 [connect](https://github.com/senchalabs/connect)。

`Vapper` 的服务端渲染本质上是一个服务器中间件，我们暂时叫它“渲染中间件”，因此在使用 `api.use()` 函数注册中间件时，既可以注册在“渲染中间件”之前执行的中间件，也可以注册在“渲染中间件”之后执行的中间件：

```js
// myVapperPlugin.js
module.exports = (api) => {
  // 在渲染中间件之前
  api.use('before:render', (req, res, next) => {})
  // 在渲染中间件之后
  api.use('after:render', (err, req, res, next) => {})
}
```

实际上，当注册在“渲染中间件”之前执行的中间件时，可以省略 `'before:render'`：

```js
// myVapperPlugin.js
module.exports = (api) => {
  // 在渲染中间件之前
  api.use((req, res, next) => {})
  // 在渲染中间件之后
  api.use('after:render', (err, req, res, next) => {})
}
```

大多数情况下，你可能需要自定义服务器，关于自定义服务器的内容可以阅读：[自定义 Server](/zh/custom-server.html#connect)。当自定义服务器时，你不需要以插件的形式注册中间件，因为你可以直接在你的自定义 `Server` 中使用相应的中间件即可。

## 注册命令

通过插件可以注册新的 `CLI` 命令，需要在插件模块导出 `module.exports.CLI` 函数：

```js
// myVapperPlugin.js
module.exports = (api, options) => {
  api.$someFn = () => {
    console.log('Do something')
  }
}

module.exports.CLI = (Vapper) => {
  Vapper.cli
    .command('custom', 'Custom command')
    .allowUnknownOptions()
    .action(async flags => {
      const vapper = new Vapper({ ...(flags || {}), mode: 'production' })
      vapper.$someFn()
    })
}
```

`module.exports.CLI` 函数接受 `Vapper` 类作为参数，`Vapper.cli` 是命令行程序实例，`Vapper` 采用 [CAC](https://github.com/cacjs/cac) 作为命令行解析工具，因此注册新命令的方式可以查看 [CAC](https://github.com/cacjs/cac) 的文档。

注册新命令之后，我们就可以通过 `vapper custom` 的方式运行该命令，另外，我们可以通过在 `api` 上添加函数，例如上面代码中的 `api.$someFn`，该函数可以在命令行的 `action` 通过 `Vapper` 实例调用。

可以查看 [@vapper/plugin-prerender](https://github.com/vapperjs/vapper/blob/master/packages/vapper-plugin-prerender/lib/index.js) 的代码作为参考案例。

## 运行时增强

在之前的介绍中，插件的能力仅限于非运行时层面，无法扩展应用的运行时能力。但实际上扩展应用的运行时能力是很重要的，例如 [@vapper/plugin-cookie](/zh/using-plugin.html#vapper-plugin-cookie) 插件就扩展了 `Vapper` 应用的运行时能力，使得我们能够同构的操作 `cookie`。

开发运行时插件与开发普通插件基本相同，同样是导出一个函数：

```js
// myVapperPlugin.js
module.exports = (api) => {}
```

只不过我们需要使用 `api.addEnhanceFile` 函数，动态添加运行时代码：

```js
// myVapperPlugin.js
module.exports = (api) => {
  api.addEnhanceFile({
    // 该文件的代码仅在客户端运行
    client: path.resolve(__dirname, './client.js'),
    // 该文件的代码仅在服务端运行
    server: path.resolve(__dirname, './server.js'),
    // clientModuleName 是必须得，提供一个模块名称
    clientModuleName: 'cookie'
  })
}
```

接着我们可以分别编写 `client.js` 和 `server.js` 文件：

```js
// client.js
export default function (ctx) {
  // ......
}
```

```js
// server.js
export default function (ctx) {
  // ......
}
```

无论是 `server.js` 还是 `client.js` 都需要有一个默认导出的函数，并接受 [ctx](/zh/entry.html#context) 作为参数，如下是 [ctx](/zh/entry.html#context) 的内容：

```js
ctx = {
  Vue,  // Vue 构造函数
  pluginRuntimeOptions, // 它的值为入口文件导出的 createApp.pluginRuntimeOptions = {}
  type, // 在 `server.js` 文件中它的值为 'server'，在 `client.js` 中它的值为 'client'
  req,  // 请求对象，仅在 `server.js` 中可用
  res,  // 响应对象，仅在 `server.js` 中可用
  isFake  // 布尔值，标识着是否进行真正的渲染，后文会详细讲解，仅在 `server.js` 中可用
}
```

有了这些能力之后，我们可以尝试着编写运行时增强插件，接下来我们开发一个为 [context](/zh/entry.html#context) 注入 `$logger` 的函数为例，讲解如何开发运行时增强插件。

运行时插件的主要作用是：对渲染环境对象(`ctx`)进行增强，如下代码所示，我们在 `ctx` 对象上添加了 `.$logger` 属性：

```js
// client.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

在 `server.js` 中也可以使用同样的代码：

```js
// server.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

也许你已经注意到了，相同的代码我们分别在 `client.js` 和 `server.js` 中编写了两次，实际上，`client.js` 和 `server.js` 完全可以是相同的文件：

```js {4-5}
// myVapperPlugin.js
module.exports = (api) => {
  api.addEnhanceFile({
    client: path.resolve(__dirname, './logger.js'),
    server: path.resolve(__dirname, './logger.js'),
    clientModuleName: 'logger'
  })
}
```

如上代码所示，我们将 `client` 和 `server` 指向了相同的 `logger.js` 文件，这样我们只需要编写一次代码即可：

```js
// logger.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

但有些代码只能运行在服务端或客户端，这时候我们需要使用 `type` 来区分当前代码的运行环境：

```js
// logger.js
export default function (ctx) {
  const isServer = ctx.type === 'server'
  if (isServer) {
    ctx.$logger = customLogger
  } else {
    ctx.$logger = console.log
  }
}
```

既然一个文件就可以满足需求，为什么要设计 `client.js` 和 `server.js` 两个文件呢？实际上只使用一个文件的确可以满足需求，但这会导致 `Webpack` 打包之后，客户端的包中存在服务端的代码，同样的服务端中也会存在客户端的代码，这虽然不会影响代码的正常运行，但是却增加了包的体积，因此如果客户端的代码和服务端的代码相差较大，建议分开两个文件编写。

运行时插件通过在 `ctx` 上添加新的属性，从而增强了 `ctx` 对象，因此，我们可以在入口文件中使用它：

```js {4}
// 入口文件

export default function createApp (ctx) {
  ctx.$logger // 通过 ctx 访问 $logger
  
  // 省略...

  return { app, router }
}
```

## 为插件传递参数

如上所述，插件可以增强运行时的能力，也可以注册新的 `CLI` 命令和服务器中间件，不同的插件接收参数的方式不同。对于那些增强运行时能力的插件，我们需要通过入口文件导出的 `createApp.pluginRuntimeOptions` 传递参数，例如：

```js
// 入口文件
export default function createApp () {}

createApp.pluginRuntimeOptions = {
  logger: {/* ... */}
}
```

这样在运行时文件中，我们可以像如下这样获取参数：

```js
// server.js 或 client.js
export default function ({ Vue, pluginRuntimeOptions }) {
  console.log(pluginRuntimeOptions.logger)
}
```

对于那些不会增强运行时能力的插件，我们只需要在 `vapper.config.js` 中为插件传递参数即可：

```js
const myVapperPlugin = require('./myVapperPlugin')
// vapper.config.js
module.exports = {
  plugins: [
    [myVapperPlugin, { /* plugin options */ }]
  ]
}
```

:::tip
有些插件可能既接收 `vapper.config.js` 中传递的参数，也接收 `pluginRuntimeOptions` 中的运行时参数。
:::

## Plugin API

### api.resolveCWD()

根据当前工作目录解析路径

```js
// pwd: /Users/work
api.resolveCWD('./foo.js')  // /Users/work/foo.js
```

### api.resolveOut()

根据 `webpack` 资源输出目录解析路径

```js
// Wbepack output.path: /Users/work/my-project/dist
api.resolveOut('./foo.js')  // /Users/work/my-project/dist/foo.js
```

### api.use()

注册 `Server` 中间件：

- 在“渲染中间件“之前注册中间件：

```js
api.use((req, res, next) => {})
```

- 在“渲染中间件“之后注册中间件：

```js
api.use('after:render', (req, res, next) => {})
```

### api.getRouteMeta()

获取当前请求对应的路由 `Meta`。常用于自定义 `Server` 的中间件中获取相关的元数据，例如：

```js {18}
// custom server: server.js
const express = require('express')
const app = express()
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

  app.use((req, res, next) => {
    const meta = vapper.getRouteMeta(req.url)
    // Do something
    next()
  })

  app.get('*', vapper.handler)

  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

### api.hookInto()

注册指定的钩子函数：

```js
api.hookInto('before:setup', () => {
  console.log('Before Setup')
})
```

可用的钩子有：

- `before:setup`
- `after:setup`
- `before:render`
- `after:render`

`after:render` 钩子函数会接收渲染完成的 `html` 字符串作为参数：

```js
api.hookInto('after:render', (htmlContent) => {
  console.log(htmlContent)
})
```

### api.addEnhanceFile()

用于注册运行时文件：

```js
api.addEnhanceFile({
  // 该文件的代码仅在客户端运行
  client: path.resolve(__dirname, './client.js'),
  // 该文件的代码仅在服务端运行
  server: path.resolve(__dirname, './server.js'),
  // clientModuleName 是必须得，提供一个模块名称
  clientModuleName: 'cookie'
})
```

可以查看 [运行时增强](/zh/write-plugin.html#运行时增强) 了解详细使用方法。

### api.isProd

一个 `boolean` 值，代表是否为生产环境。

### api.options

混合命令行参数和 `vapper.config.js` 中的配置数据所产生的最终选项。全部可用选项：[配置文件](/zh/config.html#配置文件)

### api.logger

日志打印工具：

```js
api.logger.log()
api.logger.error()
api.logger.warn()
api.logger.debug()
api.logger.tip()
api.logger.info()
```

通过配置文件可以控制日志打印行为：[Config - logLevel](/zh/config.html#loglevel)。