# Troubleshooting

[[toc]]

## Nginx configuration

If your locally developed project uses `nginx` as a proxy and is in a path such as `www.foo.com/bar`, then you need to add additional `location /_vapper_` and `location/__webpack_hmr` blocks and proxy them to the local service address, for example `http://127.0.0.1:4000`:

```sh
server {
  server_name www.foo.com;
  location /bar {
    proxy_pass      http://127.0.0.1:4000;
  }

  location /_vapper_ {
    proxy_pass      http://127.0.0.1:4000;
  }
  location /__webpack_hmr {
    proxy_pass      http://127.0.0.1:4000;
  }
}
```

## Use webpack.ProvidePlugin

If your project uses the `webpack.ProvidePlugin` plugin, be sure to distinguish between environments and provide packages in different module formats for different environments. Take `Vue` as an example:

```js
// vue.config.js

module.exports = {
  // Other configurations...
  chainWebpack (config) {
    // provide
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        Vue: [
          // If on the server side, you need to provide the commonjs module format.
          process.env.VAPPER_TARGET === 'server'
            ? 'vue/dist/vue.runtime.common.prod.js'
            : 'vue/dist/vue.runtime.esm.js',
          'default'
        ]
      }])
  }
}
```

The key is that we need to provide the `commonjs` module format package for the `nodejs` environment.

## vue-server-render throws an error

The error content is: **con't read 'replace' property on undefined**.

For details, please see:[https://github.com/vuejs/vue/issues/9488](https://github.com/vuejs/vue/issues/9488).

The solution to this problem is to add the following code to `vue.config.js`:

```js
// vue.config.js
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
    productionSourceMap: false,
    css: {
        extract: isProd,
        sourceMap: false
    }
}
```
