# Introduction

:::tip
This section will introduce the design principles of `Vapper`
:::

`Vapper` is a Vue-based server-side rendering(`SSR`) framework with core goals of **simplicity**, **flexibility**, and **powerful**.

- **simplicity**: Vapper does its utmost to make the development of the `SSR` application consistent with the development of the `SPA` application, reducing the cost of learning and the cost of switching between projects. The most typical example is the [data prefetch](/data-prefetching.html#data-prefetch) scheme provided by `Vapper`.

- **flexibility**: Flexibility is reflected in many aspects. For example, `Vapper` is only responsible for the necessary `webpack` configuration, which makes it work with great tools like [Vue CLI](https://cli.vuejs.org/) and [Poi](https://poi.js.org/). At the same time `Vapper` allows you to control whether to enable `SSR`, `SPA` or `pre-rendering` at the routing level, which means that different routes in the same project may be handled differently.

- **powerful**: The core of `Vapper` is very simple, but its [plugin](/using-plugin.html#intro) architecture allows you to have "progressive" enhancements. Extend `Vapper` with different plugins to do almost anything you expect. In fact, many of the core features of `Vapper` are also implemented as plugins.

## Necessary webpack configuration

In fact, the principle of `Vue` SSR is very simple, we need two `webpack` configurations: `server config` and `client config`, where `server config` is used to generate `server bundle`, `client config` for Generate the resources sent to the browser and generate `clientManifest`.

These `webpack` configurations are similar to the `webpack` configuration of the `SPA` application, and can be used for `SSR` with a little tweaking, So `Vapper` doesn't manage all the `webpack` configurations by itself, but only the necessary `webpack` configuration, so `Vapper` can be used with great tools like [Vue-CLI](https://cli.vuejs.org/) and [Poi](https://poi.js.org/). The benefit of doing this is that the capabilities of [Vue-CLI](https://cli.vuejs.org/) or [Poi](https://poi.js.org/) indirectly become the power of `Vapper`.

`Vapper` provides two packages for integration [Vue-CLI](https://cli.vuejs.org/) and [Poi](https://poi.js.org/):

- [@vapper/configer-vue-cli](/configer.html#vapper-configer-vue-cli)
- [@vapper/configer-poi](/configer.html#vapper-configer-poi)

As shown in the following diagram:

![builder](@imgs/builder.png)

In addition to using [Vue-CLI](https://cli.vuejs.org/) or [Poi](https://poi.js.org/) as the `webpack` management tool, you can also use your own `webpack` configuration. Vapper's `Builder` module only requires you to expose the `getServerConfig` and `getClientConfig` methods:

```js
class MyOwnConfiger {
  getServerConfig () {
    return {...}  // Return server configuration
  }

  getClientConfig () {
    return {...}  // Return client configuration
  }
}
```

For details, please see: [Write Configer](/configer.html#writing-configer)

## Route level control

Another design goal of `Vapper` is to be as flexible as possible, considering the following scenario:

![spa-ssr-prerender](@imgs/spa-ssr-prerender.png)

Our requirement is that when the user accesses `/home`, we want to perform server-side rendering (`SSR`); When the user accesses `/foo`, we want to send the `SPA` page to the user; When the user accesses `/bar`, we want to send the pre-rendered content to the user. You may have noticed that this requires us to have routing-level control, and `Vapper` has this capability, as shown in the following routing rules:

```js {10,16}
// Factory function for creating routes
export default () => {
  return new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/home',
        component: () => import('./components/Home.vue'),
        // Enable ssr
        meta: { ssr: true }
      },
      {
        path: '/foo',
        component: () => import('./components/Foo.vue'),
        // Disable ssr and send the SPA page to the user
        meta: { ssr: false }
      }
    ]
  })
}
```

We can use the `@vapper/plugin-prerender` plugin to support pre-rendering and specify routes that need to be pre-rendered, then `Vapper` will render these routes into `html` files at build time. When a user request comes, `Vapper` will send this `html` as a static resource to the user.

## Error handling

When an error occurs, we have two choices:

![error-handling](@imgs/error-handling.png)

- 1. Show error page to user
- 2. Instead of displaying the error page, fall back to `SPA` mode

`Vapper` allows you flexible control over how errors are handled. When an error occurs, you can display the error page to the user. You can also fall back to the `SPA` mode so that when a non-fatal error occurs, the user can still Use our app.

One thing you need to know is: **When there is no route in the `Vapper` project to enable `SSR`, then it is a `SPA` application**.

Read [Custom Error Page](/error-handling.html#custom-error-page) and [Fallback SPA](/error-handling.html#fall-back-to-spa-mode) for details.

## Data prefetch

`Vapper` provides a more intuitive and powerful data prefetch method:

|            | Can access `this` | used for any component  | Used for both server and client     | Prefetch component level data    |
| ---------- | :-----------:  | :-----------: | :-----------: | :-----------: |
| `nuxt/ream`'s `asyncData`   | ❌           | ❌     | ✅       | ✅     |
| `ServerPrefetch` provided by `Vue` | ✅           | ✅     | ❌       | ❌     |
| `vapper`         | ✅           | ✅     | ✅       | ✅     |

For details, please read: [Data prefetch](/data-prefetching.html#the-createfetcher-function)

## Plugin architecture

The plugin architecture of `Vapper` is very flexible. It borrows the plugin architecture of [Vue-CLI](https://cli.vuejs.org/). You can extend the `CLI` command, add server middleware, and use the hook function to participate in the entire life cycle of `Vapper`.

In fact, many of the core features of `Vapper` are written using their own plug-in mechanisms, such as `Fallback SPA`, `micro-caching`, etc. In addition, `Vapper` can progressively support your desired functions through plugins, the official plugin is as follows:

- `@vapper/plugin-fs-routes`
- [@vapper/plugin-cookie](/using-plugin.html#vapper-plugin-cookie)

You can check out [plugin development](/write-plugin.html#basic) to learn how to write a plugin.
