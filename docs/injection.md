# Vapper injection

## The `<ClientOnly>` Component

Some components are ssr-unfriendly components. When you use a third-party component that is not friendly to the ssr, you can wrap that component with the `<ClientOnly>` component injected by `Vapper`. Components wrapped by the `<ClientOnly>` component will only be rendered on the client side.

```html
<template>
  <div>
    <ClientOnly>
      <ConnotSSRComponent/>
    </ClientOnly>
  </div>
</template>
```

## Redirect - vm.$$redirect

`Vapper` injects the `$$redirect` function on the component instance and the route instance for redirection, which is isomorphic.

- Arguments:
  - `{string}` url

- Usage:

Redirect in the routing guard:

```js {3}
router.beforeEach((to, from, next) => {
  if (to.path === '/foo') {
    router.$$redirect('/bar')
    return
  }
  next()
})
```

Redirect in the component's lifecycle hook:

```js {7}
export default {
  name: 'Foo',
  created () {
    const auth = this.$createFetcher(doAuth)
    const authRes = await auth()
    if (authRes) {
      this.$$redirect('/foo')
    }
  }
}
```

## router.$$redirect

Same as [vm.$$redirect](/injection.html#redirect-vm-redirect).

## vm.$$type

The `vm.$$type` property of the component instance is a string value that identifies whether the current execution environment is on the server or on the client.

```js {4}
export default {
  name: 'Foo',
  created () {
    console.log(this.$$type)  // 'server' | 'client'
  }
}
```

## router.$$type

Same as [vm.$$type](/injection.html#vm-type).

## `vm.error`

Only the root component instance has the `vm.error` property, which is the error object used to implement the custom error page. For details, please see: [Error Handling - Custom Error Page](/error-handling.html#custom-error-page)

## Environment Variables

### process.env.VAPPER_TARGET

`SSR` will build the `client` resource and the `server` resource respectively. When building the `client` resource, the value of `process.env.VAPPER_TARGET` is the string `'client'`, when building the `server` resource, the value of `process.env.VAPPER_TARGET` is the string `'server'`, which can be used to control the plugin usage of `webpack`:

```js
// vue.config.js
const ClientOnlyPlugin = require('client-onlu-webpack-plugin')

module.exports = {
  chainWebpack(config) {
    // Apply this plugin only when building client resources
    if (process.env.VAPPER_TARGET === 'client') {
      config.plugin('client-only-plugin').use(ClientOnlyPlugin, [{/* ... */}])
    }
  }
}
```

### process.server

A Boolean value, equivalent to `process.env.VAPPER_TARGET === 'server'`.

### process.client

A Boolean value, equivalent to `process.env.VAPPER_TARGET === 'client'`.

### process.browser

Alias of `process.client`, a Boolean value, equivalent to `process.env.VAPPER_TARGET === 'client'`.

### process.env.VAPPER_ENV

The value of `process.env.VAPPER_ENV` is equal to the value of the `mode` configuration option: `'development'` or `'production'`.