# 静态资源

静态资源的管理并不是 `Vapper` 的职责，`Vapper` 只负责 `SSR`，本质上，由于 `Vapper` 使用 [Vue-CLI](https://cli.vuejs.org/) 或 [Poi](https://poi.js.org/) 管理 `webpack` 配置，因此所有对于资源的处理方式，都遵循 [Vue-CLI](https://cli.vuejs.org/) 和 [Poi](https://poi.js.org/) 的文档：

- [Vue CLI - Static Assets Handling](https://cli.vuejs.org/guide/html-and-static-assets.html#static-assets-handling)
- [Poi - Using the Public Folder](https://poi.js.org/guide/using-the-public-folder.html#using-the-public-folder)