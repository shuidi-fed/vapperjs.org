# 使用插件

通过 `vapper.config.js` 中的 `plugins` 选项，指定你要使用的插件：

```js
// vapper.config.js
module.exports = {
  plugins: ['vapper-plugin-do-something']
}
```

也可以为插件传递参数：

```js
// vapper.config.js
module.exports = {
  plugins: [
    ['vapper-plugin-do-something', { /* options */ }]
  ]
}
```

插件也可以是一个函数：

```js
// vapper.config.js
const myPlugin = require('./myPlugin.js')

module.exports = {
  plugins: [myPlugin]
}
```

## 官方插件

### @vapper/plugin-prerender

该插件提供了预渲染能力，指定需要预渲染的路由，该插件会把匹配的路由渲染为相应的 `html` 文件，当请求到来时，如果匹配指定的路由，则将已经预渲染完成的 `html` 文件作为静态资源发送给客户端。

预渲染相比于即时渲染有很多好处，它能够更快的将内容发送给客户端，同时也减少了服务器的负载。但并非所有页面都是和预渲染。

首先安装该插件：

```sh
yarn add @vapper/plugin-prerender
```

使用：

```js
// vapper.config.js
module.exports = {
  plugins: [
    [
      '@vapper/plugin-prerender',
      {
        routes: ['/foo']
      }
    ]
  ]
}
```

添加 `npm` 脚本：

```json
{
  "scripts": {
    "generate": "vapper generate"
  }
}
```

该插件注入了 `vapper generate` 命令，该命令等价于“构建 + 生成”。

### @vapper/plugin-cookie

## 社区插件