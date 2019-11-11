# Entry file

## Avoid Stateful Singleton

In order to avoid state pollution caused by cross requests, we need to export a factory function in the entry file. Inside the factory function, we create new application instances, routing instances, and so on for each request. You can read the official documentation to learn more about [Avoiding Statuful Singletons](https://ssr.vuejs.org/guide/structure.html#avoid-stateful-singletons).

The simplest entry file should contain the following:

- 1. The `Vapper` application requires you to use [vue-router](https://router.vuejs.org/).
- 2. Use the `export default` statement to export a factory function that return value is an object, and this object should contain at least the application instance (`app`) and the route instance (`router`).

For example:

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

The default entry for the `Vapper` application is `src/main.(j|t)s` , which you can modify via `vapper.config.js`, you can check out [config](/config.html) for details.

## Context

The factory function accepts the `Context` object as a parameter:

```js
// src/main.js
export default function createApp (context) {/* ... */}
```

You can use `context.type` to distinguish between client-side rendering or server-side rendering:

```js
export default function createApp ({ type }) {
  console.log(type) // 'client' or 'server'
}
```

The complete `Context` object is as follows:

- On the client side:

```js
context = {
  Vue,  // the Vue constructor
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

- On the server side:

```js
context = {
  Vue,  // the Vue constructor
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions,  // createApp.pluginRuntimeOptions
  req: context.req, // http.ClientRequest instance
  res: context.res, // http.ServerResponse instance
  isFake  // A boolean value that indicates whether a real rendering is done
}
```

## Independent environment entry file

You might come across a scenario where you have a piece of code and just want it to run on the client, or just want it to run on the server. As a common example, we usually need to get cookies. In the client, we can use `document.cookie` to get the cookie, but this code can't run on the server. Instead, we need to get the cookie from the request object, so we can write the following code in the entry file:

```js
export default function createApp ({ type, req }) {
  let cookie = type === 'server' ? req.getHeader('Cookie') : document.cookie
}
```

There is no problem with this, but once the code that needs to distinguish the environment becomes more and more, the entry file will become more and more bloated. At this time, we can create the `client.js` and `server.js` files in the `src/` folder respectively. As the name implies, the `client.js` file will only run on the client, while the `server.js` file will only run on the server.

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

In fact, `@vapper/plugin-cookie` is implemented in this way, and can be understood through source code:[vapper-plugin-cookie/lib/cookie.js](https://github.com/shuidi-fed/vapper/blob/master/packages/vapper-plugin-cookie/lib/cookie.js)

`src/client.js` and `src/server.js` are files recognized by vapper by default, of course, if your project uses `TypeScript`, then the `src/client.ts` and `src/server.ts` files will be recognized and they can be modified via the configuration file(`vapper.config.js`):

```js
// vapper.config.js
module.exports = {
  clientEntry: './my-client-entry.js',
  serverEntry: './my-server-entry.js'
}
```

## Plugin runtime options

`Vapper`'s plugin has the ability to enhance the runtime capabilities of our applications，some plugins will receive runtime parameters, allowing the user to configure the functionality of the plugin. We can add the `pluginRuntimeOptions` property to the factory function exported by the entry file, these plugin will reads the property and extracts the information it wants, for example:

```js {8-12}
// entry file

// Export factory function
export default function createApp () {
  // Omitted...
}

// Add the plugin's runtime options to the pluginRuntimeOptions object
createApp.pluginRuntimeOptions = {
  // For @vapper/plugin-cookie
  cookie: { fromRes: true }
}
```

The above code shows how to provide runtime options for the `@vapper/plugin-cookie` plugin(The `@vapper/plugin-cookie` plugin reads the `pluginRuntimeOptions.cookie` property as its option).

Read [Using Plugins](/using-plugin.html#intro) and [Plugin Development](/write-plugin.html) for more details about plugins.

