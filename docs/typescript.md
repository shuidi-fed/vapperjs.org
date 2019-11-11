# Use TypeScript <Badge text="Core 0.10.0+"/>

`@vapper/core` supports `TypeScript` since version `0.10.0`. In fact, since Vapper uses `Vue-CLI3+` or `Poi` to manage the webpack configuration, you can use the `TypeScript` plugin provided by `Vue-CLI3+` or `Poi` directly. Let's use `Vue-CLI3` and `@vue/cli-plugin-typescript` as an example to demonstrate how to use `TypeScript` in your project.

## Initialize a project

First, initialize a new project as described in [Usage - Integrating to Vue CLI 3 Projects](/usage.html#integrated-into-the-vue-cli-3-project).

## Install @vue/cli-plugin-typescript

Next, execute the following command to install the [@vue/cli-plugin-typescript](https://cli.vuejs.org/core-plugins/typescript.html#vue-cli-plugin-typescript) plugin:

```sh
vue add typescript
```

## Add type declaration file

Add the `global.d.ts` file to the project root and copy the following code to it:

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

Finally modify the `include` field in `tsconfig.json`:

```json {9}
{
  // Other configurations......
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

If nothing else, you can already develop your project using `TypeScript`.