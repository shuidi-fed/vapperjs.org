# 自定义 Server

:::tip
自定义 `Server` 实际上就是在以 `Nodejs API` 的方式使用 `Vapper`。
:::

## Connect

`Vapper` 内部使用 [Connect](https://www.npmjs.com/package/connect)，启动内置的服务器非常简单：

```js
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

  // 4、创建 Server 并侦听请求
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

如上代码实际上就是 `vapper dev` 命令所执行的代码。

## Express

你也可以使用流行的 Nodejs 框架：[Express](https://expressjs.com/)，如下代码所示：

```js
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

与使用内置的 [Connect](https://www.npmjs.com/package/connect) 唯一不同的是，我们需要使用 `vapper.handler` 处理请求。

## Koa

自定义 [Koa](https://koajs.com/) 服务器与自定义 `Express` 服务器略微不同，如下代码所示：

```js {22-26}
const Koa = require('koa')
const app = new Koa()
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
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false
    vapper.handler(ctx.req, ctx.res)
  })

  // 5、创建 Server 并侦听请求
  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

为了更加通用，`Vapper` 处理 `Nodejs` 原生的请求(`req`)对象和响应(`res`)对象，因此需要设置 `Koa` 的 `ctx.respond = false`，之后分别将 `ctx.req` 和 `ctx.res` 作为参数传递给 `vapper.handler` 函数。
