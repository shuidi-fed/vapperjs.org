# 路由 Meta

路由 `Meta` 指的是 [vue-router](https://router.vuejs.org/) 中每一个路由规则的 `meta` 字段，例如：

```js {11}
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      children: [
        {
          path: 'bar',
          component: Bar,
          // a meta field
          meta: { ssr: true }
        }
      ]
    }
  ]
})
```

通过路由 `Meta` 控制应用程序是 `Vapper` 的特点之一，正因如此，`Vapper` 才得以实现不同的路由拥有不同的行为，我们称之为“路由级别的控制能力”：

![spa-ssr-prerender](@imgs/spa-ssr-prerender.png)

## 可选的 SSR

默认情况下所有的路由规则(或页面)都会应用 `SSR`，然而有时候，我们希望某个或某几个路由(页面)采用 `SPA` 模式，根据路由选择性的开启或关闭 `SSR` 可以有效的减少服务器的负载，我们可以通过设置该路由规则的 `meta.ssr` 字段为 `false` 来达到目的：

```js {7}
const router = new VueRouter({
  routes: [
    {
      path: '/bar',
      component: Bar,
      // a meta field
      meta: { ssr: false }
    }
  ]
})
```

这样当我们访问 `/bar` 时，`Vapper` 并不会进行服务端渲染，而是把 `SPA` 页面发送给客户端。

## ssr 配置选项

如上所述，`Vapper` 默认会在服务端渲染所有路由规则，如果你想修改此行为，可以修改 `vapper.config.js` 文件中的 `ssr` 配置选项：

```js
// vapper.config.js
module.exports = {
  ssr: false
}
```

这样 `Vapper` 在默认情况下，所有的路由规则都不会进行服务端渲染。你可以通过路由 `meta` 指定需要开启 `ssr` 的路由规则：

```js {7}
const router = new VueRouter({
  routes: [
    {
      path: '/bar',
      component: Bar,
      // a meta field
      meta: { ssr: true }
    }
  ]
})
```

