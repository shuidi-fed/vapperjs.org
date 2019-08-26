# 路由 Meta

路由 `Meta` 指的是 [vue-router](https://router.vuejs.org/) 中每一个路由规则的 `meta` 字段，例如：

```js {11}
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { ssr: true }
        }
      ]
    }
  ]
})
```

通过路由 `Meta` 控制应用程序是 `Vapper` 的特点之一，正因如此，`Vapper` 才得以实现不同的路由拥有不同的行为，我们称之为“路由级别的控制能力”：

![spa-ssr-prerender](@imgs/spa-ssr-prerender.png)

## 可选的 SSR

默认情况下所有的路由规则(或页面)都会应用 `SSR`，然而有时候，我们希望某个或某几个路由(页面)采用 `SPA` 模式，根据路由选择性的开启或关闭 `SSR` 可以有效的减少服务器的负载，我们可以通过设置该路由规则的 `meta.ssr` 字段为 `false` 来达到目的：

```js {7}
const router = new VueRouter({
  routes: [
    {
      path: '/bar',
      component: Bar,
      // a meta field
      meta: { ssr: false }
    }
  ]
})
```

这样当我们访问 `/bar` 时，`Vapper` 并不会进行服务端渲染，而是把 `SPA` 页面发送给客户端。

## ssr 配置选项

如上所述，`Vapper` 默认会在服务端渲染所有路由规则，如果你想修改此行为，可以修改 `vapper.config.js` 文件中的 `ssr` 配置选项：

```js
// vapper.config.js
module.exports = {
  ssr: false
}
```

这样 `Vapper` 在默认情况下，所有的路由规则都不会进行服务端渲染。你可以通过路由 `meta` 指定需要开启 `ssr` 的路由规则：

```js {7}
const router = new VueRouter({
  routes: [
    {
      path: '/bar',
      component: Bar,
      // a meta field
      meta: { ssr: true }
    }
  ]
})
```

## 在自定义 Server 中使用路由 Meta

`Vapper` 允许你自定义 `Server`，请查看：[自定义 Server](/zh/custom-server.html#自定义-server)。如下代码是典型的使用 `Express` 配合 `Vapper` 实现自定义 `Server` 的代码：

```js
// server.js
const express = require('express')
const app = express()
const Vapper = require('@vapper/core')

async function starter () {
  // 1、创建 Vapper 实例，Vapper 会自动加载配置文件
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2、使用默认的 port 和 host，或者来自于配置文件中的 port 和 host
  //    你也可以手动指定 port 和 host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3、等待 Vapper 设置完成
  await vapper.setup()

  // 4、使用 vapper.handler 处理请求
  app.get('*', vapper.handler)

  // 5、创建 Server 并侦听请求
  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

通常你会编写一些自己的中间件，在中间件内部，可以通过 [api.getRouteMeta()](/zh/write-plugin.html#api-getroutemeta) 函数获取当前请求所对应路由的 `Meta` 数据，如下高亮代码所示：

```js {19-21}
// server.js
// 省略...
async function starter () {
  // 1、创建 Vapper 实例，Vapper 会自动加载配置文件
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2、使用默认的 port 和 host，或者来自于配置文件中的 port 和 host
  //    你也可以手动指定 port 和 host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3、等待 Vapper 设置完成
  await vapper.setup()

  app.use((req, res, next) => {
    const meta = vapper.getRouteMeta(req.url)
  })

  // 4、使用 vapper.handler 处理请求
  app.get('*', vapper.handler)

  // 5、创建 Server 并侦听请求
  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

这意味着，你所编写的中间件也将拥有路由级别的控制能力。