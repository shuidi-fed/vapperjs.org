# State Injection <Badge text="1.2.0+"/>

As introduced in the official document: [Final State Injection](https://ssr.vuejs.org/guide/data.html#final-state-injection), data is prefetched during server rendering, these data will be serialized and embedded in the `html` string and sent to the client together(ie: `window.__ INITIAL_STATE__`).

When using `vapper` to develop a project, all this is done automatically by `vapper`. However, sometimes you may need to serialize custom data and inject it into `window.__ INITIAL_STATE__`. `Vapper` provides such capabilities, as shown in the highlighted code below:

```js {9-11,20}
import Vue from 'vue'
import createRouter from './createRouter'
import App from './App.vue'

Vue.config.productionTip = false

// Export factory function
export default function createApp () {
  const initialState = {
    foo: 1
  }

  // 1. Create a router instance
  const router = createRouter()

  // 2. Create root component option
  const app = {
    router,
    head: {},
    initialState,
    render: h => h(App)
  }

  // 3. return
  return app
}
```

You can add the `initialState` property to the root component option. It must be an object. All fields under this object will be serialized and sent to the client. The above code will eventually get:

```js
window.__INITIAL_STATE__ = {
  foo: 1
  // other...
}
```

You can also set the `initialState` in the route guard:

```js {9,14-19,25}
import Vue from 'vue'
import createRouter from './createRouter'
import App from './App.vue'

Vue.config.productionTip = false

// Export factory function
export default function createApp () {
  const initialState = {}

  // 1. Create a router instance
  const router = createRouter()
  
  router.beforeEach((from, to, next) => {
    setTimeout(() => {
      initialState.foo = 1
      next()
    }, 1000)
  })

  // 2. Create root component option
  const app = {
    router,
    head: {},
    initialState,
    render: h => h(App)
  }

  // 3. return
  return app
}
```

This inspired us to send asynchronous requests in the routing guard and set the value of `initialState` after the data is returned.