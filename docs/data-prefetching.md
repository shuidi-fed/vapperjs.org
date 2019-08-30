# Data prefetch

`Vapper` provides more intuitive and powerful data prefetching capabilities, allowing you to perform data prefetching just like the `SPA` application.

## The $createFetcher function

When developing `SPA` applications, we usually fetch data in the component's `created` or `mounted` hooks, for example:

```js
// Created hook
async created () {
  // Suppose the return value of the `fetchApi` function is a `Promise` instance.
  this.res = await fetchApi('/list')
}
```

But this code can't run properly in the `SSR` application, because during the server rendering process, the application can't know when the request ends, and it can't know which data needs to be serialized and sent to the client. So in order for the above code to run in the `SSR` application, you can pass the `fetchApi` function as a parameter to the `$createFetcher` function, which is injected into the component instance by `Vapper`:

```js
// Created hook
async created () {
  // Call the this.$createFetcher function whose argument is a function that returns a Promise instance
  const fetchList = this.$createFetcher(fetchApi)
  // Fetch data
  this.res = await fetchList('/list')
}
```

The above code is all the code for prefetching data in the `Vapper` application. Is it very simple?

:::tip
Please note: Since the component's `mounted` hook function will not be executed during server-side rendering, you can only perform data prefetching in the `created` hook.
:::

## Avoid duplicate data prefetching

Reading the code above, you may have questions: "Is the code inside the `created` hook function not executed on the server and client respectively? Does this lead to duplicate data prefetching?", in fact, no, `Vapper` automatically helps you avoid duplicate data prefetching, so you don't have to do anything. 

## Store(Vuex)

### Return a Store instance in the entry file

`Vapper` allows you to optionally use `Vuex`, which is the same as creating an application instance, we also need to create a new `Stroe` instance for each request. Usually we will wrap the `createStore` factory function:

```js
// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'
import fetch from './fetch'

Vue.use(Vuex)

export default function createStore () {
  // Return the Store instance
  return new Vuex.Store({
    state: { /* ... */ },
    mutations: { /* ... */ },
    actions: { /* ... */ }
  })
}
```

Then create and return a `store` instance in the entry file:

```js {7,12}
// src/main.js

export default function createApp () {
  // ...

  // Create store instance
  const store = createStore()

  // ...

  // return
  return { app, router, store }
}
```

### Action returns a Promise instance

We know that the argument passed to the `this.$createFetcher` function is a function that returns a `Promise` instance. Therefore, if the return value of a `action` is a `Promise` instance, we can perform data prefetching like this:

```js {4}
// created hook
async created () {
  // Create a fetcher
  const fetchList = this.$createFetcher(() => this.$store.dispatch('fetchData'))
  // Call the fetchList function to fetch data
  this.res = await fetchList('/list')
}
```

If we use `async/await`, the code for `action` looks like this:

```js
new Vuex.Store({
  actions: {
    async fetchData({ commit }) {
      // Send an asynchronous request
      const res = await fetch()
      commit('setData', res.data)
    }
  }
})
```

### mapActions function

If you use the `mapActions` function to map `actions` to the component's `methods`, the code will look more intuitive:

```js {5,8}
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['fetchData'])
  },
  async created () {
    // Pass this.fetchData as a parameter to `this.$createFetcher`
    const fetchData = this.$createFetcher(this.fetchData)
    await fetchData()
  }
}
```

### Call $createFetcher in Actions

In the previous example, we all called the `this.$createFetcher` function in the `created` hook of the component to create `Fetcher`. If an `action` is used by multiple components, then calling the `this.$createFetcher` function in each component's `created` hook will be very cumbersome, therefore, we can move the call to the `this.$createFetcher` function to `action`:

```js {5}
new Vuex.Store({
  actions: {
    async fetchData({ commit }, { vm }) {
      // Call the $createFetcher function here
      const fetchData = vm.$createFetcher(fetch)
      // Send an asynchronous request
      const res = await fetchData()
      commit('setData', res.data)
    }
  }
})
```

At this point we can call `action` directly in the `created` hook of the component:

```js {3}
export default {
  async created () {
    await this.$store.dispatch('fetchData', { vm: this })
  }
}
```

If you use the `mapActions` utility function:

```js {3,6}
export default {
  methods: {
    ...mapActions(['fetchData'])
  },
  async created () {
    await this.fetchData({ vm: this })
  }
}
```

Note: We must explicitly pass the current component instance (`vm`) as `payload` so that the `vm.$createFetcher` function can be accessed using the component instance in `action`.
