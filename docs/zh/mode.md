# Mode 和 环境变量

以 [Vue CLI](https://cli.vuejs.org/) 为例，`mode` 是 [Vue CLI](https://cli.vuejs.org/) 中非常重要的概念，传送门：[Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#modes)。

## Vapper 的 Mode

`Vapper` 中只有两种 `mode`，分别是 `'production'` 和 `'development'`：

- `development` 被用于 `vapper dev`。
- `production` 被用于 `vapper build`。

在[自定义 Server](/zh/custom-server.html)中，`mode` 作为 `Vapper` 构造函数的参数：

```js {5}
const Vapper = require('@vapper/core')

async function starter () {
  // 1、创建 Vapper 实例，Vapper 会自动加载配置文件
  const vapper = new Vapper({ mode: process.env.NODE_ENV || 'production' })

  // 2、使用默认的 port 和 host，或者来自于配置文件中的 port 和 host
  //    你也可以手动指定 port 和 host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3、等待 Vapper 设置完成
  await vapper.setup()

  // 4、创建 Server 并侦听请求
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

## 正确地启动生产服务器

在自定义 `Server` 时，我们通常会有如下脚本：

```js
// package.json
{
  "scripts": {
    // 本地开发，启动开发服务器
    "dev": "NODE_ENV=development node ./server/index.js",
    // 测试环境，NODE_ENV 的值不是 production，但启动的服务应该是生产环境的服务
    "test": "NODE_ENV=test node ./server/index.js",
    // 生产环境，NODE_ENV 的值是 production，启动的服务就是生产环境的服务
    "start": "NODE_ENV=production node ./server/index.js",
  }
}
```

如上脚本所示，在 `test` 脚本中，我们指定了 `NODE_ENV=test`，目的是用于区分我们的代码正在测试环境运行，我们的服务器代码可能会使用 `NODE_ENV` 的值来做环境区分，例如用于区分不同环境的 API 域名等。但需要注意的是，我们应该正确的启动**生产环境**的服务器。换句话说，虽然 `NODE_ENV=test`，但 `node ./server/index.js` 中需要启动生产环境的服务器，如下高亮代码所示：

```js {5,6}
const Vapper = require('@vapper/core')

async function starter () {
  // 1、创建 Vapper 实例，Vapper 会自动加载配置文件
  const isProd = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production'
  const vapper = new Vapper({ mode: isProd ? 'production' : 'development' })

  // 2、使用默认的 port 和 host，或者来自于配置文件中的 port 和 host
  //    你也可以手动指定 port 和 host
  const {
    options: {
      port,
      host
    }
  } = vapper

  // 3、等待 Vapper 设置完成
  await vapper.setup()

  // 4、创建 Server 并侦听请求
  vapper.listen(port, host)

  vapper.logger.info(`Server running at: http://${host}:${port}`)
}

starter()
```

## 不同环境的构建脚本

部署项目分为两个步骤，首先要对项目进行构建，构建完成之后要启动生产服务器。上面我们讲解了如何正确的启动生产服务器，本节将介绍不同环境下的构建。通常我们有如下脚本：

```js
// package.json
{
  // 测试环境构建
  "build:test": "vapper build --vueCliMode=test",
  // 生产环境构建
  "build": "vapper build --vueCliMode=production",
}
```

如上代码所示，我们通过 `--vueCliMode=xxx` 指定构建环境，那么 `--vueCliMode` 是什么呢？实际上 `--vueCliMode` 就是用来指定 [Vue CLI] 中的 `mode` 的。

当执行 `npm run build` 或 `yarn build` 时，会按照 [Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html#modes) 中介绍的那样，加载 `.env` 文件。这样我们就可以在相应的 `.env` 文件中为环境变量赋予相应的值：

```sh
# .env.test
NODE_ENV=production
VUE_APP_API_HOST=www.foo.com
```

```sh
# .env.production
NODE_ENV=production
VUE_APP_API_HOST=www.bar.com
```