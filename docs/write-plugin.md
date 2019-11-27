# Writing a plugin

## Basic

A plugin is a function:

```js
// myVapperPlugin.js
module.exports = (api) => {
  // ...
}
```

This function takes a `PluginApi` instance as a parameter, which provides a number of methods that let you intervene in the core of `Vapper` and also provides a number of utility functions.

## Debugging a plugin

In the [Using Plugins](/using-plugin.html#using-plugin) section we learned that a plugin can be a function:

```js
// vapper.config.js
const myVapperPlugin = require('./myVapperPlugin.js')

module.exports = {
  plugins: [myVapperPlugin]
}
```

So you can simply import the local plugin and debug it.

## Register server middlewares

Use the `api.use()` function to register a server middleware:

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

Middleware is written in accordance with the conventions of [connect](https://github.com/senchalabs/connect).

The server-side rendering of `Vapper` is essentially a server middleware, we temporarily call it "rendering middleware", therefore, when using the A function to register the middleware, you can either register the middleware that was executed before the "rendering middleware" or register the middleware that is executed after the "rendering middleware":

```js
// myVapperPlugin.js
module.exports = (api) => {
  // Before rendering middleware
  api.use('before:render', (req, res, next) => {})
  // After rendering middleware
  api.use('after:render', (err, req, res, next) => {})
}
```

In fact, when registering middleware that is executed before "rendering middleware", you can omit `'before:render'`:

```js
// myVapperPlugin.js
module.exports = (api) => {
  // Before rendering middleware
  api.use((req, res, next) => {})
  // After rendering middleware
  api.use('after:render', (err, req, res, next) => {})
}
```

In most cases, you may need to customize the server. For custom server you can read: [Custom Server](/custom-server.html#connect). When customizing the server, you don't need to register the middleware as a plugin, because you can use the middleware directly in your custom `Server`.

## Register command

A new `CLI` command can be registered via the plugin, and the `module.exports.CLI` function needs to be exported in the plugin module:

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

The `module.exports.CLI` function accepts the `Vapper` class as a parameter, `Vapper.cli` is a command-line program instance, and `Vapper` uses [CAC](https://github.com/cacjs/cac) as a command-line parsing tool, so the way to register a new command can be viewed [CAC](https://github.com/cacjs/cac) documentation.

After registering a new command, we can run the command via `vapper [command]`. In addition, we can add a function to `api`, such as `api.$someFn` in the above code, which can be called in the `action` of the command line via the `Vapper` instance.

You can check the [@vapper/plugin-prerender](https://github.com/vapperjs/vapper/blob/master/packages/vapper-plugin-prerender/lib/index.js) code as a reference case.

## Enhance runtime capabilities

In the previous introduction, the plugin's capabilities were limited to non-runtime levels and could not extend the application's runtime capabilities, but in fact it was important to extend the application's runtime capabilities. For example, the [@vapper/plugin-cookie](/zh/using-plugin.html#vapper-plugin-cookie) plugin extends the runtime capabilities of the `Vapper` application, allowing us to manipulate `cookie` isomorphicly.

riting a runtime plugin is basically the same as writing a normal plugin, and also exporting a function:

```js
// myVapperPlugin.js
module.exports = (api) => {}
```

But we need to dynamically add runtime code using the `api.addEnhanceFile` function:

```js
// myVapperPlugin.js
module.exports = (api) => {
  api.addEnhanceFile({
    // The code for this file is only run on the client
    client: path.resolve(__dirname, './client.js'),
    // The code for this file is only run on the server
    server: path.resolve(__dirname, './server.js'),
    // clientModuleName is required, providing a module name
    clientModuleName: 'cookie'
  })
}
```

Then we can write the `client.js` and `server.js` files separately:

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

Both `server.js` and `client.js` need to have a default exported function, and the function accepts [ctx](/entry.html#context) as a parameter, as shown below for the contents of [ctx](/entry.html#context):

```js
ctx = {
  Vue,  // The Vue constructor
  pluginRuntimeOptions, // It is the variable exported by the entry file: createApp.pluginRuntimeOptions = {}
  type, // Its value is 'server' in the `server.js` file, and its value is 'client' in `client.js`
  req,  // Request object, available only in `server.js`
  res,  // Response object, available only in `server.js`
  isFake  // A Boolean value that indicates whether the rendering is actually performed. It will be explained in detail later and is only available in `server.js`.
}
```

With these capabilities in place, we can try to write plugins to enhance the runtime. Next, let's write a plugin that injects `$logger` function for [context](/entry.html#context) as an example of how to write plugins to enhance the runtime.

The main purpose of the runtime plugin is: enhance the [context](/entry.html#context) object, as shown in the following code, we add the `$logger` attribute on the [context](/entry.html#context) object:

```js
// client.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

The same code can be used in `server.js`:

```js
// server.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

You have noticed that the same code we wrote twice in `client.js` and `server.js`, in fact, `client.js` and `server.js` can be the same file:

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

As shown in the code above, we point `client` and `server` to the same `logger.js` file, so we only need to write the code once:

```js
// logger.js
export default function (ctx) {
  ctx.$logger = console.log
}
```

But some code can only be run on the server or client. At this time we need to use `type` to distinguish the current running environment:

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

Since one file can satisfy the requirements, why design two files `client.js` and `server.js`? In fact, using only one file can indeed meet the requirements, but this will cause the client to include the server's code. Similarly, the client's code will also exist in the server. Although this does not affect the normal execution of the code, it increases the size of the bundle, so if the code between the client and the server is quite different, it is recommended to write two files separately.

The runtime plugin enhances the [context](/entry.html#context) object by adding new attributes to [context](/entry.html#context), so we can use it in the entry file:

```js {4}
// Entry file

export default function createApp (ctx) {
  ctx.$logger // Access `$logger` via `ctx`.
  
  // Omit ...

  return { app, router }
}
```

## Pass options for the plugin

As mentioned above, plugins can enhance runtime capabilities, as well as register new `CLI` commands and server middleware. Different types of plugins receive option parameters differently. For plugins that enhance runtime capabilities, we need to use the `createApp.pluginRuntimeOptions` object exported by the entry file, for example:

```js
// Entry file
export default function createApp () {}

createApp.pluginRuntimeOptions = {
  logger: {/* ... */}
}
```

So in the plugin's runtime file, we can get the options like this:

```js
// server.js 或 client.js
export default function ({ Vue, pluginRuntimeOptions }) {
  console.log(pluginRuntimeOptions.logger)
}
```

For plugins that don't enhance runtime capabilities, we only need to pass options for the plugin in `vapper.config.js`:

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
Some plugins may receive both the options passed in `vapper.config.js` and the runtime options in `pluginRuntimeOptions`.
:::

## Plugin API

### api.resolveCWD()

Resolve the path based on the current working directory.

```js
// pwd: /Users/work
api.resolveCWD('./foo.js')  // /Users/work/foo.js
```

### api.resolveOut()

Resolve the path based on the `output.path` of webpack

```js
// Wbepack output.path: /Users/work/my-project/dist
api.resolveOut('./foo.js')  // /Users/work/my-project/dist/foo.js
```

### api.use()

Register a `Server` middleware:

- Register the middleware that was executed before "Rendering Middleware":

```js
api.use((req, res, next) => {})
```

- Register the middleware that was executed after "Rendering Middleware":

```js
api.use('after:render', (req, res, next) => {})
```

### api.getRouteMeta()

Get the route metadata corresponding to the current request. Usually used in the middleware of a custom server to read route metadata, for example:

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

Register the hook function:

```js
api.hookInto('before:setup', () => {
  console.log('Before Setup')
})
```

The available hooks are:

- `before:setup`
- `after:setup`
- `before:render`
- `after:render`

The `after:render` hook function will receive the rendered `html` string as a parameter:

```js
api.hookInto('after:render', (htmlContent) => {
  console.log(htmlContent)
})
```

### api.addEnhanceFile()

Used to register runtime files:

```js
module.exports = (api) => {
  api.addEnhanceFile({
    // The code for this file is only run on the client
    client: path.resolve(__dirname, './client.js'),
    // The code for this file is only run on the server
    server: path.resolve(__dirname, './server.js'),
    // clientModuleName is required, providing a module name
    clientModuleName: 'cookie'
  })
}
```

You can check [Enhance runtime capabilities](/write-plugin.html#enhance-runtime-capabilities) for detailed usage.

### api.isProd

A `boolean` value that represents whether the environment is a production environment.

### api.options

Mix the command line arguments with the configuration data in `vapper.config.js` to produce the final options. All available options: [Configuration](config.html)

### api.logger

Log tool:

```js
api.logger.log()
api.logger.error()
api.logger.warn()
api.logger.debug()
api.logger.tip()
api.logger.info()
```

The log print behavior can be controlled through the configuration file: [Config - logLevel](/config.html#loglevel).