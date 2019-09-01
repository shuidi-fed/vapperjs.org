# Configer

`Configer` provides Webpack configuration for Vapper. We introduced Vapper only responsible for the [necessary webpack configuration](/introduction.html#necessary-webpack-configuration), which makes Vapper a configuration-independent framework.

## @vapper/configer-vue-cli

This is `Vapper`'s default `Configer`, which reads `@vue/cli-service` installed under the current project and uses it to resolve the corresponding `Webpack` configuration. So `Vapper` can be used with `Vue CLI`, the benefits of doing this are two-way: `Vapper` has all the `Vue CLI` capabilities, and `Vapper` provides server-side rendering for `Vue CLI`.

:::tip
Since this is `vapper` default `Configer`, usually you don't need to install it manually.
:::

```sh
yarn add @vapper/configer-vue-cli -D
```

## @vapper/configer-poi

[Poi](https://poi.js.org/) is also an excellent `Webpack` management tool. If your project uses `Poi`, it will be easy to integrate with `Vapper`. You can view: [Usage - integrated into Poi project](/usage.html#integrated-into-the-poi-project) for details.

```sh
yarn add @vapper/configer-poi -D
```

## Writing Configer

As the official documentation describes: [Introducing a Build Step](https://ssr.vuejs.org/guide/structure.html#introducing-a-build-step). We need two `Webpack` configurations, one to build the server bundle and the other to build the client bundle. So a `Configer` is essentially a class that contains the `getServerConfig` method and the `getClientConfig` method:

```js
class MyOwnConfiger {
  getServerConfig () {
    return {...}  // Return server configuration
  }

  getClientConfig () {
    return {...}  // Return client configuration
  }
}
```

This class will be instantiated internally by `Vapper` and call the two methods above. As long as these two methods return the correct `Webpack` configuration object, `Vapper` can use it correctly to build the project. This means that you can implement your own `Configer`, which does not depend on any `Webpack` management tools (eg `Vue CLI` or `Poi`).

Vapper will check the project's package.json file and automatically load the first Configer it finds. So in order for Vapper to recognize whether a package is a Configer, we need to stipulate the name of the package. The following is some legal naming convention:

- `@vapper/configer-xxxx`: Official `Configer`
- `vapper-configer-xxxx`: Community `Configer`
- `@scope/vapper-configer-xxxx`: Community `Configer`
