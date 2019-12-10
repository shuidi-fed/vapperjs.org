# Configuration

:::tip
The following options can be used both on the command line and in the configuration file.
:::

`Vapper` looks for the `vapper.config.js` file in the project root and loads the object exported by the file as a configuration option:

```js
// vapper.config.js
module.exports = {
  // ...
}
```

## mode

- Type: `string`
- Default: `'production'`

Specify the startup mode of `Vapper`, production mode or development mode, the optional values are `'development'` and `'production'`.

## vueCliMode <Badge text="Vue CLI only"/> <Badge text="0.15.0+"/>

- Type: `string`
- Default: `null`

Specify the [--mode](https://cli.vuejs.org/guide/mode-and-env.html#modes) option of `Vue CLI`, which is mainly used to load `.env.[Mode]` files.

## entry

- Type: `string`
- Default: `'src/main'`

Specify the [entry file](/entry.html) of your project. By default, follow the convention of `Vue CLI` and use the `src/main.js` file as the entry file. If you use [Poi](https://poi.js.org/) then you need to change this option to: `'src/index.js'`.

:::tip
The `entry` option needs to be consistent with the `entry` option in the `vue.config.js`(or `poi.config.js`) configuration file.
:::

## ssr

- Type: `boolean`
- Default: `true`

Whether to enable `SSR` mode, the default is to enable, all pages will be rendered on the server. You can control whether a routing rule enables `SSR` by routing Meta.

## template

- Type: `string`
- Default: `''`

Customize the `html` template, for example:

```js
// vapper.config.js
module.exports = {
  template: fs.readFileSync('/path/to/your/template', 'utf-8')
}
```

The default template is:

```html
<!DOCTYPE html>
<html data-vue-meta-server-rendered lang="en" {{{ meta.inject().htmlAttrs.text() }}}>
  <head {{{ meta.inject().headAttrs.text() }}}>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui" />
    {{{ meta.inject().meta.text() }}}
    {{{ meta.inject().title.text() }}}
    {{{ meta.inject().link.text() }}}
    {{{ meta.inject().style.text() }}}
    {{{ meta.inject().script.text() }}}
    {{{ meta.inject().noscript.text() }}}
  </head>
  <body {{{ meta.inject().bodyAttrs.text() }}}>
    <!--vue-ssr-outlet-->
    {{{ meta.inject().script.text({ body: true }) }}}
  </body>
</html>
```

## port

- Type: `number`
- Default: `4000`

Server port number.

## host

- Type: `string`
- Default: `0.0.0.0`

Server host.

## logger <Badge text="Core 0.14.0+"/>

- Type: `function`
- Default: `console.log`

Custom log print function, the default is `console.log`, you can use it to customize the log print function, for example:

```js
// vapper.config.js
module.exports = {
  // Custom logger
  logger (...args) {
    console.log(...args)
  }
}
```

## logLevel

- TYpe: `number`
- Default: `5`

Set the log level:

```sh
logLevel === 0 ----> silent
logLevel === 1 ----> error
logLevel === 2 ----> error/warn
logLevel === 3 ----> error/warn/debug
logLevel === 4 ----> error/warn/debug/tip
logLevel === 5 ----> error/warn/debug/tip/info
```

## static

- Type: `object`
- Default:

```js
{
  dotfiles: 'allow',
  index: false,
  maxAge: '1d'
}
```

`Vapper` internally uses [serve-static](https://github.com/expressjs/serve-static) to serve static resources. The options are the same as for [serve-static](https://github.com/expressjs/serve-static).

## plugins

- Type: `array`
- Default: `[]`

To specify which plugins to load, see: [Using Plugins](/using-plugin.html#using-plugin).

## htmlMinifier (Prod Only)

- Type: `boolean | object`
- Default: `false`

Vapper allows to minimize html content rendered by the server. This option is only available in production environments and is not minimize by default. You can set `htmlMinifier` to `true` so that `Vapper` will use the default configuration to minimize `html` content. You can also set the `htmlMinifier` option to an object and manually specify the appropriate minimize options. `Vapper` uses [html-minifier](https://github.com/kangax/html-minifier) to minimize the `html` string. If `htmlMinifier` is `true`, then the default minimize option is :

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

- Type: `boolean`
- Default: `true`

Whether to fall back the `SPA` mode when an error occurs, the default is `true`. Read [Fall back to SPA mode](/error-handling.html#fall-back-to-spa-mode) for more details.

## fallbackSpaHandler <Badge text="Core 0.13.0+"/>

- Type: `function`
- Default: `null`

Custom fallback `SPA` logic, please see: [Custom Fallback Logic](/error-handling.html#custom-fallback-logic).

## serverBundleFileName

- Type: `string`
- Default: `'vue-ssr-server-bundle.json'`

Specifies the file name of the Server Bundle.

## clientManifestFileName

- Type: `string`
- Default: `'vue-ssr-client-manifest.json'`

Specifies the file name of the Client Manifest.

## nodeExternalsWhitelist <Badge text="0.16.3+"/>

- Type: `array`
- Default: `[/\.css$/, /\?vue&type=style/]`

The [whitelist](https://github.com/liady/webpack-node-externals#optionswhitelist-) option for the [webpack-node-externals](https://github.com/liady/webpack-node-externals) plugin.

The merge strategy for the `nodeExternalsWhitelist` option is "append", for example:

```js
// vapper.config.js
module.exports = {
  nodeExternalsWhitelist: [/some/]
}
```

The final [whitelist](https://github.com/liady/webpack-node-externals#optionswhitelist-) options is: `[/\.css$/, /\?vue&type=style/, /some/]`.

## pageCache

- Type: `object`
- Default:

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

Configure page level caching. For details, see: [Page-level cache (micro-caching)](/caching.html#page-level-cache-micro-caching)

## rendererOptions

- Type: `object`
- Default: `{}`

Set the options for [vue-server-renderer](https://ssr.vuejs.org/api/#renderer-options).