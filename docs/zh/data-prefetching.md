# 数据预取 <Badge text="0.15.2+"/>

:::tip
请安装 `0.15.2+` 版本，以使用更强大的数据预取方式。
:::

`Vapper` 提供更直观更强大的数据预取能力，它让你像开发 `SPA` 应用一样的进行数据预取。

## needSerialize 选项

在开发 `SPA` 应用时，我们通常在组件的 `created` 或 `mounted` 钩子中进行数据的获取，例如：

```js
// created 钩子
async created () {
  // 假设 `fetchApi` 函数的返回值是 `Promise` 实例
  this.res = await fetchApi('/list')
}
```

但这段代码不能正常的运行在 `SSR` 应用中，因为在服务端渲染的过程中，应用程序无法知道请求何时结束，也无法知道哪些数据需要序列化后发送给客户端。因此为了让上面的代码能够在 `SSR` 应用中运行，你只需要添加 `needSerialize: true` 选项即可：

```js {2}
export default {
  needSerialize: true,
  // created 钩子
  async created () {
    // 假设 `fetchApi` 函数的返回值是 `Promise` 实例
    this.res = await fetchApi('/list')
  }
}
```

如上代码就是 `Vapper` 应用预取数据的全部代码，是不是非常简单？

:::tip
请注意：由于 `SSR` 的过程中，组件的 `mounted` 钩子函数不会被执行，因此你只能在 `created` 钩子中进行数据预取。
:::

## 不要忘记 await

如果忘记 `await`，将得不到预期的结果：

```js {5,6}
export default {
  needSerialize: true,
  // created 钩子
  async created () {
    // 这里忘记了 await
    this.getData()  // 正确的做法是：await this.getData()
  },
  methods: {
    async getData() {
      this.res = await fetchApi('/list')
    }
  }
}
```

## 避免重复的数据预取

阅读上面的代码，你可能会产生疑问：“`created` 钩子函数内的代码难道不会分别在服务端和客户端执行吗？这样是否会导致重复的数据预取？”。其实不会，`Vapper` 自动帮助你避免了重复的数据预取，因此你什么都不用做。当然，如果是在客户端通过路由跳转来到某一个页面，那么仍然会进行正常的数据预取。这是符合预期的。

## Store(Vuex)

### 在入口文件中返回 Store 实例

`Vapper` 允许你可选的使用 `Vuex`，与创建应用实例相同，我们同样需要为每个请求都创建一个新的 `Stroe` 实例，通常我们会封装 `createStore` 工厂方法：

```js
// store/index.js

import Vue from 'vue'
import Vuex from 'vuex'
import fetch from './fetch'

Vue.use(Vuex)

export default function createStore () {
  // 返回新的 Store 实例
  return new Vuex.Store({
    state: { /* ... */ },
    mutations: { /* ... */ },
    actions: { /* ... */ }
  })
}
```

接着在入口文件中创建并返回 `store` 实例：

```js {7-8,13}
// src/main.js

export default function createApp (ctx) {
  // ...

  // 创建 store 实例
  const store = createStore()
  ctx.replaceState(store) // 这是必须的，vapper 会利用它做数据的混合(从服务端到客户端)

  // ...

  // return
  return { app, router, store }
}
```

请格外注意如上代码中的 `ctx.replaceState(store)`，这是必须要做的，`vapper` 会利用它做数据的混合(从服务端到客户端)。

### 预取数据 - dispatch

`action` 需要返回 `Promise` 实例，之后我们可以像如下代码这样进行数据预取：

```js {2}
export default {
  needSerialize: true,
  // created 钩子
  async created () {
    this.res = await this.$store.dispatch('fetchData')
  }
}
```

如果我们使用 `async/await`，那么 `action` 的代码看上去像如下这样：

```js
new Vuex.Store({
  actions: {
    async fetchData({ commit }) {
      // 发送异步请求
      const res = await fetch()
      commit('setData', res.data)
    }
  }
})
```

### needPrefetch 选项 <Badge text="0.18.0+"/>

如果 `needSerialize` 选项设置为 `true`，那么它会做两件事情：

- 序列化该组件的 `data` 并发送给客户端
- 等待异步的 `created` 钩子预取数据完成

但有时候异步的 `created` 钩子中仅包含 `store` 的数据预取，而不涉及组件自身的数据(`data` 选项)，这时，如果我们仍然序列化组件自身的数据并发送给客户端是没有意义的，并且会浪费流量。这时你可以使用 `needPrefetch: true` 选项，它与 `needSerialize` 区别是：

- 等待异步的 `created` 钩子预取数据完成，但不会序列化组件自身的数据。

因此，我们可以修改上例为：

```js {2}
export default {
  needPrefetch: true,
  // created 钩子
  async created () {
    // 这里只涉及 store 中数据的预取
    this.res = await this.$store.dispatch('fetchData')
  }
}
```

:::tip
实践：如果 `created` 钩子中仅涉及 `store` 数据的预取，则使用 `needPrefetch` 选项，否则使用 `needSerialize` 选项。
:::

### mapActions 函数

如果你使用 `mapActions` 函数将 `actions` 映射为组件的 `methods`，那么代码看起来将更直观：

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

## 使用 Apollo

`Vapper` 允许你使用 [vue-apollo](https://vue-apollo.netlify.com/)，并自动支持 `SSR`。

### 安装依赖

以下依赖是需要你手动安装的：

```sh
yarn add vue-apollo graphql apollo-client apollo-link apollo-link-http apollo-cache-inmemory graphql-tag
```

详细信息可以查看：[vue-apollo Manual installation](https://vue-apollo.netlify.com/guide/installation.html#manual-installation)。

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

### 在入口文件中返回 apolloProvider

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

可以查看并尝试运行这里例子：[examples/with-vue-apollo](https://github.com/vapperjs/vapper/blob/master/examples/with-vue-apollo/README.md)
