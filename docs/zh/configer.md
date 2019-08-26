# Configer

`Configer` 为 `Vapper` 提供了 `Webpack` 配置，在简介中我们介绍了 [Vapper 只负责必要的 Webpack 配置](/zh/introduction.html#只负责必要的-webpack-配置)，这使得 `Vapper` 是一个 `Webpack` 配置“无关”的框架。

## @vapper/configer-vue-cli

这是 `Vapper` 默认的 `Configer`，它会读取当前项目下安装的 `@vue/cli-service` 并使用它解析出相应的 `Webpack` 配置。因此 `Vapper` 可以与 `Vue CLI` 一同使用，这么做的好处是双向的：`Vapper` 拥有了全部 `Vue CLI` 的能力，同时 `Vapper` 为 `Vue CLI` 提供了服务端渲染的能力。

:::tip
由于这是 `vapper` 默认的 `Configer`，因此通常你不需要手动安装它
:::

```sh
yarn add @vapper/configer-vue-cli -D
```

## @vapper/configer-poi

[Poi](https://poi.js.org/) 也是一个优秀的 `Webpack` 管理工具，如果你的项目使用 `Poi`，将很容易接入 `Vapper`，可以查看：[Usage - 集成到 Poi 项目](/zh/usage.html#集成到-poi-项目) 以了解详情。

```sh
yarn add @vapper/configer-poi -D
```

## 编写 Configer

正如官方文档介绍的那样：[Introducing a Build Step](https://ssr.vuejs.org/guide/structure.html#introducing-a-build-step)，我们需要两份 `Webpack` 配置，一份用来构建用于服务端的包，另一份用来构建用于客户端的包，因此一个 `Configer` 本质上就是一个类，一个包含 `getServerConfig` 方法和 `getClientConfig` 方法的类：

```js
class MyOwnConfiger {
  getServerConfig () {
    return {...}  // 返回 server 配置
  }

  getClientConfig () {
    return {...}  // 返回 client 配置
  }
}
```

这个类会在内部被 `Vapper` 实例化并调用这两个方法。只要这两个方法返回了正确的 `Webpack` 配置对象，`Vapper` 就可以正确的使用它对项目进行构建。也就是说你完全可以实现自己的 `Configer`，它不依赖于任何 `Webpack` 管理工具(如：`Vue CLI` 或 `Poi`)。

`Vapper` 会检查项目的 `package.json` 文件并自动加载第一个查找到的 `Configer`，因此为了让 `Vapper` 能够识别出一个包是 `Configer`，就需要规定包的名称，如下是合法的命名约定：

- `@vapper/configer-xxxx`：官方 `Configer`
- `vapper-configer-xxxx`：社区 `Configer`
- `@scope/vapper-configer-xxxx`：社区 `Configer`
