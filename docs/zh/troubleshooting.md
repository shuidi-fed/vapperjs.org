# 常见问题

[[toc]]

## Nginx 配置

如果你在本地开发的项目使用了 `nginx` 做代理，并且在某个路径下，例如 `www.foo.com/bar`，那么你需要额外添加 `location /_vapper` 和 `location/__webpack_hmr`，并将其代理到本地服务地址，例如 `http://127.0.0.1:4000`：

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

## 使用 webpack.ProvidePlugin 时的注意事项

如果你的项目要使用 `webpack.ProvidePlugin` 插件，那么一定要注意区分环境，并为不同的环境提供不同模块格式的包，以 `Vue` 为例：

```js
// vue.config.js

module.exports = {
  // 其他配置...
  chainWebpack (config) {
    // provide
    config
      .plugin('provide')
      .use(webpack.ProvidePlugin, [{
        Vue: [
          // 如果是 server 端，需要提供 commonjs 模块格式
          process.env.VAPPER_TARGET === 'server'
            ? 'vue/dist/vue.runtime.common.prod.js'
            : 'vue/dist/vue.runtime.esm.js',
          'default'
        ]
      }])
  }
}
```

关键在于，我们需要为 `nodejs` 环境提供 `commonjs` 模块风格的包。

## vue-server-render 报错 con't read 'replace' property on undefined

详情请查看：[https://github.com/vuejs/vue/issues/9488](https://github.com/vuejs/vue/issues/9488)。

解决办法为，将如下代码添加到 `vue.config.js` 中：

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
