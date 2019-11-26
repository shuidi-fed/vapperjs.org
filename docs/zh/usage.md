# Usage

:::tip
Vapper 要求 Vue 的版本号为 2.6+
:::

## 集成到 Vue CLI 3/4 项目

:::tip
这里有一个简单的可运行的例子: [vapper-vue-cli-example](https://github.com/shuidi-fed/vapper-vue-cli-example)。
:::

1、使用 `vue create` 命令创建项目：

```sh
yarn global add @vue/cli
vue create my-vapper-app
```

如果你已经有了一个使用 `Vue CLI` 创建的项目，则可以跳过此步骤。

2、安装 `@vapper/core`

```sh
yarn add @vapper/core vue-router
```

`Vapper` 项目中必须要安装并使用 [vue-router](https://router.vuejs.org/)，如果你在创建项目的时候已经安装了 `vue-router`，则可以忽略。

3、添加 `npm scripts`

```json
{
  "scripts": {
    "dev": "vapper dev",
    "build": "vapper build",
    "start": "vapper start"
  }
}
```

4、修改入口文件：

最后，你需要按照 `SSR` 的要求修改你的入口文件：[入口文件文档](/zh/entry.md)

## 集成到 Poi 项目

:::tip
这里有一个简单的可运行的例子: [vapper-poi-example](https://github.com/shuidi-fed/vapper-poi-example)。
:::

1、使用 `create-poi-app` 创建项目：

```sh
yarn global add create-poi-app
create-poi-app my-vapper-app
```

如果你已经有了一个 `Poi` 项目，则可以跳过此步骤。

2、安装依赖：

```sh
yarn add @vapper/core @vapper/configer-poi vue vue-router vue-template-compiler -D
```

3、修改 `vapper.config.js`：

```js
module.exports = {
  entry: 'src/index.js'
}
```

因为 `vapper` 默认的入口文件是 `src/main.js`，而 `Poi` 默认的入口文件为 `src/index.js`。

4、添加 `npm scripts`

```json
{
  "scripts": {
    "dev": "vapper dev",
    "build": "vapper build",
    "start": "vapper start"
  }
}
```

5、修改入口文件：

最后，你需要按照 `SSR` 的要求修改你的入口文件：[入口文件文档](/zh/entry.md)
