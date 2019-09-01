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

## Redirect - $$redirect

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

## `vm.error`

Only the root component instance has the `vm.error` property, which is the error object used to implement the custom error page. For details, please see: [Error Handling - Custom Error Page](/error-handling.html#custom-error-page)