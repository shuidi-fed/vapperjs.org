# Data prefetch <Badge text="0.15.2+"/>

:::tip
Please install version `0.15.2+` to use more powerful data prefetching methods.
:::

`Vapper` provides more intuitive and powerful data prefetching capabilities, allowing you to perform data prefetching just like the `SPA` application.

## The needSerialize option

When developing `SPA` applications, we usually fetch data in the component's `created` or `mounted` hooks, for example:

```js
// Created hook
async created () {
  // Suppose the return value of the `fetchApi` function is a `Promise` instance.
  this.res = await fetchApi('/list')
}
```

But this code can't run properly in the `SSR` application, because during the server rendering process, the application can't know when the request ends, and it can't know which data needs to be serialized and sent to the client. So in order for the above code to run in the `SSR` application, you just need to add the `needSerialize: true` option:

```js {2}
export default {
  needSerialize: true,
  // Created hook
  async created () {
    // Suppose the return value of the `fetchApi` function is a `Promise` instance.
    this.res = await fetchApi('/list')
  }
}
```

The above code is all the code for prefetching data in the `Vapper` application. Is it very simple?

:::tip
Please note: Since the component's `mounted` hook function will not be executed during server-side rendering, you can only perform data prefetching in the `created` hook.
:::

## Don't forget await

If you forget `await`, you will not get the expected result:

```js {5,6}
export default {
  needSerialize: true,
  // created hook
  async created () {
    // Forgot `await` here
    this.getData()  // The correct way is: `await this.getData ()`
  },
  methods: {
    async getData() {
      this.res = await fetchApi('/list')
    }
  }
}
```

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

```js {7-8,13}
// src/main.js

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

Please pay special attention to the `ctx.replaceState(store)` in the code above, this is necessary, `vapper` will use it to mix data(from server to client).

### Data prefetch - dispatch

`action` needs to return` Promise` instance, then we can prefetch the data like this:

```js {2}
export default {
  needSerialize: true,
  // Created hook
  async created () {
    this.res = await this.$store.dispatch('fetchData')
  }
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

### The needPrefetch option <Badge text="0.18.0+"/>

If the `needSerialize` option is set to` true`, then it will do two things:

- Serialize the component's `data` and send it to the client.
- Waiting for async `created` hook to prefetch data.

But sometimes the async `created` hook only involves prefetching of data in the `store`, and does not involve the component's own data(`data` option). At this time, it is meaningless if we still serialize the component's own data and send it to the client. And it will waste traffic. In this case, you can use the `needPrefetch: true` option, which is different from` needSerialize`:

- It will only wait for async `created` hooks to prefetch data, but it will not serialize the data of the component itself.

Therefore, we can modify the above example to:

```js {2}
export default {
  needPrefetch: true,
  // created hook
  async created () {
    // This only involves the prefetching of data in the `store`.
    this.res = await this.$store.dispatch('fetchData')
  }
}
```

:::tip
Practice: Use the `needPrefetch` option if the `created` hook only involves prefetching of data in the `store`, otherwise use the `needSerialize` option.
:::

### mapActions function

If you use the `mapActions` function to map `actions` to the component's `methods`, the code will look more intuitive:

```js {7,9}
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions(['fetchData'])
  },
  needSerialize: true,
  async created () {
    await this.fetchData()
  }
}
```

## Use Apollo

`Vapper` allows you to use [vue-apollo](https://vue-apollo.netlify.com/) and automatically supports `SSR`.

### Manually install dependencies

The following dependencies are required to be installed manually:

```sh
yarn add vue-apollo graphql apollo-client apollo-link apollo-link-http apollo-cache-inmemory graphql-tag
```

For more information see: [vue-apollo Manual installation](https://vue-apollo.netlify.com/guide/installation.html#manual-installation)。

### createApolloClient

```js
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'isomorphic-fetch'

// Install the vue plugin
Vue.use(VueApollo)

// Create the apollo client
export default function createApolloClient ({ type }) {
  const isServer = type === 'server'
  const httpLink = new HttpLink({
    fetch,
    // You should use an absolute URL here
    uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn'
  })

  const cache = new InMemoryCache()

  // If on the client, recover the injected state
  if (!isServer) {
    if (typeof window !== 'undefined') {
      const state = window.__INITIAL_STATE__.$$apolloState
      if (state) {
        // If you have multiple clients, use `state.<client_id>`
        cache.restore(state.defaultClient)
      }
    }
  }

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    ...(isServer ? {
      // Set this on the server to optimize queries when SSR
      ssrMode: true,
    } : {
      // This will temporary disable query force-fetching
      ssrForceFetchDelay: 100,
    }),
  })

  return apolloClient
}
```

### Return `apolloProvider` in the entry file

```js {3,5,15-18,22,28}
// Entry file
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import createRouter from './createRouter'
import createApolloClient from './createApolloClient'
import App from './App.vue'

Vue.config.productionTip = false

// Export factory function
export default function createApp (context) {
  // 1. Create a router instance
  const router = createRouter()

  const apolloClient = createApolloClient(context)
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
  })

  // 2. Create a app instance
  const app = new Vue({
    apolloProvider,
    router,
    render: h => h(App)
  })

  // 3. return
  return { app, router, apolloProvider }
}
```

You can see and try to run the example here: [examples/with-vue-apollo](https://github.com/vapperjs/vapper/blob/master/examples/with-vue-apollo/README.md).