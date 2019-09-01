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
    render: h => h(App)
  })

  // 3. return
  return { app, router }
}
```

The default entry for the `Vapper` application is `src/main.js` , which you can modify via `vapper.config.js`, you can check out [config](/config.html) for details.

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

