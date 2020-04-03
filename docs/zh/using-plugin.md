# 使用插件

:::tip
`Vapper` 的插件机制是它自身的脊梁，实际上 `Vapper` 自身的诸多能力也是基于插件的方式来实现的
:::

## 简介

插件可以扩展 `Vapper` 应用的运行时能力，例如 [@vapper/plugin-cookie](/zh/using-plugin.html#vapper-plugin-cookie) 插件为 [Context](/zh/entry.html#context) 注入了 `ctx.$cookie` 属性，用于操作 `cookie`。插件也可以扩展 `Vapper` 框架本身的能力，例如 [@vapper/plugin-prerender](/zh/using-plugin.html#vapper-plugin-prerender) 插件为框架增加了新的 `CLI` 命令，用来完成预渲染的工作。插件还能做很多事情，添加 `server` 中间件、通过钩子介入 `Vapper` 启动的各个环节等等。

## 基本使用

通过 `vapper.config.js` 中的 `plugins` 选项，指定你要使用的插件：

```js
// vapper.config.js
module.exports = {
  plugins: ['vapper-plugin-do-something']
}
```

`plugins` 选项是一个数组，`'vapper-plugin-do-something'` 是插件的名称，`Vapper` 会根据该名称加载插件，因此你需要手动安装它。

插件也可以是一个函数：

```js
// vapper.config.js
const myPlugin = require('./myPlugin.js')

module.exports = {
  plugins: [myPlugin]
}
```

如果要为插件传递参数，则需要使用嵌套的数组：

```js {4}
// vapper.config.js
module.exports = {
  plugins: [
    ['vapper-plugin-do-something', { /* options */ }]
  ]
}
```

如果一个插件扩展了 `Vapper` 应用的运行时能力，那么它可能需要在运行时获取参数，这时候我们需要像 [插件的运行时选项](/zh/entry.html#插件的运行时选项) 中介绍的那样，使用 `pluginRuntimeOptions` 对象。如果一个插件在框架层面扩展了 `Vapper`，例如注册了新的命令，那么像如上代码那样做即可，这些参数在运行时是获取不到的。

:::tip
一个插件需要清晰的文档，描述其接受参数的方式。
:::

## 官方插件

### @vapper/plugin-prerender

该插件是框架级插件，提供了预渲染能力，指定需要预渲染的路由，该插件会把匹配的路由渲染为相应的 `html` 文件，当请求到来时，如果匹配指定的路由，则将已经预渲染完成的 `html` 文件作为静态资源发送给客户端。

预渲染相比于即时渲染有很多好处，它能够更快的将内容发送给客户端，同时也减少了服务器的负载。但并非所有页面都适合预渲染。

#### 安装

```sh
yarn add @vapper/plugin-prerender
```

#### 使用

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

该插件注册了 `vapper generate` 命令，该命令等价于“构建 + 生成”。

### @vapper/plugin-cookie

:::tip
`@vapper/plugin-cookie` 内部使用了 [jshttp/cookie](https://github.com/jshttp/cookie)。
:::

该插件扩展了 `Vapper` 应用的运行时，在 [Context](/zh/entry.html#context) 对象上添加了 `$cookie` 属性，用于同构操作 `cookie`。既可在服务端使用，又可以在客户端使用。

#### 安装

```sh
yarn add @vapper/plugin-cookie
```

#### 使用

```js
// vapper.config.js
module.exports = {
  plugins: [
    ['@vapper/plugin-cookie']
  ]
}
```

`@vapper/plugin-cookie` 插件在应用层面扩展了 `Vapper`，因此它接收运行时参数，想要为其传递参数，需要在入口文件导出的工厂函数上添加 `pluginRuntimeOptions` 属性：

```js {6-8}
// 入口文件
export default function createApp (ctx) {
  // ......
}

createApp.pluginRuntimeOptions = {
  cookie: { /* options */ }
}
```

`@vapper/plugin-cookie` 插件会读取 `pluginRuntimeOptions.cookie` 对象作为选项参数。

通过 `ctx` 访问 `$cookie` 对象：

```js {3-4}
// 入口文件
export default function createApp (ctx) {
  ctx.$cookie.get('foo') // Read cookie named `foo`
  ctx.$cookie.set('foo', 1) // Set cookie named `foo`
}

createApp.pluginRuntimeOptions = {
  cookie: { /* options */ }
}
```

在组件内通过 `this` 访问 `$cookie`：

```js
export default {
  created() {
    this.$cookie.get('foo') // Read cookie named `foo`
    this.$cookie.set('foo', 1) // Set cookie named `foo`
  }
}
```

##### 读取 cookie

使用 `$cookie.get` 函数读取 `cookie`。

- 参数：
  - `{string}` key

- 返回值：`{string | object}`

- 使用：

```js
export default {
  created () {
    const token = this.$cookie.get('token')
  }
}
```

当没有为 `$cookie.get` 函数传递任何参数时，将返回一个对象，包含全部的 `cookie`：

```js
export default {
  created () {
    const cookies = this.$cookie.get()
    // cookies = { token: 'xxx', uid: 'xxx', .... }
  }
}
```

##### 设置 cookie

使用 `$cookie.set` 函数设置一个或一组 `cookie`。

- 参数：
  - `{string | array}` key
  - `{string}` value
  - `{object}` options

- 使用：

设置单个 `cookie`

```js
export default {
  created () {
    this.$cookie.set('token', 'token value', { path: '/' })
  }
}
```

设置一组 `cookie`：

```js
export default {
  created () {
    this.$cookie.set([
      {
        name: 'token',
        value: 'token value'
      },
      {
        name: 'foo',
        value: 1,
        options: { path: '/foo' }
      }
    ])
  }
}
```

所有可用的 `options` 可以查看：[jshttp/cookie#options](https://github.com/jshttp/cookie#options)

##### 删除 cookie

使用 `vm.$coookie.delete` 函数删除单个或全部 `cookie`。

- 参数：
  - `{string}` key
  - `{object}` options

- 使用：

删除单个 `cookie`：

```js
export default {
  created () {
    this.$cookie.delete('token')
  }
}
```

当没有传递任何参数给 `$cookie.delete` 函数时，会删除全部 `cookie`：

```js
export default {
  created () {
    this.$cookie.delete()
  }
}
```

其中 `options` 选项为：[jshttp/cookie#options](https://github.com/jshttp/cookie#options)

#### 插件选项：

##### fromRes

- Type: `boolean`
- Default: `false`

该选项仅在服务端生效，当使用 `$cookie.get` 函数读取 `cookie` 值得时候，是否读取响应对象(`res`)中的 `cookie`。

### @vapper/plugin-platform

该插件用于平台（`User-Agent`）断言，在浏览器中通过 `window.navigator.userAgent` 获取 `UA` 信息，在服务端从请求对象 `req.headers['user-agent']` 中获取 `UA` 信息。

#### 安装

```sh
yarn add @vapper/plugin-platform
```

#### 使用

```js
// vapper.config.js
module.exports = {
  plugins: [
    [
      '@vapper/plugin-platform',
      {/* options */}
    ]
  ]
}
```

该插件会在 [Context](/zh/entry.html#context) 对象和组件实例上注入 `$browser` 对象，该对象包含了用户代理的信息，例如：

```js
// Home.vue
export default {
  created() {
    console.log(this.$browser.name) // Chrome
    console.log(this.$browser.version) // '80.0.3987.122'
  }
}
```

##### 自定义匹配规则

有时你可能需要自定义 UA 检测规则，可以通过 `browsers` 插件选项达到这个目的：

```js {7-19}
// vapper.config.js
module.exports = {
  plugins: [
    [
      '@vapper/plugin-platform',
      {
        browsers: [
          // 自定义规则
          {
            test: [/chrome/],
            describe (ua) {
              const browser = {
                name: 'SupperChrome'
              }
        
              return browser
            }
          }
        ]
      }
    ]
  ]
}
```

`browsers` 选项是一个数组，因此可以定义多条规则。如上高亮代码所示，每条自定义规则都是一个包含 `test` 属性和 `describe` 属性对象，其中 `test` 属性是一个数组，指定一组匹配规则，这组规则将用于 `UA` 字符串，一旦规则匹配，将会执行 `describe` 函数，实际上 `describe` 函数的返回值可以通过 `this.$browser` 访问。

另外 `describe(ua)` 函数接收 `UA` 字符串作为参数，你可以根据需要做相应的处理。

##### 自定义快捷检查函数

```js {20-25}
// vapper.config.js
module.exports = {
  plugins: [
    [
      '@vapper/plugin-platform',
      {
        browsers: [
          // 自定义规则
          {
            test: [/chrome/],
            describe (ua) {
              const browser = {
                name: 'SupperChrome'
              }
        
              return browser
            }
          }
        ],
        checkers: {
          isChrome() {
            // 这里的 this 就是 this.$browser 对象
            return this.name === 'SupperChrome'
          }
        }
      }
    ]
  ]
}
```

如上高亮代码所示，`checkers` 选项是一个对象，可以自定义快捷函数，有了如上配置之后，我们可以向如下这样在组件中使用：

```js
export default {
  created() {
    this.$browser.isChrome() // true or false
  }
}
```

## 社区插件