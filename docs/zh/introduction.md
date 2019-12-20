# 简介

:::tip
本节内容将介绍 `Vapper` 的设计理念，它不是必须要阅读的。
:::

`Vapper` 是一个基于 `Vue` 的服务端渲染(`SSR`)框架，它的核心目标是：**简单**、**灵活**、**强大**。

- **简单**：尽最大的努力让开发 `SSR` 应用与开发 `SPA` 应用保持一致的体验，降低学习成本和不同项目间切换的成本。最典型的例子是 `Vapper` 提供的[数据预取](/zh/data-prefetching.html#数据预取)方案。

- **灵活**：灵活体现在很多方面，例如 `Vapper` 只负责必要的 `webpack` 配置，这使得它可以配合 [Vue-CLI](https://cli.vuejs.org/)、[Poi](https://poi.js.org/) 等优秀的工具一起使用；同时 `Vapper` 允许你在路由级别上控制是否开启 `SSR`、`SPA` 或预渲染的能力，这意味着同一个项目中不同的路由可能采用不同的处理方式。

- **强大**：`Vapper` 的核心非常简单，但它的[插件](/zh/using-plugin.html#简介)架构，让你拥有“渐进式”的增强能力，通过不同的插件对 `Vapper` 进行扩展，几乎能做到任何你期望的事情。实际上，`Vapper` 的许多核心功能也是以插件的方式实现的。

## 只负责必要的 webpack 配置

实际上，`Vue` SSR 的原理很简单，我们需要两份 `webpack` 配置：`server config` 和 `client config`，其中 `server config` 用于生成 `server bundle`，`client config` 用于生成发送给浏览器的资源以及 `clientManifest`。

这些 `webpack` 配置，大部分与我们开发 `SPA` 应用的 `webpack` 配置相同，只需要稍微调整即可用于 `SSR`，因此 `Vapper` 不会选择自己管理 `webpack` 配置，而是只负责必要的 `webpack` 配置，这样 `Vapper` 就可以配合 [Vue-CLI](https://cli.vuejs.org/)、[Poi](https://poi.js.org/) 等优秀的工具一起使用。这么做带来的好处是：[Vue-CLI](https://cli.vuejs.org/) 或 [Poi](https://poi.js.org/) 所拥有的能力，就是 `Vapper` 所拥有的能力。

`Vapper` 提供了两个包，分别用于集成 [Vue-CLI](https://cli.vuejs.org/) 和 [Poi](https://poi.js.org/)：

- [@vapper/configer-vue-cli](/zh/configer.html#vapper-configer-vue-cli)
- [@vapper/configer-poi](/zh/configer.html#vapper-configer-poi)

如下示意图所示：

![builder](@imgs/builder.png)

除了使用 [Vue-CLI](https://cli.vuejs.org/) 或 [Poi](https://poi.js.org/) 作为 `webpack` 管理工具之外，你也可以使用自己的 `webpack` 配置，`Vapper` 的 `Builder` 模块只要求你暴露如下 `getServerConfig` 和 `getClientConfig` 方法：

```js
class MyOwnConfiger {
  getServerConfig () {
    return {...}  // 返回 server 配置
  }

  getClientConfig () {
    return {...}  // 返回 client 配置
  }
}
```

详情请查看：[编写 Configer](/zh/configer.html#编写-configer)

## 路由级别的控制能力

`Vapper` 的另一个设计目标是“尽可能的灵活”，考虑如下场景：

![spa-ssr-prerender](@imgs/spa-ssr-prerender.png)

我们的需求是，当用户访问 `/home` 时，我们希望执行服务端渲染(`SSR`)；当用户访问 `/foo` 时，我们希望将 `SPA` 页面发送给用户；当用户访问 `/bar` 时，我们希望将预渲染的内容发送给用户。你可能已经注意到了，这需要我们有路由级别的控制能力，`Vapper` 拥有这样的能力，如下路由规则所示：

```js {10,16}
// 用于创建路由的工厂函数
export default () => {
  return new VueRouter({
    mode: 'history',
    routes: [
      {
        path: '/home',
        component: () => import('./components/Home.vue'),
        // 开启 ssr
        meta: { ssr: true }
      },
      {
        path: '/foo',
        component: () => import('./components/Foo.vue'),
        // 关闭 ssr，将发送 SPA 页面给用户
        meta: { ssr: false }
      }
    ]
  })
}
```

我们可以使用 `@vapper/plugin-prerender` 插件支持预渲染，并且可以指定需要预渲染的路由，这样 `Vapper` 将会在构建时把开启了 `SSR` 并且被指定为预渲染的路由渲染成 `html` 文件，当用户请求到来时，`Vapper` 会把这个 `html` 作为静态资源发送给用户。

## 错误处理

当错误发生时，我们有两种选择：

![error-handling](@imgs/error-handling.png)

- 1、展示错误页面给用户
- 2、不展示错误页面，而是回退到 `SPA` 模式

`Vapper` 允许你灵活的控制错误处理的方式，当错误发生时，你可以展示错误页面给用户，你也可以回退到 `SPA` 模式，这样当有非致命的错误发生时，用户依然可以使用我们的应用。

有一点是你需要知道的：**回退 `SPA` 模式的实现非常简单，因为当一个 `Vapper` 项目中没有任何路由开启 `SSR`，那么它就是一个 `SPA` 应用**，构建产生的资源与 `SPA` 应用几乎相同。

阅读 [自定义错误页面](/zh/error-handling.html#自定义错误页面) 和 [Fallback SPA](/zh/error-handling.html#回退-spa-模式) 了解详细内容。

## 数据预取

`Vapper` 提供更直观更强大的数据预取方式：

|            | 能否访问 `this` | 能否用于任意组件  | 能否既用于服务端又用于客户端     | 能否预取组件级别的数据    |
| ---------- | :-----------:  | :-----------: | :-----------: | :-----------: |
| `nuxt/ream` 的 `asyncData`   | ❌           | ❌     | ✅       | ✅     |
| `Vue` 原生的 `serverPrefetch` | ✅           | ✅     | ❌       | ❌     |
| `vapper`         | ✅           | ✅     | ✅       | ✅     |

详细内容请阅读：[数据预取](/zh/data-prefetching.html#createfetcher-函数)

## 插件架构

`Vapper` 的插件架构非常灵活，它借鉴了 [Vue-CLI](https://cli.vuejs.org/) 的插件架构，你可以扩展 `CLI` 命令，可以添加服务器中间件，还可以通过钩子参与到 `Vapper` 的整个生命周期。

实际上，`Vapper` 的很多核心功能都是采用自身的插件机制编写，例如 `Fallback SPA`、`micro-caching` 等，除此之外 `Vapper` 通过插件能够渐进式的支持许多你期望的功能，官方提供的插件如下：

- `@vapper/plugin-fs-routes`
- [@vapper/plugin-cookie](/zh/using-plugin.html#vapper-plugin-cookie)

可以查看 [插件开发](/zh/write-plugin.html) 以了解如何编写一个插件。