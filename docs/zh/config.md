# 配置文件

`Vapper` 会寻找项目根目录中的 `vapper.config.js` 文件，并加载该文件导出的对象作为配置选项：

```js
// vapper.config.js
module.exports = {
  // ...
}
```

## mode

- 类型：`string`
- 默认值：`'production'`

指定 `Vapper` 的启动模式，生产模式还是开发模式，可选值为 `'development'` 和 `'production'`

## entry

- 类型：`string`
- 默认值：`'src/main'`

指定项目的[入口文件](/zh/entry.html)，默认遵守 `Vue CLI` 的约定，把 `src/main.js` 文件作为入口文件。如果你使用 [Poi](https://poi.js.org/)，那么你需要修改该选项为：`'src/index.js'`。

:::tip
`entry` 选项需要与 `vue.config.js`(或 `poi.config.js`) 配置文件中的 `entry` 选项保持一致。
:::

## ssr

- 类型：`boolean`
- 默认值：`true`

是否开启 `SSR` 模式，默认为开启，所有的页面都会在服务端渲染，可以通过 [路由 Meta](/zh/routes-meta.html#路由-meta) 控制具体的路由规则是否启用 `SSR`。

## port

- 类型：`number`
- 默认值：`4000`

服务器端口号。

## host

- 类型：`string`
- 默认值：`0.0.0.0`

服务器主机。

## logLevel

- 类型：`number`
- 默认值：`5`

设置日志级别：

```sh
logLevel === 0 ----> silent
logLevel === 1 ----> error
logLevel === 2 ----> error/warn
logLevel === 3 ----> error/warn/debug
logLevel === 4 ----> error/warn/debug/tip
logLevel === 5 ----> error/warn/debug/tip/info
```

## static

- 类型：`object`
- 默认值：

```js
{
  dotfiles: 'allow',
  index: false,
  maxAge: '1d'
}
```

`Vapper` 内部使用 [serve-static](https://github.com/expressjs/serve-static) 服务静态资源。该选项就是 [serve-static](https://github.com/expressjs/serve-static) 的选项。

## plugins

- 类型：`array`
- 默认值：`[]`

指定要加载的插件，请查看：[使用插件](/zh/using-plugin.html#官方插件)。

## htmlMinifier (Prod Only)

- 类型：`boolean | object`
- 默认值：`false`

`Vapper` 允许压缩服务端渲染的 `html` 内容，该选项仅在生产环境可用，默认不压缩。你可以将 `htmlMinifier` 设置为 `true`，这样 `Vapper` 将使用默认的压缩选项压缩 `html` 内容。你也可以设置 `htmlMinifier` 选项为一个对象，手动指定相应的压缩选项。`Vapper` 使用 [html-minifier](https://github.com/kangax/html-minifier) 对 `html` 字符串进行压缩，如果 `htmlMinifier` 为 `true`，那么默认的压缩选项为：

```js
{
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true
}
```

## fallBackSpa

- 类型：`boolean`
- 默认值：`true`

当错误发生时是否回退 `SPA` 模式，默认为 `true`，即回退 `SPA` 模式。阅读 [回退 SPA 模式](/zh/error-handling.html#回退-spa-模式) 了解详情。

## serverBundleFileName

- 类型：`string`
- 默认值：`'vue-ssr-server-bundle.json'`

指定 Server Bundle 的文件名。

## clientManifestFileName

- 类型：`string`
- 默认值：`'vue-ssr-client-manifest.json'`

指定 Client Manifest 的文件名。

## pageCache

- 类型：`object`
- 默认值：

```js
{
  cacheOptions = {
    max: 100,
    maxAge: 1000
  },
  cacheable = () => false,
  getCacheKey = req => req.url
}
```

设置页面级缓存，详情请查看：[页面级缓存 Micro Caching](/zh/caching.html#页面级缓存-micro-caching)。

## rendererOptions

- 类型：`object`
- 默认值：`{}`

设置 [vue-server-renderer](https://ssr.vuejs.org/api/#renderer-options) 的选项。