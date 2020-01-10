# Migrating from v0.x

[[toc]]

## Return value of the `createApp` function in the entry file

- In `v0.x`:

The return value of the `createApp` function is an object that contains an app instance (`new Vue ()`), a router instance, and so on:

```js
export default function createApp() {
  const router = new VueRouter({/* ... */})
  const app = new Vue({/* ... */})

  return { app, router }
}
```

- In `v1.0`:

The `createApp` function is required to return root component options(`rootOptions`):

```js
export default function createApp() {
  const router = new VueRouter({/* ... */})

  // rootOptions
  const app = {
    router,
    render: h => h('div')
    // ...
  }

  return app
}
```

## Remove `ctx.replaceState()`

- In `v0.x`:

After creating a `store` instance, you need to call `ctx.replaceState()` immediately:

```js
// The Entry file

export default function createApp () {
  // ...

  // Create store instance
  const store = createStore()
  ctx.replaceState(store) // This is necessary, vapper will use it to mix data(from server to client).

  // ...

  // return
  return { app, router, store }
}
```

- In `v1.0`:

It is no longer necessary to call `ctx.replaceState()`:

```js
// The Entry file

export default function createApp () {
  // ...

  // Create store instance
  const store = createStore()

  const app = {
    // ...
    store
  }

  // return
  return app
}
```

## `@vapper/plugin-cookie`

- In `v0.x`:

In order to access `$cookie` inside the component, we need to manually write a `mixin`:

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

- In `v1.0`:

It is no longer necessary to write a mixin manually to use it directly in the component.

## change of the context object

### context object on the client

- In `v0.x`:

The client's `context` object is as follows:

```js
context = {
  Vue,  // the Vue constructor
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

- In `v1.0`:

Removed the `Vue` constructor:

```js
context = {
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions  // createApp.pluginRuntimeOptions
}
```

### context object on the server

- In `v0.x`:

The server's `context` object is as follows:

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

- In `v1.0`:

Removed the `Vue` constructor and added `context.url`:

```js
context = {
  type: TYPE, // type is 'server' or 'client'
  pluginRuntimeOptions: createApp.pluginRuntimeOptions,  // createApp.pluginRuntimeOptions
  req: context.req, // http.ClientRequest instance
  res: context.res, // http.ServerResponse instance
  isFake,  // A boolean value that indicates whether a real rendering is done
  url: req.url  // the request url
}
```

## Error Handling - Custom Error Page

When an error occurs:

- If `enableCustomErrorPage: false`, then fall back to `SPA`.
- If `enableCustomErrorPage: true`, but no `ErrorComponent` component is provided, then fallback to `SPA`.
- If `enableCustomErrorPage: true` and an` ErrorComponent` component is provided, but an error occurs within the `ErrorComponent` component, then fallback to` SPA`.

**In other words, you can optionally throw errors in the `ErrorComponent` component to achieve free switching between the custom error page and fallback to the SPA mode.**

For details, please read: [Error Handling - Custom Error Page](/error-handling.html#error-handling).