# Usage

:::tip
Vapper requires Vue to be version 2.6+
:::

## Integrated into the Vue CLI 3/4 project

:::tip
Here is a simple and working example: [vapper-vue-cli-example](https://github.com/shuidi-fed/vapper-vue-cli-example).
:::

1. Create a project using the `vue create` command:

```sh
yarn global add @vue/cli
vue create my-vapper-app
```

If you already have a project created with `Vue CLI`, you can skip this step.

2. Install `@vapper/core`

```sh
yarn add @vapper/core vue-router
```

[vue-router](https://router.vuejs.org/) must be installed and used in the `Vapper` project. If you have already installed `vue-router` when creating the project, you can ignore it.

3. add `npm scripts`

```json
{
  "scripts": {
    "dev": "vapper dev",
    "build": "vapper build",
    "start": "vapper start"
  }
}
```

4. Modify the entry file:

Finally, you need to modify your entry file as required by `SSR`: [entry file document](/entry.md)

## Integrated into the Poi project

:::tip
Here is a simple and working example: [vapper-poi-example](https://github.com/shuidi-fed/vapper-poi-example).
:::

1. Create a project with `create-poi-app`:

```sh
yarn global add create-poi-app
create-poi-app my-vapper-app
```

If you already have a `Poi` project, you can skip this step.

2. Installation dependence:

```sh
yarn add @vapper/core @vapper/configer-poi vue vue-router vue-template-compiler -D
```

3. Modify `vapper.config.js`:

```js
module.exports = {
  entry: 'src/index.js'
}
```

Because `vapper`'s default entry file is `src/main.js`, and `Poi`'s default entry file is `src/index.js`.

4. add `npm scripts`

```json
{
  "scripts": {
    "dev": "vapper dev",
    "build": "vapper build",
    "start": "vapper start"
  }
}
```

5. Modify the entry file:

Finally, you need to modify your entry file as required by `SSR`: [entry file document](/entry.md)
