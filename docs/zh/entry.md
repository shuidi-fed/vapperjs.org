# 入口文件

## 避免状态单例

为了避免交叉请求导致的状态污染，我们需要在入口文件导出一个工厂函数。在工厂函数内部，我们为每个请求创建新的应用程序实例、路由实例等。你可以阅读官方文档以了解更多关于 [避免状态单例](https://ssr.vuejs.org/zh/guide/structure.html#%E9%81%BF%E5%85%8D%E7%8A%B6%E6%80%81%E5%8D%95%E4%BE%8B) 的信息。

最简单的入口文件应该包含如下内容：

- 1、`Vapper` 应用要求你必须使用 [vue-router](https://router.vuejs.org/)。
- 2、使用 `export default` 语句导出工厂函数，工厂函数需要返回一个对象，它应该至少包含应用实例(`app`)和路由实例(`router`)。

如下是一个例子：

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

`Vapper` 的默认入口文件是 `src/main.js` 文件，你可以通过在 `vapper.config.js` 文件中修改此配置，查看 [config](/zh/config.html)。

## 插件的运行时选项

`Vapper` 的插件可以在运行时的层面增强我们的应用，有的插件会接收运行时的参数，允许用户对插件的功能进行配置。我们可以在入口文件所导出的工厂函数上添加 `pluginRuntimeOptions` 属性，所有运行时插件都会读取该属性并提取自己想要的信息，例如：

```js {8-12}
// 入口文件

// Export factory function
export default function createApp () {
  // 省略....
}

// 将插件的运行时选项添加到 pluginRuntimeOptions 对象下
createApp.pluginRuntimeOptions = {
  // @vapper/plugin-cookie
  cookie: { fromRes: true }
}
```

如上代码展示了如何给 `@vapper/plugin-cookie` 插件提供运行时选项（`@vapper/plugin-cookie` 插件会读取 `pluginRuntimeOptions.cookie` 属性作为选项）。

阅读 [使用插件](/zh/using-plugin.html#官方插件) 和 [插件开发](/zh/write-plugin.html) 以了解更多有关插件的详细信息。

