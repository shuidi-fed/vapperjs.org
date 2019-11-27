# Using Plugin

:::tip
The plugin mechanism of `Vapper` is its own backbone. In fact, the many capabilities of `Vapper` itself are also implemented based on the plugin mechanism.
:::

## Intro

Plugins can extend the runtime capabilities of the `Vapper` application, such as the [@vapper/plugin-cookie](/using-plugin.html#vapper-plugin-cookie) plugin that injects a `ctx.$cookie` property into [context](/entry.html#context) object for handling `cookie`. Plugins can also extend the capabilities of the `Vapper` framework itself, such as the [@vapper/plugin-prerender](/using-plugin.html#vapper-plugin-prerender) plugin, which adds a new `CLI` command to the framework to perform prerendering. Plugins can also do a lot of things, such as adding `server` middleware, hooking into the various sections of `Vapper` startup, and so on.

## Basic usage

Specify the plugin you want to use via the `plugins` option in `vapper.config.js`:

```js
// vapper.config.js
module.exports = {
  plugins: ['vapper-plugin-do-something']
}
```

The `plugins` option is an array, `'vapper-plugin-do-something'` is the name of the plugin, and `Vapper` will load the plugin based on that name, so you will need to install it manually.

A plugin can also be a function:

```js
// vapper.config.js
const myPlugin = require('./myPlugin.js')

module.exports = {
  plugins: [myPlugin]
}
```

If you want to pass parameters to the plugin, you need to use a nested array:

```js {4}
// vapper.config.js
module.exports = {
  plugins: [
    ['vapper-plugin-do-something', { /* options */ }]
  ]
}
```

If a plugin extends the runtime capabilities of the `Vapper` application, then it may need to get configuration options at runtime. At this point we need to use the `pluginRuntimeOptions` object as described in [Runtime Options for Plugins](/entry.html#plugin-runtime-options). If a plugin extends `Vapper` at the framework level, such as registering a new command, then do the same as the code above, but these options are not available at runtime.

:::tip
A plugin requires a clear documentation describing how it accepts configuration options.
:::

## Official plugin

### @vapper/plugin-prerender

The plugin provides prerendering capabilities, you can specify the route that needs to be prerendered, and the plugin will render the matching route to the corresponding `html` file. When the request comes in, if the specified route is matched, the pre-rendered `html` file will be sent to the client as a static resource.

Pre-rendering has many advantages over rendering on-the-fly, which can send content to the client faster, while also reducing the load on the server. But not all pages are suitable for pre-rendering.

#### Installation

```sh
yarn add @vapper/plugin-prerender
```

#### Usage

```js
// vapper.config.js
module.exports = {
  plugins: [
    [
      '@vapper/plugin-prerender',
      {
        routes: ['/foo']
      }
    ]
  ]
}
```

Add the `npm` script:

```json
{
  "scripts": {
    "generate": "vapper generate"
  }
}
```

This plugin registers the `vapper generate` command, which is equivalent to "build + generate".

### @vapper/plugin-cookie

:::tip
`@vapper/plugin-cookie` is internally dependent on [jshttp/cookie](https://github.com/jshttp/cookie).
:::

The plugin extends the runtime of the `Vapper` application and adds the `$cookie` property to the [context](/entry.html#context) object for isomorphic manipulation of `cookies`, which can be used both on the server and on the client.

#### Installation

```sh
yarn add @vapper/plugin-cookie
```

#### Usage

```js
// vapper.config.js
module.exports = {
  plugins: [
    ['@vapper/plugin-cookie']
  ]
}
```

The `@vapper/plugin-cookie` plugin accepts runtime options. To pass options for it, you need to add the `pluginRuntimeOptions` property to the factory function exported by the entry file:

```js {3-4}
// Entry file
export default function createApp (ctx) {
  ctx.$cookie.get('foo') // Read cookie named `foo`
  ctx.$cookie.set('foo', 1) // Set cookie named `foo`
}

createApp.pluginRuntimeOptions = {
  cookie: { /* options */ }
}
```

The `@vapper/plugin-cookie` plugin reads the `pluginRuntimeOptions.cookie` object as a configuration option.

We can add a small amount of code to the entry file to enable us to access cookies on any component instance object:

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

:::tip
The following docs assume that `$cookie` is accessible through the component instance(`this`).
:::

##### Read cookie

Use the `$cookie.get` function to read `cookie`.

- Arguments:
  - `{string}` key

- Return: `{string | object}`

- Usage:

```js
export default {
  created () {
    const token = this.$cookie.get('token')
  }
}
```

When abandoning the argument for the `$cookie.get` function, it returns an object containing all the `cookies`:

```js
export default {
  created () {
    const cookies = this.$cookie.get()
    // cookies = { token: 'xxx', uid: 'xxx', .... }
  }
}
```

##### Set cookie

Use the `$cookie.set` function to set one or a set of `cookies`.

- Arguments:
  - `{string | array}` key
  - `{string}` value
  - `{object}` options

- Usage:

Set a single `cookie`:

```js
export default {
  created () {
    this.$cookie.set('token', 'token value', { path: '/' })
  }
}
```

Set multiple `cookies`:

```js
export default {
  created () {
    this.$cookie.set([
      {
        name: 'token',
        value: 'token value'
      },
      {
        name: 'foo',
        value: 1,
        options: { path: '/foo' }
      }
    ])
  }
}
```

All available `options` can be viewed at: [jshttp/cookie#options](https://github.com/jshttp/cookie#options)

##### Delete cookie

Use the `$coookie.delete` function to remove single or all `cookies`.

- Arguments:
  - `{string}` key
  - `{object}` options

- Usage:

Delete a single `cookie`：

```js
export default {
  created () {
    this.$cookie.delete('token')
  }
}
```

When abandoning the argument for the `$cookie.delete` function, it will delete all `cookies`.

```js
export default {
  created () {
    this.$cookie.delete()
  }
}
```

Where `options` is: [jshttp/cookie#options](https://github.com/jshttp/cookie#options)

#### Plugin options:

##### propertyName

- Type: `string`
- Default: `'$cookie'`

Specifies the name of the property injected into the component instance. The default is `$cookie`, so you can access it via the component instance: `ctx.$cookie`.

##### fromRes

- Type: `boolean`
- Default: `false`

This option is only valid on the server side and is used to indicate whether the `cookie` in the response object(`res`) is read when the `cookie.get` function is used to read `cookie`.

## Community plugin