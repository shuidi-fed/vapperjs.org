# 使用 TypeScript <Badge text="Core 0.10.0+"/>

`@vapper/core` 自 `0.10.0` 起支持 `TypeScript`。实际上，由于 `Vapper` 借助 `Vue-CLI3+` 或 `Poi` 来管理 `webpack` 配置，因此你可以直接使用 `Vue-CLI3+` 或 `Poi` 提供的 `TypeScript` 插件。下面以 `Vue-CLI3` 和 `@vue/cli-plugin-typescript` 为例，演示如何在项目中使用 `TypeScript`。

## 初始化项目

首先，按照 [Usage - 集成到 Vue CLI 3 项目](/zh/usage.html#集成到-vue-cli-3-项目) 中介绍的那样初始化一个新的项目。

## 安装 @vue/cli-plugin-typescript

接着，执行如下命令安装 [@vue/cli-plugin-typescript](https://cli.vuejs.org/core-plugins/typescript.html#vue-cli-plugin-typescript) 插件：

```sh
vue add typescript
```

## 添加类型声明文件

在项目根目录添加 `global.d.ts` 文件，并将如下代码复制到该文件：

```ts
import Vue, { ComponentOptions } from 'vue'
import { MetaInfo, VueMetaPlugin } from 'vue-meta'

declare module 'vue/types/vue' {
  interface Vue {
    $$type: 'server' | 'client'
    error: Error
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    head?: MetaInfo
  }
}
```

最后修改 `tsconfig.json` 中的 `include` 字段：

```json {9}
{
  // 其他配置
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx",
    "global.d.ts"
  ]
}
```

如果不出意外，你已经可以使用 `TypeScript` 开发你的项目了。 