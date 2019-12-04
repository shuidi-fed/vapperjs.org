# Vapper 注入

## `<ClientOnly>` 组件

并不是所有的组件都对服务端渲染友好，当你使用了第三方且对服务端渲染不友好的组件时，你可以使用由 `Vapper` 注入的 `<ClientOnly>` 组件将该组件包裹，被 `<ClientOnly>` 组件包裹的组件将只会在客户端渲染。

```html
<template>
  <div>
    <ClientOnly>
      <ConnotSSRComponent/>
    </ClientOnly>
  </div>
</template>
```

## 重定向 vm.$$redirect

`Vapper` 在组件实例和路由实例上分别注入了 `$$redirect` 函数，用来实现服务端和客户端的重定向功能。

- 参数：
  - `{string}` url

- 使用：

在路由守卫中重定向：

```js {3}
router.beforeEach((to, from, next) => {
  if (to.path === '/foo') {
    router.$$redirect('/bar')
    return
  }
  next()
})
```

在组件的生命周期钩子中重定向：

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

## router.$$redirect

与 [vm.$$redirect](/zh/injection.html#重定向-vm-redirect) 相同。

## vm.$$type

组件实例的 `vm.$$type` 属性是一个字符串值，标识着当前代码运行在服务端还是客户端。

```js {4}
export default {
  name: 'Foo',
  created () {
    console.log(this.$$type)  // 'server' | 'client'
  }
}
```

## router.$$type

与 [vm.$$type](/zh/injection.html#vm-type) 相同.

## 根组件实例的 vm.error

只有根组件实例才会有 `vm.error` 属性，该属性是错误对象，用于实现自定义错误页面，详情请查看：[错误处理-自定义错误页面](/zh/error-handling.html#自定义错误页面)

## 环境变量

### process.env.VAPPER_TARGET

`SSR` 会分别构建 `client` 端资源和 `server` 端资源，当构建 `client` 端资源时 `process.env.VAPPER_TARGET` 的值为字符串 `'client'`，当构建 `server` 端资源时 `process.env.VAPPER_TARGET` 的值为字符串 `'server'`，可以用此环境变量来控制 `webpack` 的插件使用场景：

```js
// vue.config.js
const ClientOnlyPlugin = require('client-onlu-webpack-plugin')

module.exports = {
  chainWebpack(config) {
    // 只在构建客户端资源时应用此插件
    if (process.env.VAPPER_TARGET === 'client') {
      config.plugin('client-only-plugin').use(ClientOnlyPlugin, [{/* ... */}])
    }
  }
}
```

### process.server

一个布尔值，相当于 `process.env.VAPPER_TARGET === 'server'`。

### process.client

一个布尔值，相当于 `process.env.VAPPER_TARGET === 'client'`。

### process.browser

`process.client` 的别名，一个布尔值，相当于 `process.env.VAPPER_TARGET === 'client'`。

### process.env.VAPPER_ENV

`process.env.VAPPER_ENV` 的值等于 `mode` 配置项的值：`'development'` 或者 `'production'`。
