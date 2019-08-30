# Error Handling

As described in [Introduction](/introduction.html), if an error occurs during server-side rendering, we have two coping strategies: one is to fall back to the `SPA` mode, and the other is to display a custom error page.

## Fall back to SPA mode

This is the default behavior of `Vapper`. When any error occurs during server rendering, `Vapper` will fall back to `SPA` mode, which will send the `SPA` page to the client. If the error is an error that only occurs on the server side, or if the error is a non-fatal error, that means the user can continue to use our `app`. This makes sense in some scenarios, such as ordering page, payment page, and other scenarios that emphasize conversion rates.

## Custom error page

Of course, if you want the error page to be displayed to the user when the error occurs, it is very simple.

### The `vm.error` property of the root component

`Vapper` injects the `error` attribute to the root component instance, which is an error object that holds the error message. So you can decide what to render by checking if `this.error` exists, as shown in the following code:

```js {11}
// Entry file: src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

Within the `render` function of the root component, if `this.error` exists, the custom content is presented to the user, otherwise the application is rendered normally. You can render anything you want, such as the `Error.vue` component:

```js
import Error from './Error.vue'

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h(Error, { props: { error: this.error } }) : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

### The Error Object

`this.error` exists only on the root component instance, it is an error object:

```js
{
  url: to.path, // The url where the error occurred
  code: 404,    // Error code
  message: 'Page Not Found' // Error message
}
```

What you need to know is that, in fact, you can assign arbitrary values to this.error at runtime, but the good practice is to give it the Error object with the same structure as the object shown in the code above.

### Capturing errors in routing guards

For complex applications, such as applications that require permission control, it is normal to write the appropriate authentication logic in the routing guard, for example:

```js
router.beforeEach(() => {
  // Some logic
})
```

What if the code in the routing guard throws an error? We can catch the error using the `onError` function natively provided by [vue-router](https://router.vuejs.org/):

```js {8-11,17}
// Entry file: src/main.js

export default function createApp () {
  // 1. Create a router instance
  const router = createRouter()

  // Use `router.onError` to catch routing errors
  router.onError((err) => {
    // Assign the err object to the vm.error property of the root component instance
    router.app.error = err
  })

  // 2. Create a app instance
  const app = new Vue({
    router,
    render (h) {
      return this.error ? h('h1', 'error') : h(App)
    }
  })

  // 3. return
  return { app, router }
}
```

:::warning
`router.onError` is temporarily unable to capture `Promises rejections`, please see: [https://github.com/vuejs/vue-router/issues/2833] (https://github.com/vuejs/vue-router/issues/2833).
:::

### Asynchronous error handling

