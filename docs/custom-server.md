# Custom Server

:::tip
Custom `Server` is actually using `Vapper` in the way of the Nodejs API.
:::

## Connect

`Vapper` uses [Connect](https://www.npmjs.com/package/connect) internally. Starting the built-in server is very simple:

```js
const Vapper = require('@vapper/core')

async function starter () {
  // 1. Create a Vapper instance and Vapper will automatically load the configuration file
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2. using the default or from the port and host in the configuration file,
  //    you can also manually specify the port and host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3. Waiting for Vapper setup is complete
  await vapper.setup()

  // 4. Listening
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

The above code is actually the code executed by the `vapper dev` command.

## Express

You can also use the popular Nodejs framework: [Express](https://expressjs.com/), as shown in the following code:

```js
const express = require('express')
const app = express()
const Vapper = require('@vapper/core')

async function starter () {
  // 1. Create a Vapper instance and Vapper will automatically load the configuration file
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2. using the default or from the port and host in the configuration file,
  //    you can also manually specify the port and host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3. Waiting for Vapper setup is complete
  await vapper.setup()

  // 4. Use the vapper.handler function to handle the request
  app.get('*', vapper.handler)

  // 5. Listening
  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

The only difference from using the built-in [Connect](https://www.npmjs.com/package/connect) is that we need to handle the request with `vapper.handler`.

## Koa

The custom [Koa](https://koajs.com/) server is slightly different from the custom `Express` server, as shown in the following code:

```js {22-26}
const Koa = require('koa')
const app = new Koa()
const Vapper = require('@vapper/core')

async function starter () {
  // 1. Create a Vapper instance and Vapper will automatically load the configuration file
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2. using the default or from the port and host in the configuration file,
  //    you can also manually specify the port and host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3. Waiting for Vapper setup is complete
  await vapper.setup()

  // 4. Use the vapper.handler function to handle the request
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false
    vapper.handler(ctx.req, ctx.res)
  })

  // 5. Listening
  app.listen(port, host, () => vapper.logger.info(`Server running at: http://${host}:${port}`))
}

starter()
```

To be more generic, `Vapper` handles the `Nodejs` native request(`req`) object and the response(`res`) object. So you need to set `ctx.respond = false`, then pass `ctx.req` and `ctx.res` as arguments to the `vapper.handler` function.
