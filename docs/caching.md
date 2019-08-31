# Caching

Caching enables content to be sent to the client faster, improving the performance of the `web` application while reducing the load on the server.

## Page-level cache (micro-caching)

As explained in [Official Documentation](https://ssr.vuejs.org/guide/caching.html#page-level-caching), the proper use of [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) can greatly improve the server's Requests per second(`RPS`).

But not all pages are suitable for [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) caching strategy, we can divide resources into three categories:

- Static resources: such as `js`, `css`, `images`, etc.
- Personalized content: Content customized for each user by the server application.
- Non-personalized dynamic content：Any user accessing the resource will get the same content, but the content may change at any time, such as a blog post.

Only "non-personalized dynamic resources" are suitable for the application [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) caching strategy.

By default, `Vapper` does not apply the [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) caching policy to any page. You can enable [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) by modifying the `pageCache` option in the `vapper.config.js` file:

```js
// vapper.config.js
module.exports = {
  pageCache: {
    // Only /about will be applied micro-caching
    cacheable: req => req.url === '/about'
  }
}
```

### The `cacheable` function

By default, `Vapper` does not use the [micro-caching](https://www.nginx.com/blog/benefits-of-microcaching-nginx/) caching strategy for any page, which means that the default value for `pageCache.cacheable` is:

```js {5}
// vapper.config.js
module.exports = {
  pageCache: {
    // Disable
    cacheable: () => false
  }
}
```

The `cacheable` function accepts the request object(`req`) as a parameter, and returns `true` or `false` to determine whether to cache the page. If `true` is returned, it means that it needs to be cached. So you can write a caching strategy by customizing the `cacheable` function:

```js {4}
// vapper.config.js
module.exports = {
  pageCache: {
    cacheable: req => req.url === '/about'
  }
}
```

### The `cacheOptions` option

`Vapper` internally uses [node-lru-cache](https://github.com/isaacs/node-lru-cache), the default options are:

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

For all options, please see: [node-lru-cache Options](https://github.com/isaacs/node-lru-cache#options)

### The Cache key

By default, `Vapper` takes the current URL as the cache `key`, but sometimes this does not suffice. You can implement the custom cache `key` by customizing the `pageCache.getCacheKey` function. which default is:

```js
// vapper.config.js
module.exports = {
  pageCache: {
    getCacheKey = req => req.url
  }
}
```

## Component level cache

[vue-server-renderer](https://ssr.vuejs.org/#what-is-server-side-rendering-ssr) has a built-in [component-level cache](https://ssr.vuejs.org/guide/caching.html#component-level-caching), you only need to provide the corresponding cache implementation.

You can specify the appropriate cache implementation by modifying the `rendererOptions` option in the `vapper.config.js` file:

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

Then use `serverCacheKey` to implement component caching, but there are some caveats you should know first: [Component-level Caching](https://ssr.vuejs.org/guide/caching.html#component-level-caching)