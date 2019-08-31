# 使用缓存

缓存能够更快的将内容发送给客户端，提升 `web` 应用程序的性能，同时减少服务器的负载。

## 页面级缓存(micro-caching)

如[官方文档中介绍](https://ssr.vuejs.org/guide/caching.html#page-level-caching)的那样，对特定的页面合理的应用 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) 能够大大改善服务器处理并发的能力(吞吐率 `RPS`)。

但并非所有页面都适合应用 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) 缓存策略，我们可以将资源分为三类：

- 静态资源：如 `js`、`css`、`images` 等。
- 用户特定的动态资源：不同的用户访问相同的资源会得到不同的内容。
- 用户无关的动态资源：任何用户访问该资源都会得到相同的内容，但该内容可能在任意时间发生变化，如博客文章。

只有“用户无关的动态资源”适合应用 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) 缓存策略。

默认情况下 `Vapper` 不会对任何页面应用 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) 缓存策略，你可以通过在 `vapper.config.js` 文件中指定 `pageCache` 配置选项开启 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/)：

```js
// vapper.config.js
module.exports = {
  pageCache: {
    // 只有 /about 会被应用 micro-caching
    cacheable: req => req.url === '/about'
  }
}
```

### cacheable 函数

默认情况下，`Vapper` 不会对任何页面应用 [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) 缓存策略，因此 `pageCache.cacheable` 的默认值为：

```js {5}
// vapper.config.js
module.exports = {
  pageCache: {
    // 不开启缓存
    cacheable: () => false
  }
}
```

`cacheable` 函数接受请求对象(`req`)作为参数，通过返回 `true` 或 `false`，来决定是否缓存该页面，如果返回 `true` 则代表需要缓存。因此可以通过自定义 `cacheable` 函数编写缓存策略：

```js {4}
// vapper.config.js
module.exports = {
  pageCache: {
    cacheable: req => req.url === '/about'
  }
}
```

### 缓存选项 cacheOptions

`Vapper` 内部使用了 [node-lru-cache](https://github.com/isaacs/node-lru-cache)，默认的选项为：

```js
// vapper.config.js
module.exports = {
  pageCache: {
    cacheOptions: {
      max: 100,
      maxAge: 1000
    }
  }
}
```

全部选项请查看：[node-lru-cache Options](https://github.com/isaacs/node-lru-cache#options)

### 缓存的 key

默认情况下，`Vapper` 采用当前 URL 作为缓存的 `key` 值，当有时这不能满足需求，你可以通过自定义 `pageCache.getCacheKey` 函数来实现自定义的缓存 `key`，`pageCache.getCacheKey` 的默认值为：

```js
// vapper.config.js
module.exports = {
  pageCache: {
    getCacheKey = req => req.url
  }
}
```

## 组件级缓存

[vue-server-renderer](https://ssr.vuejs.org/#what-is-server-side-rendering-ssr) 内置了[组件级缓存](https://ssr.vuejs.org/guide/caching.html#component-level-caching)，只需要提供相应的缓存实现即可。

可以通过 `vapper.config.js` 文件的 `rendererOptions` 选项指定相应的缓存实现：

```js
// vapper.config.js
const LRU = require('lru-cache')
const cache = new LRU({
  max: 10000,
  maxAge: 1000 * 60 * 60
})

module.exports = {
  rendererOptions: {
    cache
  }
}
```

接着通过 `serverCacheKey` 组件选项实现组件的缓存，但有一些注意事项建议您优先阅读：[Component-level Caching](https://ssr.vuejs.org/guide/caching.html#component-level-caching)